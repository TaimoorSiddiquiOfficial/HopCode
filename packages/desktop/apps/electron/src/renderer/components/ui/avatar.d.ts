import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
declare function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>): React.JSX.Element;
declare function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>): React.JSX.Element;
declare function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>): React.JSX.Element;
/**
 * CrossfadeAvatar - Avatar with smooth crossfade from fallback to image
 *
 * Shows the fallback initially, then crossfades to the image when loaded.
 * Both elements are layered so the transition is smooth.
 */
interface CrossfadeAvatarProps {
    src?: string | null;
    alt?: string;
    fallback: React.ReactNode;
    className?: string;
    fallbackClassName?: string;
    imageClassName?: string;
}
declare function CrossfadeAvatar({ src, alt, fallback, className, fallbackClassName, imageClassName, }: CrossfadeAvatarProps): React.JSX.Element;
export { Avatar, AvatarImage, AvatarFallback, CrossfadeAvatar };
