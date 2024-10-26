"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

const HomePage = ({}) => {
  return (
    <FullCalendar
      plugins={[timeGridPlugin]}
      initialView="timeGridWeek"
      height={700}
      selectable
      eventConstraint="businessHours"
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
      // events={[
      //   {
      //     start: "2024-10-28T10:00:00",
      //     end: "2024-10-28T16:00:00",
      //     display: "inverse-background",
      //   },
      // ]}
      events={[
        {
          title: "Available",
          date: "2024-10-27T08:00:00",
          interactive: true,
          classNames: ["cal-available"],
        },
        {
          title: "Available",
          date: "2024-10-27T08:00:00",
          interactive: true,
          classNames: ["cal-available"],
        },
        // {
        //   title: "Available",
        //   date: "2024-10-27T08:00:00",
        //   interactive: true,
        //   classNames: ["cal-available"],
        // },
      ]}
    />
  );
};

export default HomePage;
