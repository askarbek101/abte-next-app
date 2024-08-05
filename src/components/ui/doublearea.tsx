import * as React from "react"
import { cn } from "@/lib/utils"

export interface DoubleAreaProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  text?: string
}

const DoubleArea = React.forwardRef<HTMLInputElement, DoubleAreaProps>(
  ({ className, text, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.valueAsNumber
      if (onChange) {
        // @ts-ignore
        onChange({ ...e, target: { ...e.target, value } })
      }
    }

    return (
      <div className="flex items-center space-x-2">
        <input
          type="number"
          step="0.01"
          className={cn(
            "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    )
  }
)
DoubleArea.displayName = "DoubleArea"

export { DoubleArea }
