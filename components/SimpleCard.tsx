import { Search, Loader2 } from "lucide-react";
import { TableList } from "./TableList";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { ReactNode } from "react";

export function SimpleCard({ title, desc, children }:
  { title: string, desc?: string, children: ReactNode }
) {
  return <Card className="w-fit p-4 border-2 shadow-md">
    <CardHeader className="px-7 grid grid-cols-2">
      <div>
        <CardTitle>{title}</CardTitle>
        {desc &&
          <CardDescription>
            {desc}
          </CardDescription>
        }
      </div>
    </CardHeader>
    <CardContent className="flex justify-center">
      {children}
    </CardContent>
  </Card>
}
