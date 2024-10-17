import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { isEmail } from "validator";
import { signIn } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

export function LoginForm({
  size = "sm",
  border,
  onClose,
}: {
  size?: "sm" | "md" | "lg";
  border?: boolean;
  onClose?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState({ status: "pending", info: "" });

  const validFields = email.length > 0 && password.length > 8 && isEmail(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validFields) {
      setResponse({
        status: "error",
        info: "Ingresa un correo válido y una contraseña de al menos 8 carácteres",
      });
      return;
    }
    setResponse({ status: "loading", info: "" });
    signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then((res) => {
      if (res && (res.error || !res.ok)) {
        setResponse({
          status: "error",
          info: "",
        });
        toast({
          title: "Imposible iniciar sesión",
          variant: "destructive",
          description: res.error,
        });
      } else {
        setResponse({ status: "ok", info: "" });
      }
    });
  };

  border = border ?? true;
  const extraClassName =
    size === "sm" ? "p-0" : size === "md" ? "md:w-1/3 p-2" : "md:w-1/2 p-2";
  const formFieldsSpacing =
    size === "sm" ? "gap-4" : size === "md" ? "gap-8" : "gap-12";

  return (
    <Card
      className={
        "mx-auto " +
        extraClassName +
        (!border ? " border-none shadow-none" : "")
      }
    >
      <CardHeader>
        <CardTitle className="text-xl">Ingresar</CardTitle>
        <CardDescription>Escriba su correo y contraseña</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className={"grid " + formFieldsSpacing}>
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
            </div>
            <Input
              id="password"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              value={password}
            />
          </div>
          {response.status === "error" && response.info.length > 0 && (
            <div className="text-destructive text-sm">{response.info}</div>
          )}
          <Button
            disabled={response.status === "loading"}
            type="submit"
            className="w-full"
          >
            {response.status === "loading" ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link
            href="/signup"
            onClick={() => onClose && onClose()}
            className="underline"
          >
            Registrarse
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
