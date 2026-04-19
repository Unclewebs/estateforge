"use client";

import { useState, useTransition } from "react";
import { sendMessage } from "@/lib/actions/messaging";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function MessageInput({ receiverId }: { receiverId: string }) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSend = () => {
    if (!content.trim()) return;
    startTransition(async () => {
      await sendMessage(receiverId, content);
      setContent("");
    });
  };

  return (
    <div className="flex gap-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <Button onClick={handleSend} disabled={isPending || !content.trim()} size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
