"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { UserSession } from "@/app/api/auth/[...nextauth]/route";

export function NavigationSheet() {
  const { status, data } = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navButtons = [
    { title: "Inicio", href: "/" },
    { title: "Mis residuos", href: "/manage/wastes" },
    { title: "Vender", href: "/create-auction" },
    { title: "Comprar", href: "/search/auctions" },
    { title: "Explorar", href: "/map" },
  ];

  const activityButtons = [
    { title: "Mis subastas", href: "/manage/auctions" },
    { title: "Mis ofertas", href: "/manage/offers" },
    { title: "Mis ventas", href: "/manage/sales" },
    { title: "Mis compras", href: "/manage/purchases" },
  ];

  const loggedIn = status === "authenticated";
  const isSuperAdmin =
    loggedIn && (data as UserSession).user?.role === "superAdmin";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="md:hidden" asChild>
        <Button variant={"outline"} className="bg-primary hover:bg-primary">
          <HamburgerMenuIcon className="bg-transparent text-white scale-125" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="p-0 flex flex-col justify-center w-fit border-0"
      >
        <SheetHeader className="p-8 pb-4 bg-primary text-white">
          <SheetTitle className="text-white text-left">Menú</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <nav className="pl-8 pr-16 flex flex-col flex-grow gap-2 w-fit justify-start">
          {navButtons.map((btn, idx) => (
            <Button
              key={idx}
              variant={"ghost"}
              className={cn(
                "w-full justify-start",
                (!loggedIn || isSuperAdmin) && btn.title !== "Inicio"
                  ? "hidden"
                  : "",
              )}
              disabled={pathname === btn.href}
              onClick={() => {
                router.push(btn.href);
                setOpen(false);
              }}
            >
              {btn.title}
            </Button>
          ))}
          <Collapsible className={!loggedIn || isSuperAdmin ? "hidden" : ""}>
            <CollapsibleTrigger asChild>
              <Button className="w-full justify-start" variant={"ghost"}>
                Mis actividades
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent
              className={cn(
                "pl-4 mt-2 flex flex-col overflow-hidden transition-all CollapsibleContent",
              )}
            >
              {activityButtons.map((btn, idx) => (
                <Button
                  key={idx}
                  variant={"ghost"}
                  size={"sm"}
                  disabled={pathname === btn.href}
                  className="w-full justify-start"
                  onClick={() => {
                    router.push(btn.href);
                    setOpen(false);
                  }}
                >
                  {btn.title}
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </nav>
        <SheetFooter className="p-4 text-right">footer</SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
