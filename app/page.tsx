"use client";

import { toast } from "@/hooks/use-toast";

export default function Home() {
  return (
    <div
      onClick={() => {
        toast({
          description: "si creo",
          variant: "default",
        });
      }}
    >
      Nothing
    </div>
  );
}
