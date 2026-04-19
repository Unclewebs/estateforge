"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Bed, Bath, Maximize, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, statusLabels, statusColors, propertyTypeLabels } from "@/lib/utils";
import { toggleFavorite } from "@/lib/actions/property";
import { useAuth } from "@clerk/nextjs";
import { useTransition } from "react";

interface PropertyCardProps {
  property: {
    id: string;
    slug: string;
    title: string;
    price: number;
    propertyType: string;
    status: string;
    bedrooms: number | null;
    bathrooms: number | null;
    squareFeet: number | null;
    address: string;
    city: string;
    state: string;
    images: string[];
    views: number;
    _count?: { favorites: number };
  };
  isFavorited?: boolean;
}

export function PropertyCard({ property, isFavorited = false }: PropertyCardProps) {
  const { isSignedIn } = useAuth();
  const [isPending, startTransition] = useTransition();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSignedIn) return;
    startTransition(() => {
      toggleFavorite(property.id);
    });
  };

  return (
    <Link href={`/properties/${property.slug}`}>
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative aspect-[4/3] overflow-hidden">
          {property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Maximize className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={`${statusColors[property.status] || "bg-gray-500"} text-white border-0`}>
              {statusLabels[property.status]}
            </Badge>
            <Badge variant="secondary">{propertyTypeLabels[property.propertyType]}</Badge>
          </div>
          {isSignedIn && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full"
              onClick={handleFavorite}
              disabled={isPending}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </Button>
          )}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Eye className="h-3 w-3" /> {property.views}
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-2xl font-bold text-primary">{formatPrice(property.price)}</p>
          <h3 className="font-semibold mt-1 line-clamp-1">{property.title}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3.5 w-3.5" />
            {property.address}, {property.city}, {property.state}
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {property.bedrooms} bd</span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {property.bathrooms} ba</span>
            )}
            {property.squareFeet != null && (
              <span className="flex items-center gap-1"><Maximize className="h-4 w-4" /> {property.squareFeet.toLocaleString()} sqft</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
