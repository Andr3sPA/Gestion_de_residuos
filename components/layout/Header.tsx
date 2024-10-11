"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import * as React from "react";
import NotificationComponent from "../common/Notifications";
import { LoginMenu } from "../users/LoginMenu";
import { ProfileMenu } from "../users/ProfileMenu";
import { NavigationSheet } from "./NavigationSheet";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const navButtons = [
  { title: "Inicio", href: "/" },
  { title: "Mis residuos", href: "/manage/wastes" },
  { title: "Vender", href: "/create-auction" },
  { title: "Comprar", href: "/search/auctions" },
];

export default function Header() {
  const { status, data } = useSession();
  const router = useRouter();

  const loggedIn = status === "authenticated";
  const isSuperAdmin = data?.user?.role === "superAdmin";

  return (
    <div className="flex w-full flex-col shadow-md">
      <header className="text-white sticky z-20 top-0 flex h-16 items-center gap-4 border-b bg-primary px-4 md:px-6">
        <NavigationSheet />
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
            {navButtons.map((btn) => (
              <NavigationMenuItem key={btn.title}>
                <NavigationMenuLink asChild>
                  <Button
                    variant={"ghost"}
                    className={cn(
                      "select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none",
                      "transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      (!loggedIn || isSuperAdmin) && btn.title !== "Inicio"
                        ? "hidden"
                        : "",
                    )}
                    onClick={() => router.push(btn.href)}
                  >
                    <div className="text-sm font-medium leading-none">
                      {btn.title}
                    </div>
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={`bg-primary ${(!loggedIn || isSuperAdmin) && "hidden"}`}
              >
                Mis actividades
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute z-50 p-2">
                <ul className="grid gap-1 p-2 md:w-[300px] lg:w-[400px] lg:grid-cols-1">
                  <ListItem
                    href="/manage/auctions"
                    title="Mis subastas"
                  ></ListItem>
                  <ListItem
                    href="/manage/offers"
                    title="Mis ofertas"
                  ></ListItem>
                  <ListItem href="/manage/sales" title="Mis ventas"></ListItem>
                  <ListItem
                    href="/manage/purchases"
                    title="Mis compras"
                  ></ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial"></div>
          {loggedIn && !isSuperAdmin && <NotificationComponent />}
          {loggedIn ? <ProfileMenu /> : <LoginMenu />}
        </div>
      </header>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href }, ref) => {
  const router = useRouter();

  return (
    <li>
      <NavigationMenuLink asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none",
            "transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            "w-full text-left",
            className,
          )}
          onClick={() => {
            href && router.push(href);
          }}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Button>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
