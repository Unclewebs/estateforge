"use server";

import { db } from "@/lib/db";
import { requireUser, requireRole } from "@/lib/auth";
import { propertySchema, type PropertyFormData } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createProperty(data: PropertyFormData) {
  const user = await requireUser();
  if (!user.roles.includes("SELLER") && !user.roles.includes("AGENT")) {
    throw new Error("Only sellers and agents can create listings");
  }

  const validated = propertySchema.parse(data);
  const slug = generateSlug(validated.title);

  const property = await db.property.create({
    data: {
      ...validated,
      slug,
      ownerId: user.id,
      agentId: user.roles.includes("AGENT") ? user.id : undefined,
    },
  });

  revalidatePath("/properties");
  revalidatePath("/dashboard");
  return property;
}

export async function updateProperty(id: string, data: Partial<PropertyFormData>) {
  const user = await requireUser();
  const property = await db.property.findUnique({ where: { id } });
  if (!property) throw new Error("Property not found");
  if (property.ownerId !== user.id && property.agentId !== user.id) {
    throw new Error("Unauthorized");
  }

  const updated = await db.property.update({
    where: { id },
    data: { ...data },
  });

  revalidatePath("/properties");
  revalidatePath(`/properties/${updated.slug}`);
  revalidatePath("/dashboard");
  return updated;
}

export async function deleteProperty(id: string) {
  const user = await requireUser();
  const property = await db.property.findUnique({ where: { id } });
  if (!property) throw new Error("Property not found");
  if (property.ownerId !== user.id && property.agentId !== user.id) {
    throw new Error("Unauthorized");
  }

  await db.property.delete({ where: { id } });
  revalidatePath("/properties");
  revalidatePath("/dashboard");
}

export async function toggleFavorite(propertyId: string) {
  const user = await requireUser();
  const existing = await db.favorite.findUnique({
    where: { userId_propertyId: { userId: user.id, propertyId } },
  });

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
  } else {
    await db.favorite.create({ data: { userId: user.id, propertyId } });
  }

  revalidatePath("/properties");
  revalidatePath("/dashboard");
}

export async function incrementViews(propertyId: string) {
  await db.property.update({
    where: { id: propertyId },
    data: { views: { increment: 1 } },
  });
}

export async function getProperties(params: {
  query?: string;
  propertyType?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  state?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}) {
  const {
    query, propertyType, status, minPrice, maxPrice,
    bedrooms, bathrooms, city, state, page = 1, limit = 12, featured,
  } = params;

  const where: Record<string, unknown> = {
    status: { not: "ARCHIVED" },
  };

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { address: { contains: query, mode: "insensitive" } },
      { city: { contains: query, mode: "insensitive" } },
    ];
  }
  if (propertyType) where.propertyType = propertyType;
  if (status) where.status = status;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, number>).gte = minPrice;
    if (maxPrice) (where.price as Record<string, number>).lte = maxPrice;
  }
  if (bedrooms) where.bedrooms = { gte: bedrooms };
  if (bathrooms) where.bathrooms = { gte: bathrooms };
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (state) where.state = { contains: state, mode: "insensitive" };
  if (featured) where.featured = true;

  const [properties, total] = await Promise.all([
    db.property.findMany({
      where: where as never,
      include: { owner: true, agent: true, _count: { select: { favorites: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.property.count({ where: where as never }),
  ]);

  return { properties, total, pages: Math.ceil(total / limit) };
}

export async function getPropertyBySlug(slug: string) {
  return db.property.findUnique({
    where: { slug },
    include: {
      owner: true,
      agent: true,
      _count: { select: { favorites: true, inquiries: true } },
    },
  });
}

export async function getUserProperties() {
  const user = await requireUser();
  return db.property.findMany({
    where: {
      OR: [{ ownerId: user.id }, { agentId: user.id }],
    },
    include: { _count: { select: { favorites: true, inquiries: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserFavorites() {
  const user = await requireUser();
  return db.favorite.findMany({
    where: { userId: user.id },
    include: {
      property: {
        include: { owner: true, _count: { select: { favorites: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
