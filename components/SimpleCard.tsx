import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function SimpleCard({
  className,
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
  const mergedClasses = twMerge(
    "w-fit p-4 border-2 shadow-md max-w-full",
    className ?? "",
  );

  return (
    <Card className={mergedClasses}>
      <CardHeader className="px-7 grid grid-cols-2 max-w-full">
        <div>
          <CardTitle className="w-full">{title}</CardTitle>
          {desc && <CardDescription>{desc}</CardDescription>}
        </div>
        <div>{headerActions}</div>
      </CardHeader>
      <CardContent className="flex justify-center max-w-full">
        {children}
      </CardContent>
    </Card>
  );
}
