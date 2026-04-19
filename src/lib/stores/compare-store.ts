"use client";

import { create } from "zustand";

interface CompareStore {
  propertyIds: string[];
  addProperty: (id: string) => void;
  removeProperty: (id: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  propertyIds: [],
  addProperty: (id) =>
    set((state) => ({
      propertyIds: state.propertyIds.length < 4 ? [...state.propertyIds, id] : state.propertyIds,
    })),
  removeProperty: (id) =>
    set((state) => ({
      propertyIds: state.propertyIds.filter((pid) => pid !== id),
    })),
  clear: () => set({ propertyIds: [] }),
}));
