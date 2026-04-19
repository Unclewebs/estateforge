"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema, type PropertyFormData } from "@/lib/validations";
import { createProperty, updateProperty } from "@/lib/actions/property";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

const amenitiesOptions = [
  "Air Conditioning", "Heating", "Washer/Dryer", "Dishwasher", "Fireplace",
  "Pool", "Hot Tub", "Gym", "Garage", "Balcony", "Patio", "Garden",
  "Security System", "Elevator", "Doorman", "Pet Friendly", "Hardwood Floors",
  "Stainless Steel Appliances", "Walk-in Closet", "Storage", "EV Charging",
];

interface PropertyFormProps {
  initialData?: Partial<PropertyFormData> & { id?: string };
  mode?: "create" | "edit";
}

export function PropertyForm({ initialData, mode = "create" }: PropertyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialData?.amenities || []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      propertyType: "HOUSE",
      status: "FOR_SALE",
      bedrooms: undefined,
      bathrooms: undefined,
      squareFeet: undefined,
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      images: [],
      amenities: [],
      ...initialData,
    },
  });

  const onSubmit = (data: PropertyFormData) => {
    startTransition(async () => {
      data.images = images;
      data.amenities = selectedAmenities;
      if (mode === "edit" && initialData?.id) {
        await updateProperty(initialData.id, data);
        router.push("/dashboard");
      } else {
        await createProperty(data);
        router.push("/dashboard");
      }
    });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-8">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="Beautiful 3BR Home in Downtown" />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={5} placeholder="Describe your property..." />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" type="number" {...register("price")} />
              {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <Label>Property Type</Label>
              <Select
                value={watch("propertyType")}
                onValueChange={(v) => setValue("propertyType", v as PropertyFormData["propertyType"])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOUSE">House</SelectItem>
                  <SelectItem value="APARTMENT">Apartment</SelectItem>
                  <SelectItem value="CONDO">Condo</SelectItem>
                  <SelectItem value="VILLA">Villa</SelectItem>
                  <SelectItem value="LAND">Land</SelectItem>
                  <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                  <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
                  <SelectItem value="STUDIO">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(v) => setValue("status", v as PropertyFormData["status"])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOR_SALE">For Sale</SelectItem>
                  <SelectItem value="FOR_RENT">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input id="bedrooms" type="number" {...register("bedrooms")} />
            </div>
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input id="bathrooms" type="number" {...register("bathrooms")} />
            </div>
            <div>
              <Label htmlFor="squareFeet">Square Feet</Label>
              <Input id="squareFeet" type="number" {...register("squareFeet")} />
            </div>
            <div>
              <Label htmlFor="lotSize">Lot Size (acres)</Label>
              <Input id="lotSize" type="number" step="0.01" {...register("lotSize")} />
            </div>
            <div>
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input id="yearBuilt" type="number" {...register("yearBuilt")} />
            </div>
            <div>
              <Label htmlFor="parking">Parking Spaces</Label>
              <Input id="parking" type="number" {...register("parking")} />
            </div>
            <div>
              <Label htmlFor="stories">Stories</Label>
              <Input id="stories" type="number" {...register("stories")} />
            </div>
            <div>
              <Label htmlFor="virtualTourUrl">Virtual Tour URL</Label>
              <Input id="virtualTourUrl" {...register("virtualTourUrl")} placeholder="https://..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" {...register("address")} />
              {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} />
              {errors.state && <p className="text-sm text-destructive mt-1">{errors.state.message}</p>}
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input id="zipCode" {...register("zipCode")} />
              {errors.zipCode && <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden border">
                <Image src={img} alt={`Photo ${i + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
          </div>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "estateforge"}
            onSuccess={(result: unknown) => {
              const info = (result as { info?: { secure_url?: string } })?.info;
              if (info?.secure_url) {
                setImages((prev) => [...prev, info.secure_url!]);
              }
            }}
          >
            {({ open }) => (
              <Button type="button" variant="outline" onClick={() => open()} className="gap-2">
                <ImagePlus className="h-4 w-4" /> Upload Photos
              </Button>
            )}
          </CldUploadWidget>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {amenitiesOptions.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                  selectedAmenities.includes(amenity)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} size="lg">
          {isPending ? "Saving..." : mode === "edit" ? "Update Property" : "Publish Listing"}
        </Button>
      </div>
    </form>
  );
}
