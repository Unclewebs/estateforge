import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  propertyType: z.enum(["HOUSE", "APARTMENT", "CONDO", "VILLA", "LAND", "COMMERCIAL", "TOWNHOUSE", "STUDIO"]),
  status: z.enum(["FOR_SALE", "FOR_RENT"]).default("FOR_SALE"),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  squareFeet: z.coerce.number().positive().optional(),
  lotSize: z.coerce.number().positive().optional(),
  yearBuilt: z.coerce.number().int().min(1800).max(new Date().getFullYear()).optional(),
  parking: z.coerce.number().int().min(0).optional(),
  stories: z.coerce.number().int().min(1).optional(),
  address: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(3),
  country: z.string().default("US"),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  images: z.array(z.string()).default([]),
  virtualTourUrl: z.string().url().optional().or(z.literal("")),
  amenities: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const inquirySchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters"),
  propertyId: z.string(),
});

export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  receiverId: z.string(),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  propertyType: z.string().optional(),
  status: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  bio: z.string().optional(),
  licenseNumber: z.string().optional(),
  agency: z.string().optional(),
});
