import {
    createContext,
    forwardRef,
    PropsWithChildren,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "./menubar";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/Lib/utils";
import useWindowSize, { useElementResize } from "@/Hooks/useWindowResize";

type SelectState = {
    selectWidth: number;

    selectedValue?: string;
    setSelectedValue: (value: string) => void;
};

const SelectContext = createContext<SelectState>({
    selectWidth: 0,

    selectedValue: undefined,
    setSelectedValue: () => null,
});

const useSelectOption = () => {
    const context = useContext(SelectContext);

    if (!context) {
        throw new Error(
            "The useSelectOption must be used within a SelectProvider"
        );
    }

    return context;
};

const Select: React.FC<
    PropsWithChildren & {
        onValueChange: (value: string) => void;
        defaultValue?: string;
        watchDefault?: boolean;
        className?: string;
    }
> = ({ children, className, defaultValue, watchDefault, onValueChange }) => {
    const selectRef = useRef<HTMLDivElement>(null);
    const [selectWidth, setSelectWidth] = useState(0);
    const [selectedValue, setSelectedValue] = useState<string | undefined>(
        defaultValue
    );
    const { width } = useWindowSize()

    useEffect(() => {
        if (selectRef.current) {
            setSelectWidth(selectRef.current.offsetWidth);
        }
    }, [selectRef.current, width]);

    useEffect(() => {
        if (selectedValue) {
            onValueChange(selectedValue);
        }
    }, [selectedValue]);

    useEffect(() => {
        if (watchDefault) {
            setSelectedValue(defaultValue);
        }
    }, [defaultValue]);

    return (
        <SelectContext.Provider
            value={{
                selectWidth: selectWidth,
                selectedValue: selectedValue,
                setSelectedValue: setSelectedValue,
            }}
        >
            <Menubar ref={selectRef} className={cn("w-fit h-fit shadow-none", className)}>
                <MenubarMenu>{children}</MenubarMenu>
            </Menubar>
        </SelectContext.Provider>
    );
};

const SelectTrigger = forwardRef<
    HTMLElement,
    {
        className?: string;
        placeholder?: string;
        value: string | null | React.ReactNode;
        disabled?: boolean;
        invalid?: boolean;
    }
>(({ className, placeholder, value, disabled }, ref) => {
    return (
        <MenubarTrigger
            disabled={disabled}
            className={cn(
                "group justify-between min-w-32 data-[state=open]:bg-background focus:bg-background hover:!bg-background dark:hover:!bg-white/5 ",
                "disabled:opacity-100 disabled:text-muted-foreground/80",
                className
            )}
        >
            {value ? value : placeholder}
            <ChevronDown className="size-4 ml-1 group-data-[open]:rotate-180 duration-200 transition" />
        </MenubarTrigger>
    );
});

const SelectContent: React.FC<
    PropsWithChildren & {
        className?: string;
    }
> = ({ className, children }) => {
    const { selectWidth } = useSelectOption();

    return (
        <MenubarContent
            alignOffset={0}
            className={cn("-mt-1 min-w-32 pr-0 overflow-hidden w-full", className)}
            style={{ width: selectWidth }}
        >
            <div className="pr-1 max-h-72 overflow-y-auto">{children}</div>
        </MenubarContent>
    );
};

const SelectItem: React.FC<
    PropsWithChildren & {
        className?: string;
        value: string;
        onClick?: CallableFunction;
        disabled?: boolean;
    }
> = ({ className, value, children, disabled, onClick }) => {
    const { selectedValue, setSelectedValue } = useSelectOption();
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the selected item when it's mounted
        if (selectedValue === value && itemRef.current) {
            itemRef.current.scrollIntoView({
                block: "nearest",
                inline: "nearest",
            });
        }
    }, [selectedValue]);

    return (
        <MenubarItem
            ref={itemRef}
            className={cn(
                "",
                selectedValue == value && "text-primary",
                className
            )}
            onClick={() => {
                setSelectedValue(value)
                if(onClick) onClick()
            }}
            disabled={disabled}
        >
            <span className="line-clamp-1">{children}</span>
            {selectedValue == value && <Check className="size-4 ml-auto" />}
        </MenubarItem>
    );
};

export { Select, SelectTrigger, SelectContent, SelectItem };
