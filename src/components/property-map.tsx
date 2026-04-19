"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { formatPrice } from "@/lib/utils";

interface MapProperty {
  id: string;
  slug: string;
  title: string;
  price: number;
  latitude: number | null;
  longitude: number | null;
  address: string;
  city: string;
  state: string;
  images: string[];
}

export function PropertyMap({ properties }: { properties: MapProperty[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-98.5795, 39.8283], // Center of US
      zoom: 4,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    const validProperties = properties.filter((p) => p.latitude && p.longitude);

    validProperties.forEach((property) => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="max-width: 200px;">
          ${property.images[0] ? `<img src="${property.images[0]}" style="width:100%;height:100px;object-fit:cover;border-radius:4px;margin-bottom:4px;" />` : ""}
          <strong>${formatPrice(property.price)}</strong>
          <p style="font-size:12px;margin:2px 0;">${property.title}</p>
          <p style="font-size:11px;color:#666;">${property.city}, ${property.state}</p>
          <a href="/properties/${property.slug}" style="font-size:12px;color:#2563eb;">View Details →</a>
        </div>
      `);

      new mapboxgl.Marker({ color: "#2563eb" })
        .setLngLat([property.longitude!, property.latitude!])
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Fit bounds
    if (validProperties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      validProperties.forEach((p) => bounds.extend([p.longitude!, p.latitude!]));
      map.current.fitBounds(bounds, { padding: 50 });
    }

    return () => { map.current?.remove(); map.current = null; };
  }, [properties]);

  return (
    <div ref={mapContainer} className="w-full h-[600px] rounded-xl overflow-hidden border" />
  );
}
