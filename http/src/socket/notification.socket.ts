import { getIO } from "./index.js";

export const emitToUser = (userId: string, payload: any) => {
  const io = getIO();

  io.to(userId).emit("notification", payload);
};
