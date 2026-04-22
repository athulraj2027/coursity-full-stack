import type {
  DtlsParameters,
  PlainTransport,
  Router,
  Transport,
  WebRtcTransport,
} from "mediasoup/types";

const ANNOUNCED_IP = process.env.ANNOUNCED_IP as string;

export async function createTransport(
  router: Router,
  direction: "recv" | "send",
) {
  const transport: WebRtcTransport = await router.createWebRtcTransport({
    listenIps: [
      {
        ip: "0.0.0.0",
        announcedIp: ANNOUNCED_IP ,
      },
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    appData: { direction },
  });
  return transport;
}

export async function connectTransport(
  transport: Transport,
  dtlsParameters: DtlsParameters,
) {
  await transport.connect({ dtlsParameters });
  return { success: true };
}

// export async function createPlainTransport(router: Router) {
//   const transport: PlainTransport = await router.createPlainTransport({
//     listenIp: ANNOUNCED_IP,
//     rtcpMux: false,
//     comedia: false,
//   });
// }
