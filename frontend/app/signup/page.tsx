'use client'

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { isStrongPassword } from "validator";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loader2, Text } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/Auth";

const signupSchema = z.object({
  firstName: z.string().min(3, {
    message: "Ingrese al menos 3 caracteres"
  }),
  lastName: z.string().min(3, {
    message: "Ingrese al menos 3 caracteres"
  }),
  email: z.string().email("Email no válido"),
  password: z.string().refine((pass) => {
    const strong = isStrongPassword(pass, { minLength: 8, minNumbers: 1, minLowercase: 1, minUppercase: 1, minSymbols: 0 })
    console.log(strong)
    return strong
  }, {
    message: "La contraseña debe tener al menos 8 caracteres \
    y contener al menos una letra mayúscula, una minúscula y un número"
  }),
  companyId: z.string().refine((id) => {
    const num = parseInt(id)
    return !isNaN(num)
  }),

})

export default function Signup() {
  const router = useRouter()
  const auth = useAuth()

  useEffect(() => {
    if (auth.loggedIn) {
      router.replace("/")
    }
  }, [auth.loggedIn])

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      companyId: ""
    }
  })
  const [res, setRes] = useState({ status: "pending", info: "" })

  const onSubmit = (values: z.infer<typeof signupSchema>) => {

    setRes({ status: "loading", info: "" })
    axios.post("/api/users/signup", {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password
    }).then((res) => {
      setRes({ status: "ok", info: "" })
      router.push("/")
    }).catch((err) => {
      setRes({ status: "error", info: err.response.data ?? "Error al enviar los datos de registro" })
    })

  }

  const fields = [ // [field, text to show, input type]
    ["firstName", "Nombres", "string"],
    ["lastName", "Apellidos", "string"],
    ["email", "Email", "email"],
    ["password", "Contraseña", "password"],
    ["companyId", "Id de la empresa a la que pertenece", "number"]
  ]

  type signupKey = keyof typeof signupSchema.shape

  return <Card className="mx-24 min-w-fit w-2/5 shadow-lg">
    <CardHeader className="font-bold text-xl text-center">
      Registrarse
    </CardHeader>
    <CardContent className="grid px-16 py-4">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {fields.map((f, i) => (
            <FormField
              key={i}
              control={form.control}
              name={f[0] as signupKey}
              render={({ field }) => (
                <FormItem
                  className="mb-2"
                  id={f[0]}>
                  <FormLabel htmlFor={f[0]}>
                    {f[1]}
                  </FormLabel>
                  <FormControl id={f[0]}>
                    <Input id={f[0]} type={f[2]}
                      {...field} />
                  </FormControl>
                  <FormMessage className="text-xs max-w-sm" />
                </FormItem>
              )}
            />
          ))}
          <Separator className="h-8" />
          <div className="flex w-full justify-around">
            <Button variant={"secondary"}>
              Regresar
            </Button>
            <Button type="submit">
              {res.status === "loading" ?
                <Loader2 className="animate-spin" /> :
                "Registrarse"
              }
            </Button>
          </div>
          {res.status === "error" &&
            <>
              <Separator className="h-8" />
              <div>
                <Text>{res.info}</Text>
              </div>
            </>
          }
        </form>
      </FormProvider>
    </CardContent>
  </Card>
}
