import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
    Controller,
    ControllerProps,
    FieldPath,
    FieldValues,
    FormProvider,
    useFormContext,
} from "react-hook-form";

import { cn } from "@/Lib/utils";
import { Label } from "@/Components/ui/label";
import { Input } from "./input";
import {
    PopoverContainer,
    PopoverContent,
    PopoverProvider,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Button } from "./button";
import { Calendar as CalendarIconsax, Eye, EyeSlash } from "iconsax-react";
import { format } from "date-fns";
import { Calendar } from "./calendar";
import { Matcher } from "react-day-picker";
import { getNestedError } from "@/Types/types";
import { Select, SelectContent, SelectTrigger } from "./select";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { AutosizeTextarea } from "./text-area";
import { Checkbox } from "./checkbox";

const Form = FormProvider;

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue
);

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
};

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState, formState } = useFormContext();

    const fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>");
    }

    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
};

type FormItemContextValue = {
    id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
    {} as FormItemContextValue
);

const FormItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const id = React.useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div
                ref={ref}
                className={cn("space-y-1.5", className)}
                {...props}
            />
        </FormItemContext.Provider>
    );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField();

    return (
        <Label
            ref={ref}
            className={cn(error && "text-destructive", className)}
            htmlFor={formItemId}
            {...props}
        />
    );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
    React.ElementRef<typeof Slot>,
    React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
        useFormField();

    return (
        <Slot
            ref={ref}
            id={formItemId}
            aria-describedby={
                !error
                    ? `${formDescriptionId}`
                    : `${formDescriptionId} ${formMessageId}`
            }
            aria-invalid={!!error}
            {...props}
        />
    );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return (
        <p
            ref={ref}
            id={formDescriptionId}
            className={cn("text-[0.8rem] text-muted-foreground", className)}
            {...props}
        />
    );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
        return null;
    }

    return (
        <p
            ref={ref}
            id={formMessageId}
            className={cn(
                "text-[0.8rem] font-medium text-destructive",
                className
            )}
            {...props}
        >
            {body}
        </p>
    );
});
FormMessage.displayName = "FormMessage";

type CustomFormProps = {
    form: any;
    name: string;
    label: string | React.ReactNode;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    labelClass?: string;
};

const FormInput: React.FC<
    CustomFormProps & {
        customInput?: (field: any, inputRef: any) => React.ReactNode;
        inputClass?: string;
        icon?: React.ReactNode;
        disablePasswordToggle?: boolean;
        inputBlockClass?: string;
        itemClass?: string;
        type?: React.HTMLInputTypeAttribute;
        maxLength?: number;
    }
> = ({
    form,
    name,
    label,
    required = true,
    customInput,
    placeholder,
    disabled,
    inputBlockClass,
    itemClass,
    labelClass,
    type = 'text',
    disablePasswordToggle,
    ...props
}) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [inputType, setInputType] = React.useState(type);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field, formState }) => (
                <FormItem className={cn("date", itemClass)}>
                    {label && (
                        <FormLabel
                            children={label}
                            className={cn(required && "required", labelClass)}
                        />
                    )}
                    <div className={cn("relative group", inputBlockClass)}>
                        {props.icon && (
                            <div
                                className={cn(
                                    "absolute size-11 !h-[calc(100%-1.5px)] left-0 top-[1px] flex items-center justify-center border-r [&>*]:opacity-60",
                                    getNestedError(formState.errors, name)
                                        ? "group-focus-within:border-fuchsia-500"
                                        : "border-destructive"
                                )}
                            >
                                {props.icon}
                            </div>
                        )}
                        <FormControl>
                            {customInput ? (
                                customInput(field, inputRef)
                            ) : (
                                <Input
                                    {...field}
                                    ref={(ref) => {
                                        field.ref(ref);
                                        inputRef.current = ref;
                                    }}
                                    type={inputType}
                                    className={cn(
                                        "formInput [&[type=password]]:pr-12",
                                        props.icon && "pl-14",
                                        props.inputClass
                                    )}
                                    placeholder={placeholder}
                                    disabled={disabled}
                                    maxLength={props.maxLength}
                                />
                            )}
                        </FormControl>
                        {type === "password" && !disablePasswordToggle && (
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="size-8 absolute right-1.5 top-1/2 -translate-y-1/2"
                                onClick={() => {
                                    if (inputType == "password")
                                        setInputType("text");
                                    else if (inputType == "text")
                                        setInputType("password");

                                    inputRef.current?.focus();
                                }}
                                disabled={disabled}
                            >
                                <Eye
                                    className="!size-4 transition duration-200 absolute rotate-0 scale-100 data-[type=text]:rotate-90 data-[type=text]:scale-0"
                                    data-type={inputType}
                                />
                                <EyeSlash
                                    className="!size-4 transition duration-200 absolute rotate-90 scale-0 data-[type=text]:rotate-0 data-[type=text]:scale-100"
                                    data-type={inputType}
                                />
                            </Button>
                        )}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
FormInput.displayName = "FormInput";

const FormInputFile: React.FC<
    CustomFormProps & {
        inputClass?: string;
        icon?: React.ReactNode;
        inputBlockClass?: string;
        itemClass?: string;
    }
> = ({
    form,
    name,
    label,
    required = true,
    placeholder,
    disabled,
    inputBlockClass,
    itemClass,
    ...props
}) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field, formState }) => (
                <FormItem className={cn("date", itemClass)}>
                    {label && (
                        <FormLabel
                            children={label}
                            className={cn(required && "required")}
                        />
                    )}
                    <div className={cn("relative group", inputBlockClass)}>
                        {props.icon && (
                            <div
                                className={cn(
                                    "absolute size-11 !h-[calc(100%-1.5px)] left-0 top-[1px] flex items-center justify-center border-r [&>*]:opacity-60",
                                    getNestedError(formState.errors, name)
                                        ? "group-focus-within:border-fuchsia-500"
                                        : "border-destructive"
                                )}
                            >
                                {props.icon}
                            </div>
                        )}
                        <FormControl>
                            <Input
                                type="file"
                                className={cn(
                                    "formInput",
                                    props.icon && "pl-14",
                                    props.inputClass
                                )}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        field.onChange(file);
                                    }
                                }}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                placeholder={placeholder}
                                disabled={disabled}
                            />
                        </FormControl>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
