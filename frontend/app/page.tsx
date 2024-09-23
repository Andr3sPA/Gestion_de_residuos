'use client'

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@chakra-ui/react"
import axios from "axios"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    axios.post("/api/login", {
      email: "nox",
      password: "tampokc",
      age: 2,
    })
  })

  return (
    <div className="h-screen grid place-content-center">
      <div className="flex flex-col gap-2">
        <p>Hello, nextjs!</p>
        {/* <button */}
        {/*   className="border-solid border-4 border-red-100 bg-gray-200 cursor-pointer-" */}
        {/*   type="button" */}
        {/*   onClick={() => router.push("/login")}>Login</button> */}
        <Button
          variant={"ghost"}
          colorScheme="blue"
        >
          Login
        </Button>
      </div>
    </div>
  )
}
