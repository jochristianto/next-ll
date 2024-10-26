"use client";

import { SettingContext, TSetting } from "@/hooks/use-setting";

import { useLocalStorage } from "usehooks-ts";
import { useEffect, useState, type FC } from "react";

type TSettingProviderProps = {
  children: React.ReactNode;
};

export const SettingProvider: FC<TSettingProviderProps> = ({ children }) => {
  const initialValue: TSetting = {
    duration: undefined,
    bookingLimit: undefined,
    videoTour: undefined,
  };

  const [setting, setSetting] = useLocalStorage<string | null>(
    "setting",
    JSON.stringify(initialValue)
  );

  const [, setAvailability] = useLocalStorage<string | null>(
    "availability",
    null
  );

  const [data, setData] = useState<TSetting>(initialValue);

  useEffect(() => {
    if (!!setting) setData(JSON.parse(setting));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSetting(JSON.stringify(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <SettingContext.Provider
      value={{
        duration: parseInt(`${data.duration}`, 10) || undefined,
        bookingLimit: parseInt(`${data.bookingLimit}`, 10) || undefined,
        videoTour: data.videoTour,

        setDuration: (duration: number | string) => {
          setData((prev) => ({
            ...prev,
            duration: parseInt(`${duration}`, 10),
          }));
          setAvailability(JSON.stringify({}));
        },
        setBookingLimit: (bookingLimit: number | string) =>
          setData((prev) => ({
            ...prev,
            bookingLimit: parseInt(`${bookingLimit}`, 10),
          })),
        setVideoTour: (videoTour: boolean) =>
          setData((prev) => ({ ...prev, videoTour })),
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};
