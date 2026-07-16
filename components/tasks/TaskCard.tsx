"use client";

import React from "react";
import { Task } from "../../types/task";
import { Card } from "../ui/Card";
import { TaskItem } from "./TaskItem";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  return (
    <Card className="!p-0 overflow-hidden hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
      <TaskItem task={task} onEdit={onEdit} />
    </Card>
  );
}
