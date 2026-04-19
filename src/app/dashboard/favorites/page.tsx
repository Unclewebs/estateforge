import { redirect } from "next/navigation";
import { syncUser } from "@/lib/auth";
import { getUserFavorites } from "@/lib/actions/property";
import { PropertyCard } from "@/components/property-card";
import { Heart } from "lucide-react";

export default async function FavoritesPage() {
  const user = await syncUser();
  if (!user) redirect("/sign-in");

  const favorites = await getUserFavorites().catch(() => []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Saved Properties</h1>
      <p className="text-muted-foreground mb-8">{favorites.length} saved properties</p>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl font-medium">No saved properties yet</p>
          <p className="text-muted-foreground mt-1">Browse properties and save the ones you love</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {favorites.map((fav: any) => (
            <PropertyCard key={fav.id} property={fav.property} isFavorited />
          ))}
        </div>
      )}
    </div>
  );
}
