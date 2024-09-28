import { CircleUser, Menu, MenuIcon, Package2 } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Link from "next/link";
import { LoginForm } from "./users/LoginForm";
import { useAuth } from "@/contexts/Auth";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const auth = useAuth()
  const router = useRouter()
  const path = usePathname()

  const userButton = <Button variant="secondary" size="icon" className="rounded-full">
    <CircleUser className="h-5 w-5" />
    <span className="sr-only">Toggle user menu</span>
  </Button>

  const menuLoggedIn = <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {userButton}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Cuenta</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {/* <DropdownMenuItem disabled className="cursor-pointer" */}
      {/*   onClick={() => router.push("/settings")}>Ajustes</DropdownMenuItem> */}
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer" onClick={() => auth.logout()}>Cerrar sesión</DropdownMenuItem>
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

  return <div className="flex w-full flex-col shadow-md">
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="text-nowrap hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Button variant={"link"}
          onClick={() => goto("/")}
          disabled={checkIfPath("/")}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Inicio
        </Button>
        <Button variant={"link"}
          onClick={() => goto("/manage/offers")}
          disabled={checkIfPath("/manage/offers")}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Mis ofertas
        </Button>
        <Button variant={"link"}
          onClick={() => goto("/search/offers")}
          disabled={checkIfPath("/search/offers")}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Buscar Ofertas
        </Button>
      </nav>
      <Sheet>
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
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Inicio
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Ofertas
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
        </div>
        {auth.loggedIn ? menuLoggedIn : menuLogin}
      </div>
    </header>
  </div>
}