FormInputFile.displayName = "FormInputFile";

type FormSelectProps = Omit<CustomFormProps, "label"> & {
    items: React.ReactNode;
    label?: string;
    triggerClass?: string;
    contentClass?: string;
    displayValue?: string;
    watchDefault?: boolean; // to set the selected item with the default value
    onValueChange?: (value: string) => void;
};

const FormSelect: React.FC<FormSelectProps> = ({
    form,
    name,
    label,
    items,
    disabled,
    required = true,
    placeholder = "Select",
    triggerClass,
    contentClass,
    displayValue,
    watchDefault = false,
    onValueChange,
}) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field, formState }) => (
                <FormItem>
                    <FormLabel
                        children={label}
                        className={cn(required && "required")}
                    />
                    <Select
                        onValueChange={(value) => {
                            field.onChange(value);
                            onValueChange?.(value);
                        }}
                        defaultValue={field.value}
                        className="w-full"
                        watchDefault={watchDefault}
                    >
                        <FormControl>
                            <div className="w-full group">
                                <SelectTrigger
                                    ref={(ref) => field.ref(ref)}
                                    className={cn(
                                        "formSelect bg-background dark:bg-white/5 hover:text-foreground w-full !font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-700",
                                        triggerClass
                                    )}
                                    placeholder={placeholder}
                                    value={
                                        displayValue
                                            ? displayValue
                                            : field.value
                                    }
                                    disabled={disabled}
                                />
                            </div>
                        </FormControl>
                        <SelectContent className={cn("[&]", contentClass)}>
                            {items}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
FormSelect.displayName = "FormSelect";

const FormCalendar: React.FC<
    CustomFormProps & {
        disableDate?: Matcher | Matcher[];
        triggerClass?: string;
        withPresent?: boolean;
        withNA?: boolean;
        onCancel?: () => void;
    }
> = ({
    form,
    name,
    label,
    required = true,
    disableDate,
    triggerClass,
    withPresent,
    withNA,
    onCancel,
    labelClass,
    ...props
}) => {
    const isValidDate = (input: string | Date): boolean => {
        if (typeof input == "string") {
            if (input == "N/A") return false;

            const dateRegex =
                /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
            if (!dateRegex.test(input)) return false;

            const [month, day, year] = input.split("/").map(Number);
            const date = new Date(year, month - 1, day);
            return (
                date.getFullYear() === year &&
                date.getMonth() === month - 1 &&
                date.getDate() === day
            );
        } else {
            return input instanceof Date;
        }
    };

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="">
                    <FormLabel
                        className={cn(required && "required", labelClass)}
                        children={label}
                    />
                    <PopoverProvider>
                        <PopoverContainer>
                            {({ close }) => (
                                <>
                                    <PopoverTrigger
                                        asChild
                                        disabled={props.disabled}
                                    >
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "h-10 w-full justify-between !font-normal !bg-background hover:!bg-background dark:!bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-700",
                                                    "data-[state=open]:border-fuchsia-700 data-[state=open]:ring-1 data-[state=open]:ring-fuchsia-500",
                                                    "aria-[invalid=true]:!ring-destructive aria-[invalid=true]:!border-destructive",
                                                    triggerClass
                                                )}
                                            >
                                                {field.value
                                                    ? withPresent
                                                        ? isValidDate(
                                                              field.value
                                                          )
                                                            ? format(
                                                                  field.value,
                                                                  "MMMM d, y"
                                                              )
                                                            : field.value
                                                        : format(
                                                              field.value,
                                                              "MMMM d, y"
                                                          )
                                                    : "Pick a date"}
                                                <CalendarIconsax />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        id="popover-date"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={
                                                field.value
                                                    ? withPresent
                                                        ? isValidDate(
                                                              field.value
                                                          )
                                                            ? field.value
                                                            : new Date()
                                                        : field.value
                                                    : field.value
                                            }
                                            onSelect={(date) => {
                                                if (date)
                                                    field.onChange(
                                                        new Date(
                                                            format(
                                                                date,
                                                                "yyyy-MM-dd"
                                                            )
                                                        ),
                                                        { shouldValidate: true }
                                                    );
                                                else field.onChange(date);
                                                close && close();
                                            }}
                                            initialFocus
                                            disabled={disableDate}
                                            defaultMonth={
                                                field.value
                                                    ? withPresent
                                                        ? isValidDate(
                                                              field.value
                                                          )
                                                            ? field.value
                                                            : new Date()
                                                        : field.value
                                                    : field.value
                                            }
                                        />
                                        <div className="flex items-center">
                                            <Button
                                                variant={"outline"}
                                                className="h-7 ml-3 mb-3 px-2"
                                                onClick={() => {
                                                    field.onChange(new Date());
                                                    close && close();
                                                }}
                                            >
                                                Today
                                            </Button>
                                            {withPresent && (
                                                <Button
                                                    variant={"outline"}
                                                    className="h-7 ml-2 mb-3 px-2"
                                                    onClick={() => {
                                                        field.onChange(
                                                            "Present"
                                                        );
                                                        close && close();
                                                    }}
                                                >
                                                    Present
                                                </Button>
                                            )}
                                            {withNA && (
                                                <Button
                                                    variant={"outline"}
                                                    className="h-7 ml-2 mb-3 px-2"
                                                    onClick={() => {
                                                        field.onChange("N/A");
                                                        close && close();
                                                    }}
                                                >
                                                    N/A
                                                </Button>
                                            )}
                                            <Button
                                                variant={"outline"}
                                                className="h-7 ml-auto mr-3 mb-3 px-2"
                                                onClick={() => {
                                                    onCancel && onCancel();
                                                    close && close();
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </>
                            )}
                        </PopoverContainer>
                    </PopoverProvider>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
FormCalendar.displayName = "FormCalendar";

const FormRadioItem: React.FC<{ value: string; label: string }> = ({
    value,
    label,
}) => {
    return (
        <FormItem className="flex items-center space-x-3 space-y-0">
            <FormControl>
                <RadioGroupItem value={value} />
            </FormControl>
            <FormLabel className="font-normal">{label}</FormLabel>
        </FormItem>
    );
};
FormRadioItem.displayName = "FormRadioItem";

const FormRadioGroup: React.FC<
    CustomFormProps &
        React.PropsWithChildren & {
            position?: "horizontal" | "vertical";
            labelClass?: string;
            onValueChange?: (value: string) => void;
            className?: string;
        }
> = ({
    form,
    name,
    label,
    position = "horizontal",
    required = true,
    className,
    ...props
}) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel
                        className={cn(props.labelClass, required && "required")}
                    >
                        {label}
                    </FormLabel>
                    <FormControl>
                        <RadioGroup
                            disabled={props.disabled}
                            onValueChange={(value) => {
                                field.onChange(value);
                                props.onValueChange &&
                                    props.onValueChange(value);
                            }}
                            // defaultValue={field.value}
                            value={field.value}
                            className={cn(
                                "flex",
                                position === "horizontal"
                                    ? "flex-row space-x-3"
                                    : "flex-col space-y-1",
                                className
                            )}
                        >
                            {props.children}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
FormRadioGroup.displayName = "FormRadioGroup";

type FormTextAreaProps = CustomFormProps & {
    maxHeight?: number;
    minHeight?: number;
    textAreaClass?: string;
};
const FormTextArea: React.FC<FormTextAreaProps> = ({
    form,
    name,
    label,
    disabled,
    required = true,
    placeholder = "",
    minHeight = 52,
    maxHeight = 100,
    labelClass = "",
    textAreaClass = "",
}) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel
                        className={cn(required && "required", labelClass)}
                    >
                        {label}
                    </FormLabel>
                    <FormControl>
                        <AutosizeTextarea
                            {...field}
                            placeholder={placeholder}
                            disabled={disabled}
                            minHeight={minHeight}
                            maxHeight={maxHeight}
                            className={cn("shadow-sm", textAreaClass)}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
FormTextArea.displayName = "FormTextArea";

type FormCheckBoxPtops = CustomFormProps & {};

const FormCheckBox: React.FC<FormCheckBoxPtops> = ({
    form,
    name,
    label,
    required = true,
    ...props
}) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("flex items-center gap-3", props.labelClass)}>
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <FormLabel className={cn(required && "requried", '!m-0')}>
                        {label}
                    </FormLabel>
                </FormItem>
            )}
        />
    );
};
FormCheckBox.displayName = "FormCheckBox";

export {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
    FormInput,
    FormInputFile,
    FormSelect,
    FormCalendar,
    FormRadioItem,
    FormRadioGroup,
    FormTextArea,
    FormCheckBox,
    type CustomFormProps,
};
