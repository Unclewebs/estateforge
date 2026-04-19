"use client";

import { useTransition } from "react";
import { toggleFavorite } from "@/lib/actions/property";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export function FavoriteButton({ propertyId, isFavorited = false }: { propertyId: string; isFavorited?: boolean }) {
  const { isSignedIn } = useAuth();
  const [isPending, startTransition] = useTransition();

  if (!isSignedIn) return null;

  return (
    <Button
      variant="outline"
      className="flex-1 gap-2"
      disabled={isPending}
      onClick={() => startTransition(() => { toggleFavorite(propertyId); })}
    >
      <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
      {isFavorited ? "Saved" : "Save"}
    </Button>
  );
}
