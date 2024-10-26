"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useSettingContext from "@/hooks/use-setting";
import { useEffect, useMemo, useState, type FC } from "react";
import AvailabilityItem from "./availability-item";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useLocalStorage } from "usehooks-ts";
import clsx from "clsx";
import { Text } from "@/components/ui/text";

type CardAvailabilityProps = { className?: string };

export type SettingAvailability = z.infer<typeof FormSchema>;

const FormSchema = z.object({
  weeklySlots: z.array(
    z.object({
      dayNo: z.string(), // 1-7, 1 is Monday, 7 is Sunday
      slots: z
        .array(
          z.object({
            start: z.string(),
            end: z.string(),
          })
        )
        .optional(),
    })
  ),
});

const days = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

const hourStart = 7;
const hourEnd = 19;

const generateTimeSlots = (start: number, end: number, period: number = 30) => {
  const slots = [];
  for (let hour = start; hour <= end; hour++) {
    for (let minute = 0; minute < 60; minute += period) {
      if (hour === end && minute > 0 + period) break;
      const periodLabel = hour < 12 ? "am" : "pm";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const displayMinute =
        minute === 0 ? "00" : minute.toString().padStart(2, "0");
      const label = `${displayHour
        .toString()
        .padStart(2, "0")}:${displayMinute} ${periodLabel}`;
      const value = `${hour.toString().padStart(2, "0")}:${displayMinute}`;
      slots.push({ label, value });
    }
  }
  return slots;
};

const defaultValues: SettingAvailability = {
  weeklySlots: [
    { dayNo: "1", slots: undefined },
    { dayNo: "2", slots: undefined },
    { dayNo: "3", slots: undefined },
    { dayNo: "4", slots: undefined },
    { dayNo: "5", slots: undefined },
    { dayNo: "6", slots: undefined },
    { dayNo: "7", slots: undefined },
  ],
};

const CardAvailability: FC<CardAvailabilityProps> = ({ className }) => {
  const { duration } = useSettingContext();
  const [isLoading, setIsLoading] = useState(false);

  const [availability, setAvailability] = useLocalStorage<string | null>(
    "availability",
    JSON.stringify(defaultValues)
  );

  const form = useForm<SettingAvailability>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues,
  });

  const timeSlots = useMemo(() => {
    return generateTimeSlots(hourStart, hourEnd, duration);
  }, [duration]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (data: SettingAvailability) => {
    setIsLoading(true);
    console.log("ONSUBMIT", data);
    setAvailability(JSON.stringify(data));

    toast({
      title: "Saved",
      description: "Your availability has been saved",
    });

    setIsLoading(false);
  };

  const onCopyToAll = (index: number) => {
    setIsLoading(true);

    const currentDaySlots = form.getValues(`weeklySlots.${index}.slots`);
    form.reset({
      weeklySlots: form.getValues("weeklySlots").map((day, i) => ({
        ...day,
        slots: i !== index ? currentDaySlots : day.slots,
      })),
    });

    setIsLoading(false);
  };

  useEffect(() => {
    if (!!availability) form.reset(JSON.parse(availability));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availability]);

  return (
    <Card className={clsx(className, "relative")} key={duration}>
      {!duration && (
        <div className="absolute inset-0 bg-black/80 rounded-lg flex items-center justify-center z-10">
          <Text className="text-white select-none">
            Update setting on the left to enable this feature
          </Text>
        </div>
      )}
      <CardHeader>
        <CardTitle>Availability</CardTitle>
        <CardDescription>Set your weekly recurring schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
            {Object.entries(days).map((day, idx) => (
              <AvailabilityItem
                key={idx}
                isLoading={isLoading || !duration}
                index={idx}
                day={day}
                slots={timeSlots}
                onCopyToAll={() => onCopyToAll?.(idx)}
              />
            ))}

            <Button type="submit" disabled={isLoading || !duration}>
              Submit
            </Button>

            <FormField
              control={form.control}
              name="weeklySlots"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CardAvailability;
