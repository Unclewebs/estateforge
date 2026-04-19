import { notFound } from "next/navigation";
import Image from "next/image";
import { getPropertyBySlug, incrementViews } from "@/lib/actions/property";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin, Bed, Bath, Maximize, Calendar, Car, Building, Eye, Heart, Share2, Phone, Mail,
} from "lucide-react";
import { formatPrice, statusLabels, statusColors, propertyTypeLabels, timeAgo } from "@/lib/utils";
import { InquiryForm } from "@/components/inquiry-form";
import { FavoriteButton } from "@/components/favorite-button";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };
  return {
    title: `${property.title} - EstateForge`,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: property.images[0] ? [property.images[0]] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  // Increment views
  await incrementViews(property.id);

  const contact = property.agent || property.owner;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden mb-8">
        <div className="relative aspect-[4/3] md:aspect-auto md:row-span-2">
          {property.images[0] ? (
            <Image src={property.images[0]} alt={property.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full min-h-[300px] bg-muted flex items-center justify-center">
              <Building className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {property.images.slice(1, 5).map((img: string, i: number) => (
            <div key={i} className="relative aspect-[4/3]">
              <Image src={img} alt={`${property.title} ${i + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={`${statusColors[property.status]} text-white border-0`}>
                {statusLabels[property.status]}
              </Badge>
              <Badge variant="secondary">{propertyTypeLabels[property.propertyType]}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{property.title}</h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-2">
              <MapPin className="h-4 w-4" />
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </p>
            <p className="text-4xl font-bold text-primary mt-4">{formatPrice(property.price)}</p>
            {property.status === "FOR_RENT" && <span className="text-muted-foreground">/month</span>}
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Bed, label: "Bedrooms", value: property.bedrooms },
              { icon: Bath, label: "Bathrooms", value: property.bathrooms },
              { icon: Maximize, label: "Sq. Ft.", value: property.squareFeet?.toLocaleString() },
              { icon: Car, label: "Parking", value: property.parking },
              { icon: Calendar, label: "Year Built", value: property.yearBuilt },
              { icon: Building, label: "Stories", value: property.stories },
              { icon: Maximize, label: "Lot Size", value: property.lotSize ? `${property.lotSize} acres` : null },
              { icon: Eye, label: "Views", value: property.views },
            ]
              .filter((d) => d.value != null)
              .map((detail) => (
                <div key={detail.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <detail.icon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{detail.label}</p>
                    <p className="font-semibold">{detail.value}</p>
                  </div>
                </div>
              ))}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">About This Property</h2>
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity: string) => (
                  <Badge key={amenity} variant="outline" className="text-sm py-1 px-3">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Virtual Tour */}
          {property.virtualTourUrl && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Virtual Tour</h2>
              <a href={property.virtualTourUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">Take Virtual Tour</Button>
              </a>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="flex gap-2">
            <FavoriteButton propertyId={property.id} />
            <Button variant="outline" className="flex-1 gap-2">
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>

          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {property.agent ? "Listed by Agent" : "Listed by Owner"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.imageUrl || ""} />
                  <AvatarFallback>
                    {contact.firstName?.[0]}
                    {contact.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {contact.firstName} {contact.lastName}
                  </p>
                  {property.agent?.agency && (
                    <p className="text-sm text-muted-foreground">{property.agent.agency}</p>
                  )}
                </div>
              </div>
              {contact.phone && (
                <Button variant="outline" className="w-full gap-2">
                  <Phone className="h-4 w-4" /> {contact.phone}
                </Button>
              )}
              <Button variant="outline" className="w-full gap-2">
                <Mail className="h-4 w-4" /> {contact.email}
              </Button>
            </CardContent>
          </Card>

          {/* Inquiry Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Send Inquiry</CardTitle>
            </CardHeader>
            <CardContent>
              <InquiryForm propertyId={property.id} toUserId={contact.id} />
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center">
            Listed {timeAgo(property.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
