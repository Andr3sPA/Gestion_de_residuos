"use client";

import { GeneralReport } from "@/components/GeneralReport";
import { Stats } from "@/components/stats/Stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileDetails } from "@/components/users/ProfileDetails";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { status } = useSession();

  if (status === "loading")
    return (
      <div>
        <Loader2 className="animate-spin" />
      </div>
    );
  if (status === "unauthenticated")
    return (
      <div>
        <span>Usuario no conectado</span>
      </div>
    );

  return (
    <Tabs defaultValue="stats" className="w-full sm:p-8 py-4">
      <TabsList className="p-2 flex flex-wrap h-fit sm:w-fit w-full">
        <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        <TabsTrigger value="reports">Subastas</TabsTrigger>
        <TabsTrigger value="me">Mi perfil y empresa</TabsTrigger>
      </TabsList>
      <TabsContent value="me">
        <ProfileDetails />
      </TabsContent>
      <TabsContent value="stats" className="flex justify-center">
        <Stats />
      </TabsContent>
      <TabsContent value="reports" className="flex justify-center">
        <GeneralReport />
      </TabsContent>
    </Tabs>
  );
}
