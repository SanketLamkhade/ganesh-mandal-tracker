import Image from "next/image";

const sizeStyles = {
  sm: "h-14 w-14 border-2",
  md: "h-16 w-16 border-2 shadow-lg ring-2 ring-saffron/30",
  lg: "h-48 w-48 border-4 shadow-2xl ring-4 ring-saffron/30 sm:h-56 sm:w-56",
} as const;

interface MandalAvatarProps {
  size?: keyof typeof sizeStyles;
  priority?: boolean;
  className?: string;
}

export default function MandalAvatar({
  size = "sm",
  priority = false,
  className = "",
}: MandalAvatarProps) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border-gold ${sizeStyles[size]} ${className}`}
    >
      <Image
        src="/Ganpati_bg.png"
        alt="Ganpati"
        fill
        className="object-cover"
        priority={priority}
        sizes={
          size === "lg"
            ? "(max-width: 640px) 192px, 224px"
            : size === "md"
              ? "64px"
              : "56px"
        }
      />
    </div>
  );
}
