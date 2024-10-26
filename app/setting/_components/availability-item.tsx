"use client";

import clsx from "clsx";
import { useEffect, useMemo, type FC } from "react";
import { CopyIcon, PlusCircleIcon, XCircleIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Checkbox } from "@/components/ui/checkbox";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

type AvailabilityItemProps = {
  className?: string;
  isLoading?: boolean;
  index: number;
  day: [string, string];
  slots: { label: string; value: string }[];
  onCopyToAll: () => void;
};

const AvailabilityItem: FC<AvailabilityItemProps> = ({
  className,
  isLoading = false,
  index,
  day,
  slots,
  onCopyToAll,
}) => {
  const [value, label] = day;
  const checkboxId = `enable-day-${value}`;
  const { control, watch } = useFormContext(); // retrieve those props

  const { fields, append, update, remove, replace } = useFieldArray({
    control,
    name: `weeklySlots[${index}].slots`,
  });

  const onCheckboxChange = (checked: boolean) => {
    if (checked) append({ start: slots[0].value, end: slots[1].value });
    else replace([]);
  };

  const ws = useWatch({
    control,
    name: `weeklySlots[${index}].slots`,
  });

  const availableSlots = useMemo(() => {
    const sortedFields = Array.isArray(ws)
      ? [...ws].sort((a, b) => a.start.localeCompare(b.start))
      : [];
    const lastFieldStart = sortedFields[sortedFields.length - 1]?.start;
    const lastUsedIndex = slots.findIndex(
      (slot) => slot.value === lastFieldStart
    );
    const available = slots.slice(lastUsedIndex + 1);

    if (available.length === 0) return [];

    return available;
  }, [ws, slots]);

  const newItem = () => {
    append({
      start: availableSlots?.[0].value,
      end: availableSlots?.[1].value,
    });
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name?.includes(`weeklySlots[${index}].slots`)) {
        const slotIndex = parseInt(
          name.split(".")[1]?.match(/\d+/g)?.[0] ?? "0",
          10
        );

        const startValue =
          value?.weeklySlots?.[index]?.slots?.[slotIndex]?.start;

        if (startValue) {
          const nextSlot = slots.find((slot) => slot.value > startValue);
          if (nextSlot) {
            update(slotIndex, {
              start: startValue,
              end: nextSlot.value,
            });
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, index, slots, replace, update]);

  return (
    <>
      <div
        className={clsx(
          "flex flex-row items-start gap-2 py-4",
          "border-t border-gray-200",
          index === 0 && "border-t-0",
          className
        )}
      >
        <div className="flex-none min-w-28 h-9 flex items-center">
          <div className="items-center flex space-x-2">
            <Checkbox
              disabled={isLoading}
              id={checkboxId}
              checked={(fields?.length ?? 0) > 0}
              onCheckedChange={onCheckboxChange}
            />
            <div className="grid gap-1.5 leading-none">
              <Text asChild variant="h6">
                <label
                  htmlFor={checkboxId}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </label>
              </Text>
            </div>
          </div>
        </div>

        {/*  */}
        {fields.length >= 1 && (
          <>
            <div className="flex-1 flex flex-col gap-2">
              {fields.map((field, fieldIndex) => {
                return (
                  <div key={field.id} className="flex flex-row">
                    <div className="flex-1 flex flex-row items-start gap-4 text-sm font-medium text-gray-700">
                      <FormField
                        control={control}
                        name={`weeklySlots[${index}].slots[${fieldIndex}].start`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                disabled={isLoading}
                                name={field.name}
                                onValueChange={field.onChange}
                                value={field.value?.toString()}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                    placeholder="Select start time"
                                  />
                                </SelectTrigger>

                                <SelectContent>
                                  {slots.slice(0, -1).map((slot) => (
                                    <SelectItem
                                      key={slot.value}
                                      value={slot.value}
                                    >
                                      {slot.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="inline-flex items-center h-9">-</div>
                      <FormField
                        control={control}
                        name={`weeklySlots[${index}].slots[${fieldIndex}].end`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                disabled
                                name={field.name}
                                onValueChange={field.onChange}
                                value={field.value?.toString()}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                    placeholder="Select end time"
                                  />
                                </SelectTrigger>

                                <SelectContent>
                                  {slots.map((slot) => (
                                    <SelectItem
                                      key={slot.value}
                                      value={slot.value}
                                    >
                                      {slot.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      disabled={isLoading}
                      variant="destructive"
                      size="icon"
                      title="Unavailable"
                      onClick={() => remove(fieldIndex)}
                    >
                      <XCircleIcon />
                    </Button>
                  </div>
                );
              })}
            </div>
            {/*  */}

            <div className="flex-none flex flex-row gap-2">
              <Button
                type="button"
                disabled={isLoading}
                variant="outline"
                size="icon"
                title="Copy time to all"
                onClick={onCopyToAll}
              >
                <CopyIcon />
              </Button>
              <Button
                type="button"
                disabled={isLoading}
                size="icon"
                title="Add another period for this day"
                onClick={newItem}
              >
                <PlusCircleIcon />
              </Button>
            </div>
          </>
        )}

        {fields.length === 0 && (
          <div className="flex-none min-w-28 h-9 flex items-center">
            <Text variant="mutedText" className="flex-1">
              Unavailable
            </Text>
          </div>
        )}
      </div>
    </>
  );
};
export default AvailabilityItem;
