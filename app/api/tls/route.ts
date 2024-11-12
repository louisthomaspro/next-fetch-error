import https from "https";
import type { TLSSocket } from "tls";

export async function GET() {
  const options = {
    hostname: "www.simplebooking.it",
    port: 443,
    method: "GET",
    agent: new https.Agent({
      maxVersion: "TLSv1.3",
      minVersion: "TLSv1.2",
      secureProtocol: "TLS_method",
    }),
  };

  try {
    const data = await new Promise((resolve, reject) => {
      const req = https.request(options, (response) => {
        response.on("data", () => {});
        response.on("end", () => {
          const tlsSocket = response.socket as TLSSocket;
          resolve({
            ok: true,
            data: {
              tlsVersion: tlsSocket.getTLSVersion(),
              cipher: tlsSocket.getCipher(),
            },
          });
        });
      });

      req.on("error", (error) => {
        reject({
          ok: false,
          data: { message: "Connection failed", error: error.message },
        });
      });

      req.end();
    });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}