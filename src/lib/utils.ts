import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lac`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .concat("-", Math.random().toString(36).substring(2, 8));
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

export const propertyTypeLabels: Record<string, string> = {
  HOUSE: "House",
  APARTMENT: "Apartment",
  CONDO: "Condo",
  VILLA: "Villa",
  LAND: "Land",
  COMMERCIAL: "Commercial",
  TOWNHOUSE: "Townhouse",
  STUDIO: "Studio",
};

export const statusLabels: Record<string, string> = {
  FOR_SALE: "For Sale",
  FOR_RENT: "For Rent",
  SOLD: "Sold",
  RENTED: "Rented",
  PENDING: "Pending",
  ARCHIVED: "Archived",
};

export const statusColors: Record<string, string> = {
  FOR_SALE: "bg-emerald-500",
  FOR_RENT: "bg-blue-500",
  SOLD: "bg-red-500",
  RENTED: "bg-orange-500",
  PENDING: "bg-yellow-500",
  ARCHIVED: "bg-gray-500",
};
