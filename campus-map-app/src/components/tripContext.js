import { createContext, useContext } from "react";

// The directions the user picked from search (see TripProvider).
export const TripContext = createContext(null);

export function useTrip() {
  return useContext(TripContext);
}
