import { useTaskStore } from "../store/taskStore";

export const useTasks = () => {
  return useTaskStore();
};
