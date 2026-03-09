/* eslint-disable @typescript-eslint/no-explicit-any */
import { socket } from "@/lib/socket";
import * as mediasoupClient from "mediasoup-client";
import { Producer, Transport, TransportOptions } from "mediasoup-client/types";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type RemoteStreamData = {
  stream: MediaStream;
  appData?: {
    lectureId?: string;
    mediaTag?: string;
    username: string;
  };
  kind: "audio" | "video";
  producerId: string;
  paused?: boolean;
};

export const useJoinRoom = () => {
  // device refs
  const deviceRef = useRef<mediasoupClient.Device | null>(null);
  const sendTransportRef = useRef<Transport | null>(null);
  const recvTransportRef = useRef<Transport | null>(null);

  //producer refs
  const videoProducerRef = useRef<Producer | undefined>(undefined);
  const audioProducerRef = useRef<Producer | undefined>(undefined);
  const screenProducerRef = useRef<Producer | undefined>(undefined);

  //local media refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localScreenStream, setLocalScreenStream] =
    useState<MediaStream | null>(null);
  const localScreenRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [localMicStream, setLocalMicStream] = useState<MediaStream | null>(
    null,
  );

  //consumer refs
  const consumersRef = useRef<Map<string, mediasoupClient.types.Consumer>>(
    new Map(),
  );
  const [remoteStreams, setRemoteStreams] = useState<
    Map<string, RemoteStreamData>
  >(new Map());

  const [existingUsers, setExistingUsers] = useState<object[]>([]);

  useEffect(() => {
    return () => {
      sendTransportRef.current?.close();
      recvTransportRef.current?.close();
      videoProducerRef.current?.close();
      audioProducerRef.current?.close();
      screenProducerRef.current?.close();
    };
  }, []);

  const consume = async (producer: {
    appData: { lectureId: string; username: string };
    kind: "video" | "audio";
    userId: string;
    paused: boolean;
    producerId: string;
  }) => {
    console.log("producer for consumption : ", producer);
    socket.emit(
      "consume",
      {
        rtpCapabilities: deviceRef.current?.rtpCapabilities,
        lectureId: producer.appData.lectureId,
        producer,
        transportId: recvTransportRef.current?.id,
      },
      async (data: any) => {
        console.log("data after consume event : ", data);
        if (!data.success) return;
        const { params } = data;
        const consumer = await recvTransportRef.current!.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
          appData: params.appData,
        });

        const key = `${params.producerId}-${params.appData.mediaTag || "camera"}`;

        consumer.on("trackended", () => {
          console.log("track ended");
        });

        console.log("consumer created:", consumer);
        consumersRef.current.set(consumer.id, consumer);

        const stream = new MediaStream();
        stream.addTrack(consumer.track);
        setRemoteStreams((prev) => {
          const updated = new Map(prev);
          updated.set(key, {
            stream,
            appData: consumer.appData,
            kind: consumer.kind,
            producerId: consumer.producerId,
            paused: consumer.paused,
          });
          return updated;
        });
      },
    );
  };

  const removeProducerById = (producerId: string) => {
    consumersRef.current.forEach((consumer, consumerId) => {
      if (consumer.producerId === producerId) {
        consumer.close();
        consumersRef.current.delete(consumerId);
      }
    });

    // Remove from remoteStreams
    setRemoteStreams((prev) => {
      const updated = new Map(prev);

      for (const [key] of updated.entries()) {
        if (key.startsWith(producerId)) {
          updated.delete(key);
        }
      }

      return updated;
    });
  };

  const createMeetingEssentials = async (
    rtpCapabilities: mediasoupClient.types.RtpCapabilities,
    lectureId: string,
    existingUsers: object[],
  ) => {
    console.log("rtpcapabilities : ", rtpCapabilities);
    const device = new mediasoupClient.Device();
    await device.load({ routerRtpCapabilities: rtpCapabilities });
    deviceRef.current = device;
    console.log("new device loaded : ", device, "loaded : ", device.loaded);

    socket.emit(
      "create-transport",
      { direction: "send", appData: { lectureId } },
      async (params: TransportOptions) => {
        console.log("Transport params received for send : ", params);
        const sendTransport = device.createSendTransport(params);

        sendTransport?.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            console.log(" Connect event fired - sending DTLS");
            console.log("dtls received : ", dtlsParameters);

            try {
              socket.emit(
                "connect-transport",
                {
                  transportId: sendTransport.id,
                  dtlsParameters,
                  appData: { lectureId },
                },
                (response: { success: boolean }) => {
                  console.log("Server response after connecting :", response);

                  if (response?.success) {
                    callback(); // Tell transport connection succeeded
                  } else {
                    const error = new Error("Connection failed");
                    errback(error);
                  }
                },
              );
            } catch (error) {
              console.error(" Connect error:", error);
              errback(error as Error);
            }
          },
        );

        sendTransport?.on("produce", ({ kind, rtpParameters, appData }, cb) => {
          console.log("produce event fired");
          socket.emit(
            "produce",
            {
              transportId: sendTransport.id,
              kind,
              rtpParameters,

              appData: { ...appData, lectureId },
            },
            ({ id }: { id: string }) => cb({ id }),
          );
        });
        sendTransportRef.current = sendTransport;
      },
    );

    socket.emit(
      "create-transport",
      { direction: "recv", appData: { lectureId } },
      async (params: TransportOptions) => {
        console.log("Transport params received for recv : ", params);
        const recvTransport = device.createRecvTransport(params);
        recvTransport?.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            console.log(" Connect event fired - sending DTLS");
            console.log("dtls received : ", dtlsParameters);

            try {
              socket.emit(
                "connect-transport",
                {
                  transportId: recvTransport.id,
                  dtlsParameters,
                  appData: { lectureId },
                },
                (response: { success: boolean }) => {
                  console.log(" Server response after connecting :", response);
                  if (response?.success) {
                    callback();
                  } else {
                    const error = new Error("Connection failed");
                    errback(error);
                  }
                },
              );
            } catch (error) {
              console.error(" Connect error:", error);
              errback(error as Error);
            }
          },
        );
        recvTransportRef.current = recvTransport;

        console.log("emitting get producers");
        socket.emit(
          "get-producers",
          { lectureId },
          async (res: {
            success: boolean;
            producers: {
              appData: { lectureId: string; username: string };
              kind: "video" | "audio";
              userId: string;
              paused: boolean;
              producerId: string;
            }[];
          }) => {
            // console.log("producers : ", res.producers);
            for (const producer of res.producers) {
              await consume(producer);
            }
          },
        );
      },
    );

    setExistingUsers(existingUsers);
    return;
  };

  const startVideo = async (lectureId: string) => {
    try {
      const mediastream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setLocalStream(mediastream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediastream;
      }

      const track = mediastream.getVideoTracks()[0];
      if (videoProducerRef.current) {
        await videoProducerRef.current.replaceTrack({
          track,
        });
        videoProducerRef.current.resume();
        return;
      }

      const videoProducer = await sendTransportRef.current?.produce({
        track,
      });

      videoProducer?.observer.on("pause", () => {
        console.log("pausing producer...");
        console.log("video producer : ", videoProducer);
        socket.emit(
          "pause-produce",
          {
            producerId: videoProducer.id,
            lectureId,
          },
          ({ success }: { success: boolean; producerId: string }) => {
            console.log("pause : ", success);
          },
        );
      });

      videoProducer?.observer.on("resume", () => {
        console.log("resuming producer ...");
        socket.emit("resume-produce", {
          producerId: videoProducer.id,
          lectureId,
        });
      });

      videoProducer?.observer.on("close", () => {});

      videoProducerRef.current = videoProducer;
    } catch (error) {
      console.log("Error starting video:", error);
      toast.error("Camera permission required");
    }
  };

  const stopVideo = async () => {
    try {
      videoProducerRef.current?.pause();
      const track = localStream?.getVideoTracks()[0];
      track?.stop();
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    } catch (error) {
      console.log("Error in stopping video : ", error);
      toast.error("Failed to turn off camera.");
    }
  };

  const pauseVideoUI = (producerId: string) => {
    setRemoteStreams((prev) => {
      const updated = new Map(prev);

      for (const [key, value] of updated.entries()) {
        if (value.producerId === producerId) {
          updated.set(key, {
            ...value,
            paused: true,
          });
        }
      }

      return updated;
    });
  };

  const resumeVideoUI = (producerId: string) => {
    setRemoteStreams((prev) => {
      const updated = new Map(prev);

      for (const [key, value] of updated.entries()) {
        if (value.producerId === producerId) {
          updated.set(key, {
            ...value,
            paused: false,
          });
        }
      }

      return updated;
    });
  };

  const startMic = async (lectureId: string) => {
    try {
      const mediastream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setLocalMicStream(mediastream);
      const track = mediastream.getAudioTracks()[0];

      if (audioProducerRef.current) {
        await audioProducerRef.current.replaceTrack({
          track,
        });
        audioProducerRef.current.resume();
        return;
      }

      const audioProducer = await sendTransportRef.current?.produce({
        track,
      });

      audioProducer?.observer.on("pause", () => {
        socket.emit(
          "pause-produce",
          {
            producerId: audioProducer.id,
            lectureId,
          },
          ({ success }: { success: boolean; producerId: string }) => {
            console.log("pause : ", success);
          },
        );
      });

      audioProducer?.observer.on("resume", () => {
        socket.emit("resume-produce", {
          producerId: audioProducer.id,
          lectureId,
        });
      });

      audioProducer?.observer.on("close", () => {});
      audioProducerRef.current = audioProducer;
    } catch (error) {
      console.log("Error starting mic:", error);
      toast.error("Mic permission required");
    }
  };

  const stopMic = async () => {
    try {
      audioProducerRef.current?.pause();
      const track = localMicStream?.getAudioTracks()[0];
      track?.stop();
    } catch (error) {
      console.log("Error muting mic:", error);
      toast.error("Failed to mute mic");
    }
  };

  const startScreenShare = async (lectureId: string) => {
    try {
      const mediastream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setLocalScreenStream(mediastream);
      if (localScreenRef.current) {
        localScreenRef.current.srcObject = mediastream;
      }
      const track = mediastream.getVideoTracks()[0];
      track.onended = () => {
        console.log("Screen share ended by browser");

        screenProducerRef.current?.close();
        screenProducerRef.current = undefined;
      };
      const screenProducer = await sendTransportRef.current?.produce({
        track,
        appData: { mediaTag: "screen" },
      });

      if (!screenProducer) {
        toast.error("Failed to share screen");
        return;
      }

      screenProducer.observer.on("close", () => {
        socket.emit(
          "stop-screen-share",
          { producerId: screenProducer.id, lectureId },
          () => {
            console.log("screenshare closed ");
          },
        );
      });

      screenProducerRef.current = screenProducer;
    } catch (error) {
      console.log("Error starting screenshare:", error);
      toast.error("Screen permission required");
    }
  };

  const stopScreenShare = async () => {
    try {
      screenProducerRef.current?.close();
      const track = localScreenStream?.getVideoTracks()[0];
      track?.stop();
      setLocalScreenStream(null);
    } catch (error) {
      console.log("Error stopping screenshare:", error);
      toast.error("Failed to stop screenshare");
    }
  };

  const leaveRoom = async (lectureId: string) => {
    socket.emit("leave-room", { lectureId });
  };

  const raiseHand = async () => {};
  const lowerHand = async () => {};

  return {
    createMeetingEssentials,
    stopScreenShare,
    startMic,
    startVideo,
    startScreenShare,
    stopMic,
    stopVideo,
    remoteStreams,
    localStream,
    localScreenStream,
    existingUsers,
    setExistingUsers,
    consume,
    leaveRoom,
    removeProducerById,
    pauseVideoUI,
    resumeVideoUI,
    raiseHand,
    lowerHand,
  };
};
