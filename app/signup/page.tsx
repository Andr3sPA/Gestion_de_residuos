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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

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
    return strong
  }, {
    message: "La contraseña debe tener al menos 8 caracteres \
    y contener al menos una letra mayúscula, una minúscula y un número"
  }),
  phone: z.string(),
  companyCode: z.string().min(4, { message: "Ingrese al menos 4 caracteres" }),

})

export default function Signup() {
  const router = useRouter()
  const { status } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    // redirect if already authenticated
    if (status === "authenticated") {
      router.replace("/")
    }
  }, [status])

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      companyCode: ""
    }
  })
  const [res, setRes] = useState({ status: "pending", info: "" })

  const onSubmit = (values: z.infer<typeof signupSchema>) => {

    setRes({ status: "loading", info: "" })
    axios.post("/api/users/signup", {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      phone: values.phone,
      companyCode: values.companyCode
    }).then(() => {
      setRes({ status: "ok", info: "" })
      router.push("/")
    }).catch((err) => {
      setRes({ status: "error", info: err.response.data.error ?? "Error al enviar los datos de registro" })
      toast({
        variant: "destructive",
        title: "Error al validar los datos",
        duration: 3000,
        description: res.info,
      })
      console.error(err)
    })

  }

  const fields = [ // [field, text to show, input type]
    ["firstName", "Nombres", "string"],
    ["lastName", "Apellidos", "string"],
    ["email", "Email", "email"],
    ["password", "Contraseña", "password"],
    ["phone", "Número de contacto", "string"],
    ["companyCode", "Código de la empresa a la que pertenece", "string"]
  ]


  type signupKey = keyof typeof signupSchema.shape

  return <Card className="mx-24 w-2/5 shadow-lg min-w-max md:min-w-fit">
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
                    <Input id={f[0]} type={f[2]} autoComplete='on'
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

        </form>
      </FormProvider>
    </CardContent>
    <Toaster />
  </Card>

}
