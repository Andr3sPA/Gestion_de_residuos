import { useQuery } from "@tanstack/react-query";
import { TableList } from "./TableList";
import { ColumnDef, Row } from "@tanstack/react-table";
import axios from "axios";
import { Prisma, User } from "@prisma/client";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { CheckIcon, Loader2, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { enumMappings } from "@/lib/utils";
import { stat } from "fs";

interface UserChecked extends User {
  checked: boolean;
  updatingTo: "rejected" | "accepted" | null
}

export function MembershipReqTable({ me }:
  { me: number }) {
  const [allChecked, setAllChecked] = useState(false)
  const [bulkLoading, setBulkLoading] = useState({ a: false, r: false })
  const [users, setUsers] = useState<UserChecked[]>([])

  const companyUsers = useQuery({
    queryKey: ["compUsers"],
    queryFn: () => axios.get("/api/users/list")
      .then((res) => {
        const users = Object.values(res.data).filter((user: any) => user.id !== me)
        const mapped = users.map((user: any) => {
          user.checked = false
          user.updatingTo = null
          return user
        }) as UserChecked[]
        setUsers(mapped)
        return users
      })
  })

  const changeUserStatus = (row: Row<UserChecked>, status: "accepted" | "rejected") => {
    setUsers((users) => users.map((u) => {
      if (u.id === row.original.id) {
        u.updatingTo = status
      }
      return u
    }))
    axios.patch("/api/users/info", { id: row.original.id, status })
      .then(() => {
        setUsers((users) => users.map((u) => {
          if (u.id === row.original.id) {
            u.updatingTo = null
            u.membershipStatus = status
          }
          return u
        }))
        companyUsers.refetch()
      })
  }

  const cols: ColumnDef<UserChecked>[] = [
    {
      id: "checked",
      header: ({ table, column, header }) => {
        return <Checkbox
          checked={allChecked}
          onCheckedChange={(checked) => {
            if (companyUsers.isSuccess) {
              setUsers((users) =>
                users.map((user) => {
                  user.checked = checked as boolean
                  return user
                })
              )
              setAllChecked(checked as boolean)
            }
          }}
          className="hover:scale-125 transition-all ease-in duration-150"
        />
      },
      cell: ({ row, table }) => {
        return <Checkbox
          checked={row.original.checked}
          onCheckedChange={(c) => {
            if (companyUsers.isSuccess) {
              setUsers((users) => users.map((user) => {
                if (user.id === row.original.id) {
                  user.checked = c as boolean
                }
                return user
              }))
              if (!c) setAllChecked(false)
            }
          }}
          className="hover:scale-125 transition-all ease-in duration-150" />
      }
    },
    {
      id: "name",
      header: "Nombre",
      cell: ({ row }) => <span className="font-semibold">
        {`${row.original.firstName} ${row.original.lastName}`}
      </span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="font-light">{row.original.email}</span>
    },
    {
      id: "status",
      accessorFn: (u) => {
        return enumMappings.memberShipStatuses[u.membershipStatus]
      },
      header: "Estado",
      cell: ({ row }) => {
        const st = row.original.membershipStatus
        return <Badge className={st === "waiting" ? "bg-badge-neutral" : (st === "rejected" ? "bg-badge-error" : "bg-badge-ok")}>
          {enumMappings.memberShipStatuses[st]}
        </Badge>
      }
    },
    {
      id: "role",
      accessorFn: (u) => enumMappings.roles[u.role],
      header: "Rol si es aceptado",
      cell: ({ row }) => enumMappings.roles[row.original.role]
    },
    {
      id: "action",
      header: "Rechazar/Aceptar",
      cell: ({ row }) => {
        const userId = row.original.id
        return <div className="flex justify-center">
          <Button
            disabled={row.original.updatingTo !== null || row.original.membershipStatus === "rejected"}
            onClick={() => { changeUserStatus(row, "rejected") }}
            size={"sm"} className="scale-75 bg-destructive">
            {row.original.updatingTo === "rejected" ?
              <Loader2 className="animate-spin" /> :
              <XIcon />
            }
          </Button>
          <Button
            disabled={row.original.updatingTo !== null || row.original.membershipStatus === "accepted"}
            onClick={() => { changeUserStatus(row, "accepted") }}
            className="scale-75 bg-primary"
            size={"sm"}>
            {row.original.updatingTo === "accepted" ?
              <Loader2 className="animate-spin" /> :
              <CheckIcon />
            }
          </Button>
        </div>
      }
    }
  ]

  const anyChecked = users.some((u) => u.checked)
  const bulkChangeStatus = (status: "accepted" | "rejected") => {
    setBulkLoading({ a: status === "accepted", r: status === "rejected" })
    Promise.all(users.map((u) => {
      if (u.checked) {
        return axios.patch("/api/users/info", { id: u.id, status: status })
      }
      return Promise.resolve(null)
    })).then(() => {
      companyUsers.refetch().then(() => {
        setBulkLoading({ a: false, r: false })
      })
    })
  }

  return <div className="overflow-x-auto">
    <TableList
      columns={cols}
      data={companyUsers.isSuccess ? users : []}
    />
    <div className="flex mt-6 flex-row justify-center gap-4">
      <Button
        disabled={!anyChecked || bulkLoading.r}
        className="bg-destructive"
        onClick={() => { bulkChangeStatus("rejected") }}
      >
        {bulkLoading.r ?
          <Loader2 className="animate-spin" /> :
          "Rechazar seleccionadas"
        }
      </Button>
      <Button
        disabled={!anyChecked || bulkLoading.a}
        onClick={() => { bulkChangeStatus("accepted") }}
      >
        {bulkLoading.a ?
          <Loader2 className="animate-spin" /> :
          "Aceptar seleccionadas"
        }
      </Button>
    </div>
  </div>
}
