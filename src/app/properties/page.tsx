import { Suspense } from "react";
import { getProperties } from "@/lib/actions/property";
import { PropertyCard } from "@/components/property-card";
import { PropertyCardSkeleton } from "@/components/property-card-skeleton";
import { SearchFilters } from "@/components/search-filters";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { properties, total, pages } = await getProperties({
    query: params.query,
    propertyType: params.propertyType,
    status: params.status,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
    city: params.city,
    state: params.state,
    page,
  }).catch(() => ({ properties: [], total: 0, pages: 0 }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Properties</h1>
        <p className="text-muted-foreground">{total} properties found</p>
      </div>

      <Suspense fallback={<div className="h-40 bg-muted rounded-xl animate-pulse" />}>
        <SearchFilters />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {properties.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-muted-foreground">No properties found</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          properties.map((property: any) => (
            <PropertyCard key={property.id} property={property} />
          ))
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {page > 1 && (
            <Link href={`/properties?page=${page - 1}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {page} of {pages}
          </span>
          {page < pages && (
            <Link href={`/properties?page=${page + 1}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
