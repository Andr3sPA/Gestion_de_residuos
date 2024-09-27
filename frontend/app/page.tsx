'use client'
import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import {DataTableDemo} from '../components/table';

export default function Home() {
  const router = useRouter()
  return (
    <div>
      <DataTableDemo />
    </div>
  )
}
