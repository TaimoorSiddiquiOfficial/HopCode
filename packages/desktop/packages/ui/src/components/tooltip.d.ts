import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
declare function TooltipProvider({ delayDuration, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>): React.JSX.Element;
declare const Tooltip: React.FC<TooltipPrimitive.TooltipProps>;
declare const TooltipTrigger: React.ForwardRefExoticComponent<TooltipPrimitive.TooltipTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare function TooltipContent({ className, sideOffset, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>): React.JSX.Element;
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
