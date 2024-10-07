"use client";

import { MembershipReqTable } from "@/components/MembershipReqTable";
import { SimpleCard } from "@/components/SimpleCard";
import { Badge } from "@/components/ui/badge";
import { enumMappings, cn } from "@/lib/utils";
import { Prisma, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";

type UserWithCompany = Prisma.UserGetPayload<{
  include: {
    company: true;
  };
}>;

export default function ProfileDetails() {
  const me = useQuery({
    queryKey: ["me"],
    queryFn: () =>
      axios.get("/api/users/info").then((res) => {
        return res.data as UserWithCompany;
      }),
  });

  const st = me.isSuccess ? me.data.membershipStatus : "";

  if (me.isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );

  const spanPropDescriptor = (val: string) => (
    <span className="text-sm font-light">{val}</span>
  );
  const isCompAdmin = me.data && me.data.role === "companyAdmin";
  const isMembership = me.data && me.data.membershipStatus === "accepted";

  return (
    <div className="flex flex-col py-8 gap-8 max-w-[100%]">
      <div
        className={`flex ${isCompAdmin ? "flex-row" : "flex-col"} flex-wrap gap-8 px-8 justify-center items-center`}
      >
        {me.isSuccess && (
          <>
            <SimpleCard title={"Perfil"}>
              <div className="grid grid-cols-2 gap-2 max-w-xs">
                <div className="flex flex-col gap-0">
                  {spanPropDescriptor("Nombres")}
                  <span className="font-bold text-md">{me.data.firstName}</span>
                  <div className="h-2" />
                  {spanPropDescriptor("Apellidos")}
                  <span className="font-bold text-md">{me.data.lastName}</span>
                </div>
                <div className="flex flex-col gap-0">
                  {spanPropDescriptor("Email")}
                  <span className="font-bold text-md">{me.data.email}</span>
                  <div className="h-2" />
                  {spanPropDescriptor("Estas registrado como")}
                  <span className="font-bold text-md">
                    {enumMappings.roles[me.data.role]}
                  </span>
                </div>
              </div>
            </SimpleCard>
            {me.data.company && (
              <SimpleCard
                title="Empresa"
                headerActions={
                  <div className="flex flex-col justify-around items-end gap-1">
                    <span>Solicitud de afiliación</span>
                    <Badge
                      className={cn(
                        "w-fit",
                        st === "waiting"
                          ? "bg-badge-neutral"
                          : st === "rejected"
                            ? "bg-badge-error"
                            : "bg-badge-ok",
                      )}
                    >
                      {
                        enumMappings.memberShipStatuses[
                          me.data.membershipStatus
                        ]
                      }
                    </Badge>
                  </div>
                }
              >
                <div className="grid grid-cols-2">
                  <div className="flex flex-col gap-1 max-w-52">
                    <span className="text-lg">{me.data.company.name}</span>
                    <span className="font-light text-md text-wrap">
                      {me.data.company.description}
                    </span>
                  </div>
                  <div className="flex flex-col justify-end gap-1 text-end">
                    <span className="text-xs">Dirección</span>
                    <span className="text-sm">{me.data.company.address}</span>
                  </div>
                </div>
              </SimpleCard>
            )}
          </>
        )}
      </div>
      {isCompAdmin && isMembership && (
        <div className="flex justify-center px-8">
          <SimpleCard
            title="Solicitudes de afiliación"
            desc="Controla aquí que usuarios perteneces o no a tu empresa"
          >
            <MembershipReqTable me={me.data.id} />
          </SimpleCard>
        </div>
      )}
    </div>
  );
}
