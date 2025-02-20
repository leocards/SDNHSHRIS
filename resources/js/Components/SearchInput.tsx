import { useDebouncedFunction } from "@/Hooks/useDebounce";
import React, { ChangeEvent, useRef, useState } from "react";
import { Input } from "./ui/input";
import { SearchNormal1 } from "iconsax-react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

type Props = {
    onSearch: (search: string) => void;
    placeholder?: string;
};

const SearchInput = ({ placeholder = "Search", onSearch }: Props) => {
    const [search, setSearch] = useState("");
    const searchRef = useRef<HTMLInputElement | null>(null);

    const debouncedSearch = useDebouncedFunction((value: string) => {
        onSearch(value);
    }, 700);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.replace(/\s+/g, " ");

        setSearch(input);

        debouncedSearch(input);
    };

    const clearSearch = () => {
        searchRef.current && searchRef.current.focus();
        setSearch("");
        debouncedSearch("");
    };
    return (
        <div className="ml-auto relative max-w-96 w-full">
            <Input
                className="w-full px-10 pl-9 formInput h-9"
                value={search}
                placeholder={placeholder}
                ref={searchRef}
                onChange={onChange}
            />
            <SearchNormal1 className="size-4 absolute top-1/2 -translate-y-1/2 left-2.5 opacity-45" />
            {search !== "" && (
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-1/2 -translate-y-1/2 right-1 size-7"
                    onClick={clearSearch}
                >
                    <X className="size-5" />
                </Button>
            )}
        </div>
    );
};

export default SearchInput;
