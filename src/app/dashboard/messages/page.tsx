import { redirect } from "next/navigation";
import { syncUser } from "@/lib/auth";
import { getConversations } from "@/lib/actions/messaging";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

export default async function MessagesPage() {
  const user = await syncUser();
  if (!user) redirect("/sign-in");

  const conversations = await getConversations().catch(() => []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl font-medium">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {conversations.map((conv: any) => (
            <Link key={conv.partnerId} href={`/dashboard/messages/${conv.partnerId}`}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={conv.partner.imageUrl || ""} />
                    <AvatarFallback>{conv.partner.firstName?.[0]}{conv.partner.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{conv.partner.firstName} {conv.partner.lastName}</p>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage.content}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{timeAgo(conv.lastMessage.createdAt)}</p>
                    {conv.unreadCount > 0 && (
                      <Badge className="mt-1">{conv.unreadCount}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
