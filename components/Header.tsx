"use client";

import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";
import NotificationComponent from "./Notifications";
import { LoginMenu } from "./users/LoginMenu";
import { ProfileMenu } from "./users/ProfileMenu";

const navButtons = [
  { title: "Inicio", href: "/" },
  { title: "Mis residuos", href: "/manage/wastes" },
  { title: "Vender", href: "/createAuction" },
  { title: "Comprar", href: "/search/auctions" },
];

export default function Header() {
  const { status } = useSession();

  const loggedIn = status === "authenticated";

  return (
    <div className="flex w-full flex-col shadow-md">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <NavigationMenu>
          <NavigationMenuList>
            {navButtons.map((btn) => (
              <NavigationMenuItem key={btn.title}>
                <NavigationMenuLink asChild>
                  <a
                    href={btn.href}
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    )}
                  >
                    <div className="text-sm font-medium leading-none">
                      {btn.title}
                    </div>
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Mis actividades</NavigationMenuTrigger>
              <NavigationMenuContent className="absolute z-50">
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-1">
                  <ListItem
                    href="/records/offersRecord"
                    title="Mis ofertas"
                  ></ListItem>
                  <ListItem
                    href="/manage/auctions"
                    title="Mis subastas"
                  ></ListItem>
                  <ListItem
                    href="/records/salesRecord"
                    title="Mis ventas"
                  ></ListItem>
                  <ListItem
                    href="/records/shoppingRecord"
                    title="Mis compras"
                  ></ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial"></div>
          <NotificationComponent />
          {loggedIn ? <ProfileMenu /> : <LoginMenu />}
        </div>
      </header>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
