"use client";

import { GeneralReport } from "@/components/GeneralReport";
import { Stats } from "@/components/stats/Stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileDetails } from "@/components/users/ProfileDetails";

export default function Home() {
  return (
    <Tabs defaultValue="stats" className="w-full px-8">
      <TabsList className="p-2">
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
