// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/Components/ui/popover";
// import { Button } from "@/Components/ui/button";
// import { Check, ChevronsUpDown } from "lucide-react";
// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
// } from "@/Components/ui/command";
// import {
//     createContext,
//     PropsWithChildren,
//     useContext,
//     useEffect,
//     useRef,
//     useState,
// } from "react";
// import { cn } from "@/Lib/utils";
// import { ProfilePhoto } from "@/Components/ui/avatar";

// type ComboboxState<T> = {
//     open: boolean;
//     setOpen: (open: false) => void;

//     selected: T;
//     setSelected: (selected: T) => void;

//     contentWidth: number;
//     setContentWidth: (width: number) => void;
// };

// const ComboboxContext = createContext<ComboboxState<any>>({
//     open: false,
//     setOpen: () => {},

//     selected: undefined,
//     setSelected: () => {},

//     contentWidth: 0,
//     setContentWidth: () => {},
// });

// const useCombobox = () => {
//     const context = useContext(ComboboxContext);

//     if (!context) {
//         throw new Error("useCombobox must be used within a Combobox");
//     }

//     return context;
// };

// type ComboboxProps<T> = PropsWithChildren & {
//     onValueChange: (value: T) => void;
// };
// export const Combobox = <T,>({
//     children,
//     onValueChange,
// }: ComboboxProps<T>) => {
//     const [open, setOpen] = useState(false);
//     const [selected, setSelected] = useState<T>();
//     const [contentWidth, setContentWidth] = useState(0);

//     const value = {
//         open,
//         setOpen,
//         selected,
//         setSelected,
//         contentWidth,
//         setContentWidth,
//     };

//     useEffect(() => {
//         onValueChange(selected!);
//     }, [selected]);

//     return (
//         <ComboboxContext.Provider value={value}>
//             <Popover open={open} onOpenChange={setOpen}>
//                 {children}
//             </Popover>
//         </ComboboxContext.Provider>
//     );
// };

// export const ComboboxTrigger: React.FC<{
//     label?: string;
//     children?: (value: string) => React.ReactNode;
// }> = ({ children }) => {
//     const { open, selected, setContentWidth } = useCombobox();
//     const buttonRef = useRef<HTMLButtonElement | null>(null);

//     useEffect(() => {
//         if (buttonRef.current) setContentWidth(buttonRef.current.offsetWidth);
//     }, [buttonRef.current]);

//     return (
//         <PopoverTrigger asChild>
//             <Button
//                 variant="outline"
//                 role="combobox"
//                 className="w-full justify-between h-10"
//                 aria-expanded={open}
//                 ref={buttonRef}
//             >
//                 {children
//                     ? children(selected)
//                     : selected
//                     ? selected
//                     : "Select personnel"}
//                 <ChevronsUpDown className="opacity-50" />
//             </Button>
//         </PopoverTrigger>
//     );
// };

// type ComboboxContentProps = PropsWithChildren & {
//     emptyLabel?: string;
//     placeholder?: string;
// };
// export const ComboboxContent: React.FC<ComboboxContentProps> = ({
//     children,
//     placeholder = "Search",
//     emptyLabel = "Nothing found.",
// }) => {
//     const { contentWidth } = useCombobox();

//     return (
//         <PopoverContent className="p-1" style={{ width: contentWidth }}>
//             <Command className="max-h-72">
//                 <CommandInput placeholder={placeholder} className="pl-0" />
//                 <CommandList>
//                     <CommandEmpty>{emptyLabel}</CommandEmpty>
//                     <CommandGroup>{children}</CommandGroup>
//                 </CommandList>
//             </Command>
//         </PopoverContent>
//     );
// };

// type ComboboxItemProps = PropsWithChildren & {
//     value: string;
// };
// export const ComboboxItem: React.FC<ComboboxItemProps> = ({
//     children,
//     value,
// }) => {
//     const { selected, setSelected, setOpen } = useCombobox();

