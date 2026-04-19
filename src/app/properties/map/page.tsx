import { getProperties } from "@/lib/actions/property";
import { PropertyMap } from "@/components/property-map";
import { SearchFilters } from "@/components/search-filters";
import { Suspense } from "react";

export default async function MapSearchPage() {
  const { properties } = await getProperties({ limit: 100 }).catch(() => ({ properties: [] }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Map Search</h1>
      <p className="text-muted-foreground mb-6">Explore properties on the map</p>

      <Suspense fallback={<div className="h-40 bg-muted rounded-xl animate-pulse" />}>
        <SearchFilters />
      </Suspense>

      <div className="mt-6">
        <PropertyMap properties={properties as never} />
      </div>
    </div>
  );
}
