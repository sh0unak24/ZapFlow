"use client"

type SpinnerLoaderProps = {
  size?: string        // Tailwind size: "w-6 h-6"
  color?: string       // Hex color
  borderWidth?: number
  className?: string
}

export const SpinnerLoader = ({
  size = "w-10 h-10",
  color = "#FF5100",
  borderWidth = 4,
  className = "",
}: SpinnerLoaderProps) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block rounded-full animate-spin ${size} ${className}`}
      style={{
        borderWidth,
        borderStyle: "solid",
        borderColor: `${color}20`,
        borderTopColor: color,
        boxSizing: "border-box",
      }}
    />
  )
}