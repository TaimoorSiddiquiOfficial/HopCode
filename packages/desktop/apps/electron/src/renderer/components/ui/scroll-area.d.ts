import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
interface ScrollAreaProps extends React.ComponentProps<typeof ScrollAreaPrimitive.Root> {
    /** Ref to the scrollable viewport element */
    viewportRef?: React.RefObject<HTMLDivElement>;
}
declare function ScrollArea({ className, children, viewportRef, ...props }: ScrollAreaProps): React.JSX.Element;
declare function ScrollBar({ className, orientation, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>): React.JSX.Element;
export { ScrollArea, ScrollBar };
