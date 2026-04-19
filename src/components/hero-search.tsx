"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, Key, Building2, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "buy", label: "Buy", icon: Home, status: "FOR_SALE", color: "from-[#E35205] to-[#B8390A]" },
  { id: "rent", label: "Rent", icon: Key, status: "FOR_RENT", color: "from-[#E35205] to-[#B8390A]" },
  { id: "projects", label: "New Projects", icon: Building2, status: "FOR_SALE", color: "from-[#E35205] to-[#B8390A]" },
] as const;

const cities = [
  { name: "Lucknow", state: "Uttar Pradesh" },
  { name: "Noida", state: "Uttar Pradesh" },
  { name: "Greater Noida", state: "Uttar Pradesh" },
  { name: "Agra", state: "Uttar Pradesh" },
  { name: "Varanasi", state: "Uttar Pradesh" },
  { name: "Kanpur", state: "Uttar Pradesh" },
  { name: "Prayagraj", state: "Uttar Pradesh" },
  { name: "Ghaziabad", state: "Uttar Pradesh" },
  { name: "Delhi NCR", state: "Delhi" },
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Bangalore", state: "Karnataka" },
  { name: "Hyderabad", state: "Telangana" },
];

const localitySuggestions: Record<string, string[]> = {
  Lucknow: ["Gomti Nagar", "Hazratganj", "Indira Nagar", "Aliganj", "Jankipuram", "Mahanagar", "Alambagh", "Chinhat"],
  Noida: ["Sector 150", "Sector 137", "Sector 75", "Sector 62", "Sector 44"],
  "Greater Noida": ["Pari Chowk", "Knowledge Park", "Omega", "Alpha"],
  Agra: ["Tajganj", "Sikandra", "Dayal Bagh", "Kamla Nagar"],
  Varanasi: ["Lanka", "Sigra", "Bhelupur", "Cantonment"],
  Kanpur: ["Swaroop Nagar", "Civil Lines", "Kidwai Nagar"],
  Prayagraj: ["Civil Lines", "Naini", "Jhunsi", "Phaphamau"],
  Ghaziabad: ["Indirapuram", "Vaishali", "Raj Nagar Extension", "Crossing Republik"],
  "Delhi NCR": ["Dwarka", "Rohini", "Saket", "Vasant Kunj"],
  Mumbai: ["Andheri", "Bandra", "Thane", "Powai"],
  Bangalore: ["Whitefield", "Electronic City", "Koramangala", "HSR Layout"],
  Hyderabad: ["Gachibowli", "HITEC City", "Kondapur", "Madhapur"],
};

const budgetOptionsBuy = [
  { label: "Under ₹20 Lac", min: "", max: "2000000" },
  { label: "₹20-50 Lac", min: "2000000", max: "5000000" },
  { label: "₹50 Lac - 1 Cr", min: "5000000", max: "10000000" },
  { label: "₹1-2 Cr", min: "10000000", max: "20000000" },
  { label: "₹2 Cr+", min: "20000000", max: "" },
];

const budgetOptionsRent = [
  { label: "Under ₹10K", min: "", max: "10000" },
  { label: "₹10K-25K", min: "10000", max: "25000" },
  { label: "₹25K-50K", min: "25000", max: "50000" },
  { label: "₹50K+", min: "50000", max: "" },
];

