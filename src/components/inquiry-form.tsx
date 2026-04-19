"use client";

import { useTransition, useState } from "react";
import { sendInquiry } from "@/lib/actions/messaging";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";

export function InquiryForm({ propertyId, toUserId }: { propertyId: string; toUserId: string }) {
  const { isSignedIn } = useAuth();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  if (!isSignedIn) {
    return <p className="text-sm text-muted-foreground">Sign in to send an inquiry.</p>;
  }

  if (sent) {
    return <p className="text-sm text-green-600 font-medium">✓ Inquiry sent successfully!</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          await sendInquiry(propertyId, toUserId, message);
          setSent(true);
        });
      }}
      className="space-y-3"
    >
      <Textarea
        placeholder="I'm interested in this property..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        required
        minLength={10}
      />
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  );
}
