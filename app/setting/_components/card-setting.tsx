"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSettingContext from "@/hooks/use-setting";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type CardSettingProps = { className?: string };

export type SettingGeneral = z.infer<typeof FormSchema>;

const FormSchema = z.object({
  duration: z.coerce.number().int().positive(),
  bookingLimit: z.coerce.number().int().positive(),
  videoTour: z.boolean().optional(),
});

const durations = [15, 30, 45, 60];

const CardSetting: FC<CardSettingProps> = ({ className }) => {
  const {
    duration,
    bookingLimit,
    videoTour,
    setDuration,
    setBookingLimit,
    setVideoTour,
  } = useSettingContext();

  const form = useForm<SettingGeneral>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      duration,
      bookingLimit,
      videoTour,
    },
  });

  const [showDialog, setShowDialog] = useState(false);

  function onSubmit(data: SettingGeneral, event?: React.BaseSyntheticEvent) {
    event?.preventDefault();
    setShowDialog(true);
  }

  function onSubmitConfirmed() {
    if (duration !== form.getValues("duration"))
      setDuration(form.getValues("duration"));
    if (bookingLimit !== form.getValues("bookingLimit"))
      setBookingLimit(form.getValues("bookingLimit"));
    if (videoTour !== form.getValues("videoTour"))
      setVideoTour(form.getValues("videoTour") ?? false);

    toast({
      title: "Setting updated",
      description: "Your setting has been updated successfully",
    });

    setShowDialog(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <Card>
          <CardHeader>
            <CardTitle>General Setting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visit Duration</FormLabel>
                  <FormControl>
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          onBlur={field.onBlur}
                          ref={field.ref}
                          placeholder="Select a duration"
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {durations.map((value) => (
                          <SelectItem key={value} value={`${value}`}>
                            {value} mins
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookingLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. of Booking / Session</FormLabel>
                  <FormControl>
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          onBlur={field.onBlur}
                          ref={field.ref}
                          placeholder="Select number"
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {[1, 2, 3].map((value) => (
                          <SelectItem key={value} value={`${value}`}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videoTour"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Allow video tour call
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit</Button>

            <AlertDialog open={showDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will remove your existing appointment slots.
                    This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setShowDialog(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction asChild onClick={onSubmitConfirmed}>
                    <Button type="button" variant="destructive">
                      Yes, I&apos;m sure
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CardSetting;
