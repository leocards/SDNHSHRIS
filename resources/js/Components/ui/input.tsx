import * as React from "react";

import { cn } from "@/Lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    `w-full rounded-md border border-border focus:border-fuchsia-700 px-3 bg-background dark:bg-white/5 py-1 text-base shadow-sm transition-colors
                    file:border-0 file:pt-[5px] file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none
                    focus-visible:ring-1 focus-visible:ring-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [[type="file"]&[aria-invalid="true"]]:focus:outline-destructive [&[type="file"]]:focus:outline-primary`,
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

/* const NumberInput = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input"> & {
        allowSpecialValues?: string[]; // List of special allowed string values
        formatAsCurrency?: boolean; // Whether to format the input as a currency
    }
>(
    (
        {
            className,
            allowSpecialValues = ["N/A", "n/a"],
            formatAsCurrency = true,
            onChange,
            ...props
        },
        ref
    ) => {
        const formatCurrency = (value: string) => {
            if (isNaN(Number(value))) return value; // Don't format special values
            return Number(value).toLocaleString(); // Format as currency-like string
        };

        const unformatCurrency = (value: string) => {
            return value.replace(/,/g, ""); // Remove commas to extract the raw number
        };

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            let { value } = event.target;

            // If currency formatting is enabled, unformat the value first
            if (formatAsCurrency) {
              value = unformatCurrency(value);
            }

            // Allow only valid numeric values with decimals or specified special strings
            if (/^\d*\.?\d*$/.test(value) || allowSpecialValues.includes(value)) {
              onChange?.({
                ...event,
                target: { ...event.target, value }, // Pass raw unformatted value to the parent
              });
            } else {
              event.preventDefault(); // Prevent invalid input
            }
          };

        const handleKeyPress = (
            event: React.KeyboardEvent<HTMLInputElement>
        ) => {
            const { key, currentTarget } = event;
            const rawValue = unformatCurrency(currentTarget.value + key);

            // Allow Backspace, Delete, Arrow keys, or special values
            if (
                !/[\d\b]/.test(key) && // Block non-numeric keys
                !allowSpecialValues.some((val) => val.startsWith(rawValue)) // Check against special strings
            ) {
                event.preventDefault();
            }
        };

        return (
            <Input
                className={cn(className)}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                ref={ref}
                {...props}
            />
        );
    }
); */

export { Input };
