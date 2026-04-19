import { redirect } from "next/navigation";
import { syncUser } from "@/lib/auth";
import { getMessagesWith } from "@/lib/actions/messaging";
import { db } from "@/lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageInput } from "@/components/message-input";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ partnerId: string }>;
}

export default async function ConversationPage({ params }: Props) {
  const { partnerId } = await params;
  const user = await syncUser();
  if (!user) redirect("/sign-in");

  const [messages, partner] = await Promise.all([
    getMessagesWith(partnerId),
    db.user.findUnique({ where: { id: partnerId } }),
  ]);

  if (!partner) redirect("/dashboard/messages");

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <Avatar>
          <AvatarImage src={partner.imageUrl || ""} />
          <AvatarFallback>{partner.firstName?.[0]}{partner.lastName?.[0]}</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-semibold">{partner.firstName} {partner.lastName}</h1>
      </div>

      <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className={cn("flex", msg.senderId === user.id ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-2",
                msg.senderId === user.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <MessageInput receiverId={partnerId} />
    </div>
  );
}
