import Link from "next/link";
import {
  Building2,
  Search,
  TrendingUp,
  Shield,
  ArrowRight,
  Home,
  MapPin,
  Landmark,
  TreePine,
  Store,
  Building,
  Users,
  Phone,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProperties } from "@/lib/actions/property";
import { PropertyCard } from "@/components/property-card";
import { HeroSearch } from "@/components/hero-search";
import { cn } from "@/lib/utils";

const popularLocalities = [
  { name: "Gomti Nagar", query: "Gomti Nagar" },
  { name: "Hazratganj", query: "Hazratganj" },
  { name: "Aliganj", query: "Aliganj" },
  { name: "Indira Nagar", query: "Indira Nagar" },
  { name: "Mahanagar", query: "Mahanagar" },
  { name: "Alambagh", query: "Alambagh" },
  { name: "Vikas Nagar", query: "Vikas Nagar" },
  { name: "Jankipuram", query: "Jankipuram" },
  { name: "Aminabad", query: "Aminabad" },
  { name: "Rajajipuram", query: "Rajajipuram" },
  { name: "Chinhat", query: "Chinhat" },
  { name: "Gomti Nagar Extension", query: "Gomti Nagar Extension" },
];

const propertyTypes = [
  { icon: Home, label: "Flat/Apartment", type: "APARTMENT", color: "from-blue-500 to-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { icon: Building2, label: "House/Villa", type: "VILLA", color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  { icon: Landmark, label: "Plot/Land", type: "LAND", color: "from-amber-500 to-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
  { icon: Store, label: "Commercial", type: "COMMERCIAL", color: "from-purple-500 to-purple-600", bg: "bg-purple-50 dark:bg-purple-950/30" },
  { icon: Building, label: "Townhouse", type: "TOWNHOUSE", color: "from-rose-500 to-rose-600", bg: "bg-rose-50 dark:bg-rose-950/30" },
  { icon: TreePine, label: "Studio", type: "STUDIO", color: "from-teal-500 to-teal-600", bg: "bg-teal-50 dark:bg-teal-950/30" },
];

const topProjects = [
  { name: "Omaxe Royal Residency", locality: "Gomti Nagar Extension", price: "₹65L - ₹1.2Cr", color: "from-blue-500 to-indigo-500" },
  { name: "Eldeco Eternia", locality: "Sitapur Road", price: "₹45L - ₹85L", color: "from-emerald-500 to-teal-500" },
  { name: "Shalimar Mannat", locality: "Faizabad Road", price: "₹55L - ₹1.1Cr", color: "from-orange-500 to-rose-500" },
  { name: "Ansal API Sushant Golf City", locality: "Sultanpur Road", price: "₹40L - ₹1.5Cr", color: "from-violet-500 to-purple-500" },
];

export default async function HomePage() {
  const { properties: featured } = await getProperties({ featured: true, limit: 6 }).catch(() => ({ properties: [] }));
  const { properties: latest } = await getProperties({ limit: 8 }).catch(() => ({ properties: [] }));

  return (
    <div>
  {/* Hero Section — Funda-inspired deep navy */}
  <section className="relative bg-gradient-to-br from-[#E35205] via-[#D4460B] to-[#B8390A] dark:from-[#7a2d04] dark:via-[#6b2503] dark:to-[#5a1e03] py-12 md:py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur text-white/90 text-sm px-4 py-1.5 rounded-full mb-4">
              <MapPin className="h-3.5 w-3.5" /> Lucknow, Uttar Pradesh
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-3">
              Find Your Perfect Property<br className="hidden md:block" /> in <span className="text-yellow-200">Lucknow</span>
            </h1>
            <p className="text-blue-100/80 text-base md:text-lg max-w-2xl mx-auto">
              Explore verified properties for Buy, Rent &amp; New Projects in Lucknow&apos;s top localities
            </p>
          </div>

          {/* Search Widget */}
          <HeroSearch />
        </div>
      </section>

      {/* Quick Stats Bar */}
  <section className="border-b bg-white dark:bg-card">
        <div className="container mx-auto px-4 py-5 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm">
          {[
            { icon: Building2, value: "10,000+", label: "Properties", color: "text-[#E35205]" },
            { icon: Users, value: "5,000+", label: "Happy Buyers", color: "text-[#D4460B]" },
            { icon: Shield, value: "500+", label: "Verified Agents", color: "text-[#E35205]" },
            { icon: Star, value: "4.8★", label: "User Rating", color: "text-[#D4460B]" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <s.icon className={cn("h-5 w-5", s.color)} />
              <span className="font-bold text-base">{s.value}</span>
              <span className="text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Property Types — Icon Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Explore by Property Type</h2>
        <p className="text-muted-foreground mb-8">Browse properties in Lucknow by category</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {propertyTypes.map((pt) => (
            <Link key={pt.type} href={`/properties?propertyType=${pt.type}&query=Lucknow`} className={cn(
              "group flex flex-col items-center gap-3 p-5 rounded-xl border hover:shadow-md hover:border-orange-300 transition-all bg-white dark:bg-card",
            )}>
              <div className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform bg-[#E35205] group-hover:bg-[#B8390A]">
                <pt.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-center">{pt.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Localities in Lucknow */}
    <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Popular Localities in Lucknow</h2>
          <p className="text-muted-foreground mb-8">Top areas to buy &amp; rent property in Lucknow</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {popularLocalities.map((loc) => (
                <Link
                  key={loc.name}
                  href={`/properties?query=${encodeURIComponent(loc.query)}`}
                  className="flex items-center gap-2 px-4 py-3 bg-card border rounded-lg hover:border-orange-400 hover:shadow-sm transition-all text-sm font-medium"
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                  {loc.name}
                </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Properties</h2>
              <p className="text-muted-foreground mt-1">Handpicked properties in Lucknow for you</p>
            </div>
            <Link href="/properties">
              <Button variant="outline" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      )}

      {/* Top Projects in Lucknow */}
      <section className="bg-muted/50 py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Top Projects in Lucknow</h2>
          <p className="text-muted-foreground mb-8">Premium residential projects in the city</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topProjects.map((proj) => (
              <Link
                key={proj.name}
                href={`/properties?query=${encodeURIComponent(proj.name)}`}
                className="bg-card border rounded-xl p-5 hover:shadow-md hover:border-orange-300 transition-all group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg text-white flex items-center justify-center shadow-sm bg-[#E35205]">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{proj.name}</h3>
                    <p className="text-xs text-muted-foreground">{proj.locality}</p>
                  </div>
                </div>
                <p className="text-primary font-bold text-sm">{proj.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      {latest.length > 0 && (
        <section className="container mx-auto px-4 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Latest Listings</h2>
              <p className="text-muted-foreground mt-1">Newly added properties in Lucknow</p>
            </div>
            <Link href="/properties">
              <Button variant="outline" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="bg-muted/50 py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Why Choose EstateForge?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Search, title: "Smart Search", desc: "Advanced filters, map search and locality-based browsing in Lucknow." },
              { icon: Shield, title: "Verified Listings", desc: "All properties verified. Connect with trusted sellers & agents." },
              { icon: TrendingUp, title: "Market Insights", desc: "Price trends & analytics for top Lucknow localities." },
              { icon: Phone, title: "Direct Contact", desc: "Connect directly with property owners & agents. No middlemen." },
            ].map((f) => (
              <div key={f.title} className="text-center p-6 border rounded-xl bg-white dark:bg-card hover:shadow-md transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E35205] text-white mb-4 shadow-sm">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#E35205] to-[#B8390A] dark:from-[#7a2d04] dark:to-[#5a1e03] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">Want to Sell or Rent Your Property?</h2>
          <p className="text-blue-100/70 text-lg mb-8 max-w-xl mx-auto">
            Post your property for FREE and get genuine leads from verified buyers in Lucknow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties/new">
              <Button size="lg" className="text-lg px-10 bg-orange-500 hover:bg-orange-600 text-white font-bold">
                Post Property — FREE
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" variant="outline" className="text-lg px-10 border-white/30 text-white hover:bg-white/10">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
