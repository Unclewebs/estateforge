import { redirect } from "next/navigation";
import { syncUser } from "@/lib/auth";
import { getUserProperties } from "@/lib/actions/property";
import { getInquiries } from "@/lib/actions/messaging";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Eye, Heart, MessageSquare, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatPrice, statusLabels, timeAgo } from "@/lib/utils";
import { RoleSwitcher } from "@/components/role-switcher";

export default async function DashboardPage() {
  const user = await syncUser();
  if (!user) redirect("/sign-in");

  const [properties, inquiries] = await Promise.all([
    getUserProperties().catch(() => []),
    getInquiries().catch(() => []),
  ]);

  const totalViews = properties.reduce((sum: number, p: { views: number }) => sum + p.views, 0);
  const totalFavorites = properties.reduce((sum: number, p: { _count: { favorites: number } }) => sum + p._count.favorites, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.firstName}! Role: <Badge variant="secondary">{user.activeRole}</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <RoleSwitcher currentRole={user.activeRole} roles={user.roles} />
          {(user.roles.includes("SELLER") || user.roles.includes("AGENT")) && (
            <Link href="/properties/new">
              <Button className="gap-2"><Plus className="h-4 w-4" /> New Listing</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "My Listings", value: properties.length, icon: Building2 },
          { label: "Total Views", value: totalViews, icon: Eye },
          { label: "Total Saves", value: totalFavorites, icon: Heart },
          { label: "Inquiries", value: inquiries.length, icon: MessageSquare },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="listings">
        <TabsList>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries ({inquiries.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-6">
          {properties.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No listings yet</p>
                <p className="text-sm text-muted-foreground mb-4">Start by creating your first property listing</p>
                <Link href="/properties/new">
                  <Button>Create Listing</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {properties.map((property: any) => (
                <Card key={property.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/properties/${property.slug}`} className="font-semibold hover:text-primary">
                          {property.title}
                        </Link>
                        <Badge variant="outline">{statusLabels[property.status as string]}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(property.price)} · {property.city}, {property.state} · {property.views} views · {property._count.favorites} saves
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/properties/${property.slug}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inquiries" className="mt-6">
          {inquiries.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No inquiries yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {inquiries.map((inquiry: any) => (
                <Card key={inquiry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{inquiry.fromUser.firstName} {inquiry.fromUser.lastName}</p>
                      <p className="text-xs text-muted-foreground">{timeAgo(inquiry.createdAt)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Re: <Link href={`/properties/${inquiry.property.slug}`} className="text-primary hover:underline">{inquiry.property.title}</Link>
                    </p>
                    <p className="text-sm">{inquiry.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
