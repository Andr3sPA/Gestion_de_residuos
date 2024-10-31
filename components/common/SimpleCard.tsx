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
  titleCenter,
  desc,
  headerActions,
  children,
}: {
  className?: string;
  title?: string;
  titleCenter?: boolean;
  desc?: string;
  headerActions?: ReactNode;
  children: ReactNode;
}) {
  const renderHeader = title || desc || headerActions;

  return (
    <Card
      className={cn("w-fit p-4 m-4 border-2 shadow-md max-w-full", className)}
    >
      {renderHeader && (
        <CardHeader
          className={`px-7 grid ${headerActions ? "grid-cols-2" : ""} max-w-full`}
        >
          <div>
            <CardTitle
              className={`w-full ${titleCenter ? "text-center text-xl" : ""}`}
            >
              {title}
            </CardTitle>
            {desc && <CardDescription>{desc}</CardDescription>}
          </div>
          {headerActions && <div>{headerActions}</div>}
        </CardHeader>
      )}
      <CardContent
        className={cn("flex justify-center max-w-full", {
          "pt-6": !renderHeader,
        })}
      >
        {children}
      </CardContent>
    </Card>
  );
}