export function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"buy" | "rent" | "projects">("buy");
  const [selectedCity, setSelectedCity] = useState("Lucknow");
  const [cityOpen, setCityOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const cityRef = useRef<HTMLDivElement>(null);

  const currentTab = tabs.find((t) => t.id === activeTab)!;
  const budgetOptions = activeTab === "rent" ? budgetOptionsRent : budgetOptionsBuy;
  const suggestions = localitySuggestions[selectedCity] || localitySuggestions["Lucknow"];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("query", query || selectedCity);
    params.set("status", currentTab.status);
    if (propertyType) params.set("propertyType", propertyType);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (budget) {
      const selected = budgetOptions[Number(budget)];
      if (selected) {
        if (selected.min) params.set("minPrice", selected.min);
        if (selected.max) params.set("maxPrice", selected.max);
      }
    }
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex justify-center gap-1 mb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-t-xl transition-all",
              activeTab === tab.id
                ? "bg-white dark:bg-card text-foreground shadow-sm"
                : "bg-white/10 text-white/90 hover:bg-white/20"
            )}
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center",
              activeTab === tab.id ? `bg-gradient-to-br ${tab.color} text-white` : "bg-white/15"
            )}>
              <tab.icon className="h-3 w-3" />
            </div>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Card */}
          <div className="bg-white dark:bg-card rounded-b-2xl rounded-tr-2xl shadow-2xl p-5 md:p-6 space-y-4">
        {/* City Selector + Search Input */}
        <div className="flex gap-0 border-2 rounded-xl overflow-hidden focus-within:border-primary transition-colors">
          {/* City Picker */}
          <div ref={cityRef} className="relative">
            <button
              onClick={() => setCityOpen(!cityOpen)}
              className="flex items-center gap-2 h-12 px-4 bg-slate-50 dark:bg-slate-900/30 border-r text-sm font-medium whitespace-nowrap hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <MapPin className="h-4 w-4 text-[#E35205]" />
              <span>{selectedCity}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", cityOpen && "rotate-180")} />
            </button>
            {cityOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-card border rounded-xl shadow-xl z-50 py-2 max-h-72 overflow-y-auto">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Select City</p>
                {cities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => { setSelectedCity(city.name); setCityOpen(false); setQuery(""); }}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2.5 text-sm hover:bg-primary/5 transition-colors",
                      selectedCity === city.name && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{city.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{city.state}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search locality, project in ${selectedCity}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-12 pl-10 border-0 shadow-none focus-visible:ring-0 text-base"
            />
          </div>

          {/* Search Button inline */}
          <Button
            onClick={handleSearch}
            className={cn("h-12 px-6 rounded-none text-base font-semibold gap-2 bg-[#E35205] hover:bg-[#B8390A] border-0 text-white")}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>

        {/* Filter Pills Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="h-10 rounded-lg">
              <SelectValue placeholder="🏠 Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="APARTMENT">Flat/Apartment</SelectItem>
              <SelectItem value="HOUSE">House</SelectItem>
              <SelectItem value="VILLA">Villa</SelectItem>
              <SelectItem value="LAND">Plot/Land</SelectItem>
              <SelectItem value="COMMERCIAL">Commercial</SelectItem>
              <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
              <SelectItem value="STUDIO">Studio</SelectItem>
            </SelectContent>
          </Select>

          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger className="h-10 rounded-lg">
              <SelectValue placeholder="💰 Budget" />
            </SelectTrigger>
            <SelectContent>
              {budgetOptions.map((opt, i) => (
                <SelectItem key={i} value={String(i)}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={bedrooms} onValueChange={setBedrooms}>
            <SelectTrigger className="h-10 rounded-lg">
              <SelectValue placeholder="🛏️ BHK" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 BHK</SelectItem>
              <SelectItem value="2">2 BHK</SelectItem>
              <SelectItem value="3">3 BHK</SelectItem>
              <SelectItem value="4">4 BHK</SelectItem>
              <SelectItem value="5">5+ BHK</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Locality Links */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-muted-foreground font-medium">Popular in {selectedCity}:</span>
          {suggestions.slice(0, 5).map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setQuery(loc);
                const params = new URLSearchParams();
                params.set("query", loc);
                params.set("status", currentTab.status);
                router.push(`/properties?${params.toString()}`);
              }}
              className="text-xs px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 font-medium transition-colors dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-300 dark:hover:bg-orange-500 dark:hover:text-white"
            >
              {loc}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
