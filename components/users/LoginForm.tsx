import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { isEmail } from "validator"
import { Form } from "../ui/form"
import { signIn, useSession } from "next-auth/react"

export function LoginForm({ border, onClose }: { border?: boolean, onClose?: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [response, setResponse] = useState({ status: "pending", info: "" })
  const { data, status } = useSession()

  const validFields = email.length > 0 && password.length > 8 && isEmail(email)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setResponse({ status: "loading", info: "" })
    signIn("credentials", {
      email, password
      , redirect: false
    }).then(() => setResponse({ status: "ok", info: "" }))
      .catch((err) =>
        setResponse({ status: "error", info: err.response.data ?? "Error al enviar los datos" }))
  }

  border = border ?? true

  return (
    <Card className={"mx-auto max-w-sm" + (!border ? " border-none shadow-none" : "")}>
      <CardHeader>
        <CardTitle className="text-xl">Ingresar</CardTitle>
        <CardDescription>
          Escriba su correo y contraseña
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@mail.com"
              required
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Contraseña</Label>
              {/* <Link href="#" className="ml-auto inline-block text-sm underline"> */}
              {/*   Forgot your password? */}
              {/* </Link> */}
            </div>
            <Input id="password"
              type="password"
              required onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              value={password}
            />
          </div>
          <Button disabled={response.status === "loading"} type="submit" className="w-full">
            {response.status === "loading" ?
              <Loader2 className="animate-spin" /> : "Login"
            }
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link href="/signup"
            onClick={() => onClose && onClose()}
            className="underline">
            Registrarse
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
