"use client";

import React from "react";
import { Badge } from "../ui/Badge";

interface PriorityBadgeProps {
  priority: number;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  let label = "Low";
  let variant: "success" | "warning" | "danger" = "success";

  if (priority >= 8) {
    label = `High (${priority})`;
    variant = "danger";
  } else if (priority >= 4) {
    label = `Medium (${priority})`;
    variant = "warning";
  } else {
    label = `Low (${priority})`;
    variant = "success";
  }

  return <Badge variant={variant}>{label}</Badge>;
}
