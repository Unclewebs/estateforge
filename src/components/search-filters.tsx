"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useCallback, useState } from "react";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (propertyType) params.set("propertyType", propertyType);
    if (status) params.set("status", status);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);
    router.push(`/properties?${params.toString()}`);
  }, [query, propertyType, status, minPrice, maxPrice, bedrooms, router]);

  const clearFilters = () => {
    setQuery("");
    setPropertyType("");
    setStatus("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    router.push("/properties");
  };

  return (
    <div className="bg-card border rounded-xl p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by location, title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>
        <Button onClick={applyFilters}>Search</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger><SelectValue placeholder="Property Type" /></SelectTrigger>
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

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="FOR_SALE">For Sale</SelectItem>
            <SelectItem value="FOR_RENT">For Rent</SelectItem>
          </SelectContent>
        </Select>

        <Input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <Input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />

        <Select value={bedrooms} onValueChange={setBedrooms}>
          <SelectTrigger><SelectValue placeholder="Bedrooms" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
          <X className="h-3 w-3" /> Clear Filters
        </Button>
      </div>
    </div>
  );
}
