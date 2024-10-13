import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function SimpleCard({
  className = "",
  title,
  desc,
  headerActions,
  children,
}: {
  className?: string;
  title: string;
  desc?: string;
  headerActions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card
      className={cn(
        "w-fit p-4 m-4 border-2 transi shadow-md max-w-full",
        className,
      )}
    >
      <CardHeader
        className={`px-7 grid ${headerActions ? "grid-cols-2" : ""} max-w-full`}
      >
        <div>
          <CardTitle className="w-full">{title}</CardTitle>
          {desc && <CardDescription>{desc}</CardDescription>}
        </div>
        {headerActions && <div>{headerActions}</div>}
      </CardHeader>
      <CardContent className="flex justify-center max-w-full">
        {children}
      </CardContent>
    </Card>
  );
}
