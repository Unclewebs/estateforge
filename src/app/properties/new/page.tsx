import { PropertyForm } from "@/components/property-form";
import { syncUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewPropertyPage() {
  const user = await syncUser();
  if (!user) redirect("/sign-in");

  if (!user.roles.includes("SELLER") && !user.roles.includes("AGENT")) {
    redirect("/onboarding");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">List a New Property</h1>
      <p className="text-muted-foreground mb-8">Fill in the details to create your property listing</p>
      <PropertyForm />
    </div>
  );
}
