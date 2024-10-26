"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { SettingAvailability } from "./setting/_components/card-availability";
import { SettingGeneral } from "./setting/_components/card-setting";

const getDatesInRange = (start: Date, end: Date) => {
  const dates = [];
  const currentDate = new Date(start);

  while (currentDate <= end) {
    dates.push({
      date: new Date(currentDate),
      dayNumber: currentDate.getDay() === 0 ? 7 : currentDate.getDay(),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const HomePage = ({}) => {
  const [active, setActive] = useState<{ start: Date; end: Date } | null>(null);
  const [setting] = useLocalStorage("setting", null);
  const [availability] = useLocalStorage("availability", null);

  const parsedSetting: SettingGeneral = useMemo(() => {
    if (!setting) return {};
    return JSON.parse(setting);
  }, [setting]);

  const parsedAvailability: SettingAvailability = useMemo(() => {
    if (!availability) return {};
    return JSON.parse(availability);
  }, [availability]);

  const events = useMemo(() => {
    if (!active) return [];

    const dates = getDatesInRange(active.start, active.end);

    const availableDates = dates.map(({ date, dayNumber }) => {
      const slots = parsedAvailability.weeklySlots?.[dayNumber - 1]?.slots;
      const newTime = slots?.map(({ start, end }) => {
        const [hourStart, minuteStart] = start.split(":");
        const [hourEnd, minuteEnd] = end.split(":");

        return {
          start: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            parseInt(hourStart, 10),
            parseInt(minuteStart, 10)
          ),
          end: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            parseInt(hourEnd, 10),
            parseInt(minuteEnd, 10)
          ),
        };
      });

      return { date, events: newTime };
    });

    const events = availableDates
      .map(({ date, events }) => {
        return events?.map(({ start, end }) => {
          return {
            title: "Available",
            start,
            end,
            date,
            interactive: true,
            classNames: ["cal-available"],
          };
        });
      })
      .flat(1);

    const duplicatedEvents = events
      ?.map((event) => {
        const bookingLimit = parsedSetting.bookingLimit || 1;
        return Array.from({ length: bookingLimit }, (_, index) => ({
          ...event,
          id: `${event?.start.toISOString()}-${index}`,
        }));
      })
      .flat(1);

    return duplicatedEvents.filter((event) => event !== undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <>
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        height={700}
        firstDay={1}
        selectable
        eventConstraint="businessHours"
        datesSet={(dateInfo) => {
          setActive({ start: dateInfo.start, end: dateInfo.end });
        }}
        businessHours={[
          // specify an array instead
          {
            daysOfWeek: [1, 2, 3], // Monday, Tuesday, Wednesday
            startTime: "07:00",
            endTime: "19:00",
          },
          {
            daysOfWeek: [4, 5], // Thursday, Friday
            startTime: "07:00",
            endTime: "19:00",
          },
        ]}
        events={events}
        // events={[
        //   {
        //     title: "Available",
        //     date: "2024-10-28T08:00:00",
        //     interactive: true,
        //     classNames: ["cal-available"],
        //   },
        //   {
        //     title: "Available",
        //     date: "2024-10-28T08:00:00",
        //     interactive: true,
        //     classNames: ["cal-available"],
        //   },
        //   {
        //     title: "Available",
        //     date: "2024-10-28T08:00:00",
        //     interactive: true,
        //     classNames: ["cal-available"],
        //   },
        // ]}
      />
    </>
  );
};

export default HomePage;
