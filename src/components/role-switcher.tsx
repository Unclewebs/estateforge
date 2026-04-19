"use client";

import { useTransition } from "react";
import { switchRole, addRole } from "@/lib/actions/user";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Home, Building2, Users } from "lucide-react";

const roleIcons = { BUYER: Home, SELLER: Building2, AGENT: Users };
const roleLabels = { BUYER: "Buyer", SELLER: "Seller", AGENT: "Agent" };

export function RoleSwitcher({ currentRole, roles }: { currentRole: string; roles: string[] }) {
  const [isPending, startTransition] = useTransition();
  const Icon = roleIcons[currentRole as keyof typeof roleIcons] || Home;

  const handleSwitch = (role: "BUYER" | "SELLER" | "AGENT") => {
    startTransition(async () => {
      if (!roles.includes(role)) await addRole(role);
      await switchRole(role);
      window.location.reload();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isPending} className="gap-2">
          <Icon className="h-4 w-4" />
          {roleLabels[currentRole as keyof typeof roleLabels]}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(["BUYER", "SELLER", "AGENT"] as const).map((role) => {
          const RoleIcon = roleIcons[role];
          return (
            <DropdownMenuItem key={role} onClick={() => handleSwitch(role)} className="gap-2">
              <RoleIcon className="h-4 w-4" />
              {roleLabels[role]}
              {!roles.includes(role) && <span className="text-xs text-muted-foreground ml-auto">+ Add</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
