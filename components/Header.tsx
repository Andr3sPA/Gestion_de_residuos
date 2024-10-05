'use client'

import { CircleUser, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./ui/sheet";
import { LoginForm } from "./users/LoginForm";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data, status } = useSession()
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const router = useRouter()
  const path = usePathname()

  const loggedIn = status === "authenticated"

  const userButton = <Button variant="secondary" size="icon" className="rounded-full">
    <CircleUser className="h-5 w-5" />
    <span className="sr-only">Toggle user menu</span>
  </Button>

  const menuLoggedIn = <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {userButton}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel className="grid grid-rows-2">
        <span>Cuenta</span>
        <span className="font-extralight font-xs">
          {data && data.user && data.user.name ?
            data.user.name : "noc"}
        </span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {/* <DropdownMenuItem disabled className="cursor-pointer" */}
      {/*   onClick={() => router.push("/settings")}>Ajustes</DropdownMenuItem> */}
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>Cerrar sesión</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  const [open, setOpen] = useState(false)

  const menuLogin = <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      {userButton}
    </PopoverTrigger>
    <PopoverContent>
      <LoginForm onClose={() => setOpen(false)} border={false} />
    </PopoverContent>
  </Popover>

  const checkIfPath = (pathStr: string) => {
    return path === pathStr
  }

  const goto = (pathStr: string) => {
    router.push(pathStr)
  }

  const navButtons = [
    ["/", "Inicio"],
    ["/manage/wastes", "Mis residuos"],
    ["/manage/auctions", "Vender"],
    ["/search/auctions", "Comprar"],
  ]

  return <div className="flex w-full flex-col shadow-md">
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="text-nowrap hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        {navButtons.map((btn, idx) =>
          <Button key={idx} variant={"link"}
            onClick={() => goto(btn[0])}
            disabled={checkIfPath(btn[0])}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {btn[1]}
          </Button>
        )}
      </nav>
      <Sheet open={sideMenuOpen} onOpenChange={setSideMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col gap-4 w-fit">
          <SheetTitle>Menú</SheetTitle>
          <SheetDescription className="sr-only">Navigation menu</SheetDescription>
          <nav className="grid gap-6 w-fit pr-16 text-lg font-medium">
            {navButtons.map((btn, idx) =>
              <Button key={idx} variant={"ghost"}
                onClick={() => { goto(btn[0]); setSideMenuOpen(false) }}
                disabled={checkIfPath(btn[0])}
                className="text-muted-foreground justify-start transition-colors hover:text-foreground"
              >
                {btn[1]}
              </Button>
            )}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
        </div>
        {loggedIn ? menuLoggedIn : menuLogin}
      </div>
    </header>
  </div>
}
