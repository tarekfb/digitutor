import { type VariantProps, tv } from "tailwind-variants";
import type { Button as ButtonPrimitive } from "bits-ui";
import Root from "./button.svelte";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary text-background md:hover:bg-third",
      secondary: "bg-secondary text-background md:hover:bg-primary",
      "secondary-third": "bg-secondary text-background md:hover:bg-third",
      third: "bg-third text-background md:hover:bg-accent",
      "third-secondary": "bg-third text-background md:hover:bg-secondary",
      accent: "bg-accent text-background md:hover:bg-primary",
      "accent-third": "bg-accent text-background md:hover:bg-third",
      destructive:
        "bg-destructive text-destructive-foreground md:hover:bg-destructive/90",
      outline:
        "border-secondary bg-background hover:bg-primary md:hover:text-background border",
      "outline-card":
        "border-secondary bg-card hover:bg-primary md:hover:text-background border",
      ghost: "md:hover:bg-third md:hover:text-background",
      "ghost-none": "md:hover:text-third",
      link: "text-primary underline-offset-4 md:hover:underline",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type Variant = VariantProps<typeof buttonVariants>["variant"];
type Size = VariantProps<typeof buttonVariants>["size"];

type Props = ButtonPrimitive.Props & {
  variant?: Variant;
  size?: Size;
};

type Events = ButtonPrimitive.Events;

export {
  Root,
  type Props,
  type Events,
  //
  Root as Button,
  type Props as ButtonProps,
  type Events as ButtonEvents,
  buttonVariants,
};
