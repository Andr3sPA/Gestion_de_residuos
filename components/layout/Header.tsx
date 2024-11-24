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
import { UserSession } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import {
  ListChecksIcon,
  ListCollapseIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  MapPinnedIcon,
} from "lucide-react";

const navButtons = [
  { title: "Inicio", href: "/" },
  { title: "Mis residuos", href: "/manage/wastes" },
  { title: "Vender", href: "/create-auction" },
  { title: "Admin", href: "/admin" },
  { title: "Explorar ventas", href: "/mapSales" },
];

export default function Header() {
  const { status, data } = useSession();

  const loggedIn = status === "authenticated";
  const isSuperAdmin =
    loggedIn && (data as UserSession).user?.role === "superAdmin";

  const isBtnDisabled = (title: string) => {
    if (!loggedIn && title !== "Inicio") return true;
    if (isSuperAdmin && title !== "Inicio" && title !== "Admin") return true;
    if (!isSuperAdmin && title === "Admin") return true;
    if ((!loggedIn || isSuperAdmin) && title === "Mis actividades") return true;
    if ((!loggedIn || isSuperAdmin) && title === "Comprar") return true;
    return false;
  };

  return (
    <div className="flex w-full sticky top-0 z-20 flex-col shadow-md">
      <header
        className="text-white flex h-16 items-center gap-4 border-b bg-primary px-4 md:px-6"
        style={{ position: "-webkit-sticky" }}
      >
        <NavigationSheet />
        <div className="hidden md:flex">
          {navButtons.map((btn) => (
            <Link key={btn.title} href={btn.href}>
              <Button
                variant={"ghost"}
                disabled={isBtnDisabled(btn.title)}
                className={cn(
                  "select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none",
                  "transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                  "disabled:-translate-x-4",
                  "transition ease-in duration-300",
                  "disabled:opacity-0 disabled:w-0 disabled:p-0",
                )}
              >
                <div className="text-sm font-medium leading-none">
                  {btn.title}
                </div>
              </Button>
            </Link>
          ))}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  disabled={isBtnDisabled("Comprar")}
                  className={cn(
                    "disabled:-translate-x-4 z-50",
                    "bg-primary transition ease-in duration-300",
                    "disabled:opacity-0 disabled:w-0 disabled:p-0",
                  )}
                >
                  Comprar
                </NavigationMenuTrigger>
                <NavigationMenuContent className="relative z-50 p-2">
                  <ul className="grid gap-1 p-2 md:w-[300px] lg:w-[400px] lg:grid-cols-1">
                    <ListItem href="/mapAuctions" title="Por ubicación">
                      <MapPinnedIcon />
                    </ListItem>
                    <ListItem href="/search/auctions" title="Por lista">
                      <ListIcon />
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  disabled={isBtnDisabled("Mis actividades")}
                  className={cn(
                    "disabled:-translate-x-4 z-50",
                    "bg-primary transition ease-in duration-300",
                    "disabled:opacity-0 disabled:w-0 disabled:p-0",
                  )}
                >
                  Mis actividades
                </NavigationMenuTrigger>
                <NavigationMenuContent className="relative z-50 p-2">
                  <ul className="grid gap-1 p-2 md:w-[300px] lg:w-[400px] lg:grid-cols-1">
                    <ListItem href="/manage/auctions" title="Mis subastas">
                      <ListOrderedIcon />
                    </ListItem>
                    <ListItem href="/manage/offers" title="Mis ofertas">
                      <ListTodoIcon />
                    </ListItem>
                    <ListItem href="/manage/sales" title="Mis ventas">
                      <ListChecksIcon />
                    </ListItem>
                    <ListItem href="/manage/purchases" title="Mis compras">
                      <ListCollapseIcon />
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial"></div>
          <NotificationComponent disabled={!loggedIn || isSuperAdmin} />
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
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link ref={ref} href={href ?? ""}>
          <Button
            variant={"ghost"}
            className={cn(
              "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none",
              "transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              "w-full text-left",
              className,
            )}
          >
            <div className="flex items-center gap-2 text-sm font-medium leading-none">
              {children}
              <span>{title}</span>
            </div>
          </Button>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
