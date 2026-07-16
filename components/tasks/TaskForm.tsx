"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskInput } from "../../lib/validators";
import { useTaskStore } from "../../store/taskStore";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Task } from "../../types/task";
import { toast } from "sonner";
import { Plus, Check } from "lucide-react";

interface TaskFormProps {
  taskToEdit?: Task | null;
  onCancelEdit?: () => void;
}

export function TaskForm({ taskToEdit, onCancelEdit }: TaskFormProps) {
  const { createTask, updateTask } = useTaskStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      priority: 5,
    },
  });

  const priorityVal = watch("priority");

  useEffect(() => {
    if (taskToEdit) {
      setValue("title", taskToEdit.title);
      setValue("priority", taskToEdit.priority);
    } else {
      reset({ title: "", priority: 5 });
    }
  }, [taskToEdit, setValue, reset]);

  const onSubmit = async (data: TaskInput) => {
    try {
      if (taskToEdit) {
        await updateTask(taskToEdit.id, data.title, data.priority, taskToEdit.completed);
        toast.success("Task updated successfully");
        if (onCancelEdit) onCancelEdit();
      } else {
        await createTask(data.title, data.priority);
        toast.success("Task created successfully");
        reset({ title: "", priority: 5 });
      }
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to save task");
    }
  };

  return (
    <Card className="border border-slate-200/60 dark:border-slate-800/80">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {taskToEdit ? "Edit Task" : "Add New Task"}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <Input
              id="title"
              label="Task name"
              placeholder="e.g. Design app homepage..."
              error={errors.title?.message}
              {...register("title")}
            />
          </div>

          <div className="flex flex-col">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Priority: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{priorityVal}</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                id="priority"
                type="range"
                min="1"
                max="10"
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-205 dark:bg-slate-800 accent-indigo-650 dark:accent-indigo-500"
                {...register("priority", { valueAsNumber: true })}
              />
              <span className="text-xs font-semibold text-slate-500 w-4 text-center">10</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          {taskToEdit && onCancelEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isSubmitting}
            icon={taskToEdit ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          >
            {taskToEdit ? "Save Changes" : "Add Task"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