//     return (
//         <CommandItem
//             key={value}
//             value={value}
//             onSelect={() => {
//                 setSelected(currentValue === selected ? "" : currentValue);
//                 setOpen(false);
//             }}
//         >
//             {children}
//             <Check
//                 className={cn(
//                     "ml-auto",
//                     selected === value ? "opacity-100" : "opacity-0"
//                 )}
//             />
//         </CommandItem>
//     );
// };
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Button } from "@/Components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { cn } from "@/Lib/utils";

type ComboboxState<T> = {
    open: boolean;
    setOpen: (open: boolean) => void;

    selected: T | undefined;
    setSelected: (selected: T) => void;

    contentWidth: number;
    setContentWidth: (width: number) => void;
};

// Create the context with a generic type
const ComboboxContext = createContext<ComboboxState<any> | undefined>(
    undefined
);

const useCombobox = <T,>() => {
    const context = useContext(ComboboxContext) as ComboboxState<T>;
    if (!context) {
        throw new Error("useCombobox must be used within a Combobox");
    }
    return context;
};

type ComboboxProps<T> = PropsWithChildren & {
    onValueChange: (value: T | undefined) => void;
};

export const Combobox = <T,>({
    children,
    onValueChange,
}: ComboboxProps<T>) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<T | undefined>(undefined);
    const [contentWidth, setContentWidth] = useState(0);

    const value: ComboboxState<T> = {
        open,
        setOpen,
        selected,
        setSelected,
        contentWidth,
        setContentWidth,
    };

    useEffect(() => {
        if(selected)
            onValueChange(selected);
    }, [selected]);

    return (
        <ComboboxContext.Provider value={value}>
            <Popover open={open} onOpenChange={setOpen}>
                {children}
            </Popover>
        </ComboboxContext.Provider>
    );
};

export const ComboboxTrigger = ({ children, className, disabled }:{ children: React.ReactNode | string, className?: string, disabled: boolean}) => {
    const { open, setContentWidth } = useCombobox<any>();
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (buttonRef.current) setContentWidth(buttonRef.current.offsetWidth);
    }, [buttonRef.current]);

    return (
        <PopoverTrigger asChild>
            <Button
                variant="outline"
                role="combobox"
                className={cn("w-full justify-between h-10 disabled:opacity-100 disabled:!text-foreground/40", className)}
                aria-expanded={open}
                ref={buttonRef}
                disabled={disabled}
            >
                {children}
                <ChevronsUpDown className="opacity-50" />
            </Button>
        </PopoverTrigger>
    );
};

type ComboboxContentProps = PropsWithChildren & {
    emptyLabel?: string;
    placeholder?: string;
    loading?: boolean;
};
export const ComboboxContent: React.FC<ComboboxContentProps> = ({
    children,
    placeholder = "Search",
    emptyLabel = "Nothing found.",
    loading
}) => {
    const { contentWidth } = useCombobox();

    return (
        <PopoverContent className="p-1" style={{ width: contentWidth }}>
            <Command className="max-h-72">
                <CommandInput placeholder={placeholder} className="pl-0" />
                <CommandList>
                    {!loading && <CommandEmpty>{emptyLabel}</CommandEmpty>}
                    <CommandGroup>{children}</CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    );
};

type ComboboxItemProps<T> = PropsWithChildren & {
    value: string;
    key: string;
    stateValue: T;
    isSelected: boolean;
    disabled?: boolean;
};
export const ComboboxItem = <T,>({
    children,
    value,
    stateValue,
    isSelected,
    disabled
}: ComboboxItemProps<T>) => {
    const { setSelected, setOpen } = useCombobox<T>();

    return (
        <CommandItem
            key={String(value)} // Ensure key is a string
            value={String(value)} // CommandItem requires a string value
            onSelect={() => {
                setSelected(stateValue);
                setOpen(false);
            }}
            className={cn(isSelected && "bg-accent text-primary")}
            disabled={disabled}
        >
            {children}
            <Check
                className={cn(
                    "ml-auto",
                    isSelected ? "opacity-100" : "opacity-0"
                )}
            />
        </CommandItem>
    );
};
