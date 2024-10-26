"use client";

import { createContext, useContext } from "react";

export type TSetting = {
  duration?: number;
  bookingLimit?: number;
  videoTour?: boolean;
};

type TSettingContext = TSetting & {
  setDuration: (duration: number) => void;
  setBookingLimit: (bookingLimit: number) => void;
  setVideoTour: (videoTour: boolean) => void;
};

export const SettingContext = createContext<TSettingContext>({
  duration: undefined,
  bookingLimit: undefined,
  videoTour: undefined,
  setDuration: () => {},
  setBookingLimit: () => {},
  setVideoTour: () => {},
});

export default function useSettingContext() {
  const context = useContext(SettingContext);
  if (!context)
    throw new Error("useSettingContext must be used within a SettingProvider");

  return context;
}
