import { Search, Loader2 } from "lucide-react";
import { TableList } from "./TableList";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function SimpleCard({ className, title, desc, children }:
  { className?: string, title: string, desc?: string, children: ReactNode }
) {

  const mergedClasses = twMerge("w-fit p-4 border-2 shadow-md", className ?? "")

  return <Card className={mergedClasses}>
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
