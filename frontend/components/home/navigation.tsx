"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import useIsMobile from "@/core/hooks/useIsMobile";
import Image from "next/image";
import Section from "../common/section";
import Link from "next/link";
import { Button } from "../ui/button";
import { LogOut, User, User2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import {
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";

export default function Navigation() {
  const isMobile = useIsMobile();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="sticky top-0 shadow-md bg-white z-[999]">
      <Section>
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
					<Link href="/">
          <Image src={"/logo.svg"} alt="Logo" width={150} height={24} />
					</Link>
          <NavigationMenu viewport={isMobile}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/submissions">Submissions</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {user ? (
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-gray-400">
                <User2 size={20} />
              </div>
              <span>{user.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => useAuthStore.getState().signout()}
              >
                <LogOut />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href={"/auth/signup"}>
                <Button size="sm" variant="outline">
                  Create Account
                </Button>
              </Link>
              <Link href={"/auth/login"}>
                <Button size="sm">
                  <User />
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
