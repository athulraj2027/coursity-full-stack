import type {
  DtlsParameters,
  Router,
  Transport,
  WebRtcTransport,
} from "mediasoup/types";

export async function createTransport(
  router: Router,
  direction: "recv" | "send",
) {
  const transport: WebRtcTransport = await router.createWebRtcTransport({
    listenIps: [
      {
        ip: "0.0.0.0",
        announcedIp: process.env.ANNOUNCED_IP as string,
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
<<<<<<< HEAD

// export async function createPlainTransport(router: Router) {
//   const transport: PlainTransport = await router.createPlainTransport({
//     listenIp: ANNOUNCED_IP,
//     rtcpMux: false,
//     comedia: false,
//   });
// }
=======
>>>>>>> parent of fee2790 (fix(ui && lecture))
