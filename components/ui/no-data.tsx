import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface NoDataOrLoadingProps {
  isLoading: boolean;
  noDataText?: string;
  children?: React.ReactNode;
  className?: string;
}

interface NoDataProps {
  noDataText?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Empty-state placeholder with a dashed border, matching the Langfuse
 * dashboard pattern. Used inside cards/widgets when there is no data.
 */
export function NoData({
  noDataText = "No data",
  children,
  className,
}: NoDataProps) {
  return (
    <div
      className={cn(
        "flex h-3/4 min-h-36 w-full items-center justify-center rounded-md border border-dashed",
        className
      )}
    >
      <p className="text-muted-foreground">{noDataText}</p>
      {children}
    </div>
  );
}

/**
 * Renders a skeleton while loading, otherwise a dashed-border "No data"
 * placeholder. Mirrors Langfuse's NoDataOrLoading component.
 */
export function NoDataOrLoading({
  isLoading,
  noDataText = "No data",
  children,
  className,
}: NoDataOrLoadingProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex h-3/4 min-h-36 w-full items-center justify-center rounded-md",
          className
        )}
      >
        <Skeleton className="h-full w-full min-h-36" />
      </div>
    );
  }

  return (
    <NoData noDataText={noDataText} className={className}>
      {children}
    </NoData>
  );
}
