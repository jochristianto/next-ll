import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const DESCRIPTION_DEFAULT_TAG = "p";

const textVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-bold tracking-tight lg:text-4xl",
      h2: "scroll-m-20 pb-2 text-3xl font-bold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-bold tracking-tight",
      h4: "scroll-m-20 text-xl font-bold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      h6: "scroll-m-20 text-base font-semibold tracking-tight",
      p: "leading-7",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      ul: "my-6 ml-6 list-disc [&>li]:mt-2",
      inlineCode:
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      largeText: "text-lg font-semibold",
      smallText: "text-sm leading-snug",
      tinyText: "text-xs leading-snug",
      xxsText: "text-xxs leading-snug",
      mutedText: "text-sm text-muted-foreground",
      body: "text-base font-normal",
    },
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  asChild?: boolean;
  as?: string;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      className,
      variant,
      asChild = false,
      as = DESCRIPTION_DEFAULT_TAG,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : as;
    return (
      <Comp
        className={cn(textVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Text.displayName = "Text";

export { Text, textVariants };
