import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NotificationPreferences {
  notifyBadges: boolean;
  notifyComments: boolean;
  notifyCollaborators: boolean;
  notifyOverdue: boolean;
  notifySound: boolean;
}

interface UIState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed: boolean) => set({ isSidebarCollapsed: collapsed }),

      notificationPreferences: {
        notifyBadges: true,
        notifyComments: true,
        notifyCollaborators: true,
        notifyOverdue: true,
        notifySound: false,
      },
      updateNotificationPreferences: (prefs) =>
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            ...prefs,
          },
        })),
    }),
    {
      name: "ui-settings-storage",
    }
  )
);
