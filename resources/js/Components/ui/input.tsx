import * as React from "react";

import { cn } from "@/Lib/utils";

const InputElement = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
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
});

const NumberInput = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input">
>(({ type, ...props }, ref) => {
    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        let strInput = String(e.target.value).trim();

        const strictNumber = "strictnumber" in e.target.dataset

        if((strInput.toLowerCase() === 'n/a' || strInput.toLowerCase() === 'n') && !strictNumber) {
            e.target.value = 'N/A'
        } else {
            strInput = e.target.value.replace(/[^0-9.]/g, ''); // Allow digits and periods
            if ((strInput.match(/\./g) || []).length > 1) {
                e.target.value = strInput.replace(/\.+$/, ''); // Remove extra decimals
            }

            if(props.maxLength) {
                e.target.value = strInput.substring(0, props.maxLength);
            }
        }
    }

    return <InputElement type={"text"} ref={ref} onInput={handleChangeValue} {...props} />;
});

const CurrencyInput = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input">
>(({ ...props }, ref) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;

        // Remove any non-numeric characters except the period (.)
        inputValue = inputValue.replace(/[^0-9.]/g, "");

        // Handle cases where the user types multiple periods
        const periodCount = (inputValue.match(/\./g) || []).length;
        if (periodCount > 1) {
            inputValue = inputValue.substring(0, inputValue.lastIndexOf("."));
        }

        // Split into integer and decimal parts
        const parts = inputValue.split(".");
        let integerPart = parts[0];
        let decimalPart = parts[1] ?? "";

        // Add commas to the integer part
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Reassemble the value
        let formattedValue = integerPart;
        if (inputValue.includes(".") && decimalPart === "") {
            formattedValue += "."; // Preserve the trailing dot
        } else if (decimalPart) {
            formattedValue += `.${decimalPart}`;
        }

        e.target.value = formattedValue;
    };


    return <InputElement ref={ref} onInput={handleInputChange} {...props} />;
});

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ type = "text", ...props }, ref) => {
        return type === "number" ? (
            <NumberInput type={type} ref={ref} {...props} />
        ) : type === "currency" ? (
            <CurrencyInput ref={ref} {...props} />
        ) : (
            <InputElement type={type} ref={ref} {...props} />
        );
    }
);
Input.displayName = "Input";

export { Input };
