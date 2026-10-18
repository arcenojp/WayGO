import { createContext, useContext } from "react";

// The sidebar element a page's map controls (floor buttons, hints) render
// into on wide screens; null when there's no sidebar.
export const SidebarSlotContext = createContext(null);

export function useSidebarSlot() {
  return useContext(SidebarSlotContext);
}
