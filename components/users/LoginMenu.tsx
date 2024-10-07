import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { LoginForm } from "./LoginForm";
import { Button } from "../ui/button";
import { CircleUser } from "lucide-react";

export function LoginMenu() {
  const [open, setOpen] = useState(false)

  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button variant="secondary" size="icon" className="rounded-full">
        <CircleUser className="h-5 w-5" />
        <span className="sr-only">Toggle user menu</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <LoginForm onClose={() => setOpen(false)} border={false} />
    </PopoverContent>
  </Popover>
}
