import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const sampleImages = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
];

async function main() {
  console.log("Seeding database...");

  // Create users
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@estateforge.com" },
    update: {},
    create: {
      clerkId: "clerk_buyer_001",
      email: "buyer@estateforge.com",
      firstName: "Alex",
      lastName: "Johnson",
      roles: ["BUYER"],
      activeRole: "BUYER",
      phone: "555-0101",
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@estateforge.com" },
    update: {},
    create: {
      clerkId: "clerk_seller_001",
      email: "seller@estateforge.com",
      firstName: "Maria",
      lastName: "Garcia",
      roles: ["SELLER"],
      activeRole: "SELLER",
      phone: "555-0102",
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: "agent@estateforge.com" },
    update: {},
    create: {
      clerkId: "clerk_agent_001",
      email: "agent@estateforge.com",
      firstName: "James",
      lastName: "Wilson",
      roles: ["AGENT"],
      activeRole: "AGENT",
      phone: "555-0103",
      licenseNumber: "DRE-12345678",
      agency: "Wilson Realty Group",
      yearsExperience: 12,
      specializations: ["Luxury Homes", "Waterfront"],
    },
  });

  const properties = [
    {
      slug: "luxury-modern-villa-miami",
      title: "Luxury Modern Villa with Ocean Views",
      description: "Stunning contemporary villa featuring floor-to-ceiling windows, infinity pool, and breathtaking ocean views. This architectural masterpiece offers the ultimate in luxury coastal living.",
      price: 2500000,
      propertyType: "VILLA" as const,
      status: "FOR_SALE" as const,
      bedrooms: 5,
      bathrooms: 4,
      squareFeet: 4500,
      lotSize: 0.5,
      yearBuilt: 2022,
      parking: 3,
      stories: 2,
      address: "123 Ocean Drive",
      city: "Miami Beach",
      state: "FL",
      zipCode: "33139",
      latitude: 25.7907,
      longitude: -80.1300,
      images: [sampleImages[0], sampleImages[1], sampleImages[2]],
      amenities: ["Pool", "Air Conditioning", "Security System", "Garage", "Balcony", "Hardwood Floors"],
      featured: true,
      views: 234,
      ownerId: seller.id,
      agentId: agent.id,
    },
    {
      slug: "downtown-loft-new-york",
      title: "Spacious Downtown Loft in SoHo",
      description: "A beautifully renovated loft in the heart of SoHo featuring exposed brick, 14ft ceilings, and designer finishes throughout. Walking distance to galleries, restaurants, and nightlife.",
      price: 1800000,
      propertyType: "APARTMENT" as const,
      status: "FOR_SALE" as const,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1800,
      yearBuilt: 1920,
      parking: 0,
      stories: 1,
      address: "456 Broadway",
      city: "New York",
      state: "NY",
      zipCode: "10012",
      latitude: 40.7230,
      longitude: -73.9985,
      images: [sampleImages[1], sampleImages[3]],
      amenities: ["Elevator", "Doorman", "Hardwood Floors", "Washer/Dryer"],
      featured: true,
      views: 567,
      ownerId: seller.id,
    },
    {
      slug: "family-home-austin-tx",
      title: "Charming Family Home in Austin Hills",
      description: "Beautiful 4-bedroom family home nestled in a quiet Austin neighborhood. Features a large backyard, updated kitchen with granite counters, and a fantastic community pool.",
      price: 650000,
      propertyType: "HOUSE" as const,
      status: "FOR_SALE" as const,
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 2800,
      lotSize: 0.25,
      yearBuilt: 2015,
      parking: 2,
      stories: 2,
      address: "789 Hill Country Blvd",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      latitude: 30.2672,
      longitude: -97.7431,
      images: [sampleImages[2], sampleImages[0], sampleImages[4]],
      amenities: ["Pool", "Garden", "Garage", "Pet Friendly", "Air Conditioning"],
      featured: true,
      views: 345,
      ownerId: seller.id,
      agentId: agent.id,
    },
    {
      slug: "modern-condo-san-francisco",
      title: "Modern High-Rise Condo with Bay Views",
      description: "Sleek modern condo on the 22nd floor with panoramic views of the Bay Bridge. Features smart home technology, chef's kitchen, and access to world-class amenities.",
      price: 1200000,
      propertyType: "CONDO" as const,
      status: "FOR_SALE" as const,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      yearBuilt: 2020,
      parking: 1,
      stories: 1,
      address: "100 Rincon Hill",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      latitude: 37.7866,
      longitude: -122.3905,
      images: [sampleImages[3], sampleImages[1]],
      amenities: ["Gym", "Pool", "Doorman", "Elevator", "Balcony", "Stainless Steel Appliances"],
      featured: false,
      views: 189,
      ownerId: seller.id,
    },
    {
      slug: "cozy-studio-chicago",
      title: "Cozy Studio in Lincoln Park",
      description: "Bright and airy studio apartment in the heart of Lincoln Park. Recently renovated with modern finishes. Perfect for young professionals.",
      price: 1500,
      propertyType: "STUDIO" as const,
      status: "FOR_RENT" as const,
      bedrooms: 0,
      bathrooms: 1,
      squareFeet: 500,
      yearBuilt: 2005,
      parking: 0,
      address: "2200 N Lincoln Ave",
      city: "Chicago",
      state: "IL",
      zipCode: "60614",
      latitude: 41.9217,
      longitude: -87.6366,
      images: [sampleImages[4], sampleImages[2]],
      amenities: ["Washer/Dryer", "Air Conditioning", "Pet Friendly"],
      featured: false,
      views: 423,
      ownerId: seller.id,
    },
    {
      slug: "commercial-space-denver",
      title: "Prime Commercial Space in Downtown Denver",
      description: "Excellent commercial space ideal for retail or restaurant. High foot traffic area with great visibility. Comes with modern HVAC and ample parking.",
      price: 5000,
      propertyType: "COMMERCIAL" as const,
      status: "FOR_RENT" as const,
      bedrooms: 0,
      bathrooms: 2,
      squareFeet: 3000,
      yearBuilt: 2010,
      parking: 5,
      address: "555 Market St",
      city: "Denver",
      state: "CO",
      zipCode: "80202",
      latitude: 39.7392,
      longitude: -104.9903,
      images: [sampleImages[0], sampleImages[3]],
      amenities: ["Air Conditioning", "Heating", "Security System", "EV Charging"],
      featured: false,
      views: 78,
      ownerId: seller.id,
      agentId: agent.id,
    },
    {
      slug: "waterfront-townhouse-seattle",
      title: "Waterfront Townhouse with Mountain Views",
      description: "Gorgeous 3-story townhouse with views of Puget Sound and the Olympic Mountains. Features a rooftop deck, gourmet kitchen, and direct water access.",
      price: 950000,
      propertyType: "TOWNHOUSE" as const,
      status: "FOR_SALE" as const,
      bedrooms: 3,
      bathrooms: 3,
      squareFeet: 2200,
      yearBuilt: 2018,
      parking: 2,
      stories: 3,
      address: "800 Alaskan Way",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      latitude: 47.6062,
      longitude: -122.3321,
      images: [sampleImages[1], sampleImages[4], sampleImages[0]],
      amenities: ["Fireplace", "Balcony", "Patio", "Garage", "Walk-in Closet"],
      featured: true,
      views: 312,
      ownerId: seller.id,
    },
    {
      slug: "build-ready-land-nashville",
      title: "Build-Ready Land Parcel in Nashville",
      description: "5 acres of build-ready land in an up-and-coming Nashville neighborhood. All utilities connected. Perfect for custom home or small development.",
      price: 350000,
      propertyType: "LAND" as const,
      status: "FOR_SALE" as const,
      squareFeet: 217800,
      lotSize: 5.0,
      address: "1000 Rural Route",
      city: "Nashville",
      state: "TN",
      zipCode: "37201",
      latitude: 36.1627,
      longitude: -86.7816,
      images: [sampleImages[4]],
      amenities: [],
      featured: false,
      views: 156,
      ownerId: seller.id,
    },
    {
      slug: "luxury-apartment-la",
      title: "Luxury Apartment in Beverly Hills",
      description: "Stunning luxury apartment with panoramic city views. Features marble bathrooms, designer kitchen, and access to a private rooftop pool and spa.",
      price: 8500,
      propertyType: "APARTMENT" as const,
      status: "FOR_RENT" as const,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 2000,
      yearBuilt: 2021,
      parking: 2,
      address: "9000 Wilshire Blvd",
      city: "Beverly Hills",
      state: "CA",
      zipCode: "90210",
      latitude: 34.0696,
      longitude: -118.3498,
      images: [sampleImages[2], sampleImages[1], sampleImages[3]],
      amenities: ["Pool", "Gym", "Doorman", "Elevator", "Stainless Steel Appliances", "Walk-in Closet", "Balcony"],
      featured: true,
      views: 678,
      ownerId: seller.id,
      agentId: agent.id,
    },
    {
      slug: "historic-brownstone-boston",
      title: "Historic Brownstone in Beacon Hill",
      description: "Elegantly restored 1880s brownstone in prestigious Beacon Hill. Original details preserved including crown moldings, marble fireplaces, and hardwood floors.",
      price: 3200000,
      propertyType: "HOUSE" as const,
      status: "FOR_SALE" as const,
      bedrooms: 5,
      bathrooms: 4,
      squareFeet: 3800,
      lotSize: 0.1,
      yearBuilt: 1885,
      parking: 1,
      stories: 4,
      address: "15 Beacon St",
      city: "Boston",
      state: "MA",
      zipCode: "02108",
      latitude: 42.3588,
      longitude: -71.0638,
      images: [sampleImages[3], sampleImages[0], sampleImages[2]],
      amenities: ["Fireplace", "Garden", "Hardwood Floors", "Storage", "Heating"],
      featured: true,
      views: 445,
      ownerId: seller.id,
      agentId: agent.id,
    },
  ];

  for (const prop of properties) {
    await prisma.property.upsert({
      where: { slug: prop.slug },
      update: {},
      create: prop,
    });
  }

  // Create some favorites
  const allProperties = await prisma.property.findMany({ take: 3 });
  for (const p of allProperties) {
    await prisma.favorite.upsert({
      where: { userId_propertyId: { userId: buyer.id, propertyId: p.id } },
      update: {},
      create: { userId: buyer.id, propertyId: p.id },
    });
  }

  // Create sample inquiry
  if (allProperties[0]) {
    await prisma.inquiry.create({
      data: {
        message: "Hi, I'm very interested in this property. Is it still available? I'd love to schedule a viewing this weekend.",
        propertyId: allProperties[0].id,
        fromUserId: buyer.id,
        toUserId: agent.id,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`   - 3 users (buyer, seller, agent)`);
  console.log(`   - ${properties.length} properties`);
  console.log(`   - 3 favorites`);
  console.log(`   - 1 inquiry`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
