"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Home, Users } from "lucide-react";
import { addRole, switchRole, updateUserProfile } from "@/lib/actions/user";
import { cn } from "@/lib/utils";

const roles = [
  {
    id: "BUYER" as const,
    label: "Buyer",
    desc: "Search and save properties, contact sellers and agents",
    icon: Home,
  },
  {
    id: "SELLER" as const,
    label: "Seller",
    desc: "List your own properties for sale or rent",
    icon: Building2,
  },
  {
    id: "AGENT" as const,
    label: "Agent",
    desc: "List properties on behalf of sellers, manage leads",
    icon: Users,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<"BUYER" | "SELLER" | "AGENT">("BUYER");
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [agentInfo, setAgentInfo] = useState({ licenseNumber: "", agency: "" });

  const handleContinue = () => {
    if (selected === "AGENT") {
      setStep(2);
    } else {
      startTransition(async () => {
        await addRole(selected);
        await switchRole(selected);
        router.push("/dashboard");
      });
    }
  };

  const handleAgentSubmit = () => {
    startTransition(async () => {
      await addRole("AGENT");
      await switchRole("AGENT");
      await updateUserProfile(agentInfo);
      router.push("/dashboard");
    });
  };

  if (step === 2) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Agent Information</CardTitle>
            <CardDescription>Complete your agent profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>License Number</Label>
              <Input
                value={agentInfo.licenseNumber}
                onChange={(e) => setAgentInfo((p) => ({ ...p, licenseNumber: e.target.value }))}
                placeholder="e.g., DRE-12345678"
              />
            </div>
            <div>
              <Label>Agency / Brokerage</Label>
              <Input
                value={agentInfo.agency}
                onChange={(e) => setAgentInfo((p) => ({ ...p, agency: e.target.value }))}
                placeholder="e.g., Keller Williams"
              />
            </div>
            <Button onClick={handleAgentSubmit} disabled={isPending} className="w-full">
              {isPending ? "Setting up..." : "Complete Setup"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <h1 className="text-3xl font-bold mb-2">Welcome to EstateForge</h1>
      <p className="text-muted-foreground mb-8">How would you like to use EstateForge?</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {roles.map((role) => (
          <button key={role.id} onClick={() => setSelected(role.id)} className="text-left">
            <Card className={cn("h-full transition-all cursor-pointer hover:shadow-md", selected === role.id && "ring-2 ring-primary border-primary")}>
              <CardContent className="p-6 text-center">
                <role.icon className={cn("h-10 w-10 mx-auto mb-3", selected === role.id ? "text-primary" : "text-muted-foreground")} />
                <h3 className="font-semibold mb-1">{role.label}</h3>
                <p className="text-xs text-muted-foreground">{role.desc}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <Button onClick={handleContinue} disabled={isPending} size="lg">
        {isPending ? "Setting up..." : "Continue"}
      </Button>
      <p className="text-xs text-muted-foreground mt-4">You can add more roles later from your dashboard.</p>
    </div>
  );
}
