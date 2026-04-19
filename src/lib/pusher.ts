import Pusher from "pusher";

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// Client-side pusher — lazy-initialized to avoid server-side instantiation
let _pusherClient: any | null = null;

export async function getPusherClient() {
  if (typeof window === "undefined") {
    throw new Error("getPusherClient() can only be called in the browser");
  }
  if (!_pusherClient) {
    const PusherJS = (await import("pusher-js")).default;
    _pusherClient = new PusherJS(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER! }
    );
  }
  return _pusherClient;
}
