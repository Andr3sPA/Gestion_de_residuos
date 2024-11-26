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
      className={cn(
        "w-fit p-0 m-4 border-2 shadow-md max-w-full overflow-x-auto",
        className,
      )}
    >
      {renderHeader && (
        <CardHeader
          className={`px-6 ${headerActions ? "grid grid-cols-2" : ""} max-w-full`}
        >
          <div
            className={`${titleCenter ? "flex flex-wrap justify-center w-full" : ""}`}
          >
            <CardTitle
              className={`w-fit ${titleCenter ? "text-center text-xl w-full" : ""}`}
            >
              {title}
            </CardTitle>
            {desc && (
              <CardDescription
                className={`w-full text-primary ${titleCenter ? "text-center" : ""}`}
              >
                {desc}
              </CardDescription>
            )}
          </div>
          {headerActions && <div>{headerActions}</div>}
        </CardHeader>
      )}
      <CardContent
        className={cn("flex justify-center max-w-[100%] h-fit", {
          "pt-6": !renderHeader,
        })}
      >
        {children}
      </CardContent>
    </Card>
  );
}
