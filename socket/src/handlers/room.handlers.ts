import { createRouter } from "../mediasoup/router.js";
import { Room } from "../store/room.js";
import type { Server, Socket } from "socket.io";
import { User } from "../store/user.js";
import { roomStore } from "../store/roomStore.js";
import { userStore } from "../store/userStore.js";
import { callInternalApi } from "../lib/http.js";

export async function CreateRoomHandler(
  socket: Socket,
  lectureId: string,
  cb: (data: any) => void,
) {
  try {
    const { id, userId, role, username } = socket;
    if (role !== "TEACHER") {
      cb({ success: false, message: "Only teacher can create room" });
      return;
    }
    const existingRoom = roomStore.getRoom(lectureId);
    if (existingRoom) {
      cb({ success: true });
      return;
    }
    const router = await createRouter();
    const room = new Room(lectureId, router, username, userId);
    roomStore.addRoom(lectureId, room);

    cb({ success: true });
  } catch (err) {
    console.error("CreateRoom error:", err);
    cb({ success: false });
  }
}

export async function JoinRoomHandler(
  io: Server,
  socket: Socket,
  lectureId: string,
  cb: (data: any) => void,
) {
  try {
    const { id, userId, username } = socket;
    const room = roomStore.getRoom(lectureId);
    if (!room) {
      cb({ success: false, message: "Room not found" });
      return;
    }

    const existingUser = room.peers.get(userId);

    console.log("existing user : ", existingUser);
    if (existingUser) {
      cb({ success: false });
      return;
    }

    const existingUsers = room.getAllUsernames();
    console.log("existing users  :", existingUsers);
    const user = new User(id, userId, username, lectureId);

    room.addPeer(user);
    console.log("room  : ", room);
    userStore.add(id, user);

    socket.join(lectureId);

    socket.to(lectureId).emit("new-user-joined", {
      userId,
      username,
    });

    cb({
      success: true,
      rtpCapabilities: room.router.rtpCapabilities,
      existingUsers,
    });
  } catch (err) {
    console.error("JoinRoom error:", err);
    cb({ success: false });
  }
}

export async function DisconnectHandler(socket: Socket) {
  console.log("disconnecting the user : ", socket.id);
  const { username, userId, role } = socket;
  const user = userStore.get(socket.id);
  if (!user) return;

  const room = roomStore.getRoom(user.lectureId);
  if (!room) return;

  for (const transport of user.transports.values()) transport.close();
  for (const producer of user.producers.values()) producer.close();
  for (const consumer of user.consumers.values()) consumer.close();

  room.peers.delete(user.userId);

  socket
    .to(user.lectureId)
    .emit("peer-left", { username, socketId: socket.id });

  // 4. If teacher disconnected
  if (user.userId === room.teacherId) {
    room.teacherDisconnectedAt = Date.now();
    setTimeout(async () => {
      const stillDisconnected = !room.peers.has(room.teacherId);

      if (stillDisconnected) {
        // await endLectureService(user.lectureId);
        await callInternalApi(
          `/lectures/teacher/${user.lectureId}/end`,
          "POST",
          {},
          { userId, role },
        );
        socket.to(user.lectureId).emit("lecture-ended");
        roomStore.removeRoom(user.lectureId);
      }
    }, 120000); // 2 minutes
  } else {
    try {
      await callInternalApi(
        `/lectures/${user.lectureId}/leave`,
        "PATCH",
        {},
        {
          userId,
          role,
        },
      );
    } catch (error) {
      console.log("api failed", error);
    }
  }
}

export async function LeaveRoomHandler(socket: Socket) {
  const { userId, role } = socket;
  const user = userStore.get(socket.id);
  if (!user) return;

  const room = roomStore.getRoom(user.lectureId);
  if (!room) return;

  if (user.userId === room.teacherId) {
    for (const transport of user.transports.values()) transport.close();
    for (const producer of user.producers.values()) producer.close();
    for (const consumer of user.consumers.values()) consumer.close();

    room.peers.delete(user.userId);
    console.log("emitting the lecture ended");
    try {
      await callInternalApi(
        `/lectures/teacher/${user.lectureId}/end`,
        "POST",
        {},
        { userId, role },
      );
    } catch (error) {
      console.log("api failed", error);
    }

    socket.to(user.lectureId).emit("lecture-ended");
    socket.to(user.lectureId).socketsLeave(user.lectureId);
    roomStore.removeRoom(user.lectureId);

    return;
  }
  socket.disconnect();
  return;
}

export function CloseRoomHandler(socket: Socket, lectureId: string) {}
