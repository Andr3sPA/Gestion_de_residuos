'use client'

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@chakra-ui/react"

export default function Home() {
  const router = useRouter()

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
