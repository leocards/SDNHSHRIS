import {
    FilterButton,
    FilterItem,
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarTrigger,
    SortButton,
    SortItem,
} from "@/Components/ui/menubar";
import SearchInput from "@/Components/SearchInput";
import { Add } from "iconsax-react";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { usePagination } from "@/Components/Provider/paginate-provider";
import { ClassAssumptionDetails, CLASSASSUMPTIONTYPE } from "./type";
import { APPROVALTYPE } from "@/Types";
import { cn } from "@/Lib/utils";

type ActionHeaderProps = {
    status: APPROVALTYPE
    onAdd: (type: "business"|"sick") => void;
}

const ActionHeader: React.FC<ActionHeaderProps> = ({ status, onAdd }) => {
    const { page, onQuery } = usePagination<CLASSASSUMPTIONTYPE>();
    const { url } = usePage();

    const [filter, setFilter] = useState("");
    const [{ sort, order }, setSortOrder] = useState<{
        sort?: any;
        order: "asc" | "desc";
    }>({
        sort: "date",
        order: "desc",
    });
    return (
        <div className={cn("flex max-sm:gap-4 mb-4", url.startsWith("/myapproval") && "max-sm:flex-col")}>
            <div className="flex gap-4">
                <FilterButton
                    isDirty={!!filter}
                    contentClass="max-w-72"
                    onClearFilter={() => {
                        setFilter("")
                        onQuery({
                            status,
                            filter: "",
                            sort,
                            order,
                        });
                    }}
                >
                    <MenubarLabel>Class Assumption for Sick Leave</MenubarLabel>
                    {ClassAssumptionDetails.sick.map((casl, index) => (
                        <FilterItem
                            key={index}
                            value={casl.type == 'others' ? 'slothers' : casl.type}
                            activeFilter={filter}
                            onClick={(value) => {
                                setFilter(value);
                                onQuery({
                                    status,
                                    filter: value,
                                    sort,
                                    order,
                                });
                            }}
                        >
                            {casl.type == 'others' ? 'Others' : casl.label}
                        </FilterItem>
                    ))}
                    <MenubarLabel>Class Assumption for Official Business</MenubarLabel>
                    {ClassAssumptionDetails.business.map((caob, index) => (
                        <FilterItem
                            key={index}
                            value={caob.type == 'others' ? 'obothers' : caob.type}
                            activeFilter={filter}
                            onClick={(value) => {
                                setFilter(value);
                                onQuery({
                                    status,
                                    filter: value,
                                    sort,
                                    order,
                                });
                            }}
                        >
                            {caob.type == 'others' ? 'Others' : caob.label}
                        </FilterItem>
                    ))}
                </FilterButton>
                <SortButton
                    order={order}
                    onOrderChange={(value) => {
                        setSortOrder({ sort, order: value });
                        onQuery({ status, filter, sort, order: value });
                    }}
                >
                    <MenubarLabel>Sort by</MenubarLabel>
                    <SortItem
                        value="name"
                        activeSort={sort}
                        onClick={(value) => {
                            setSortOrder({ sort: value, order });
                            onQuery({ status, filter, sort: value, order });
                        }}
                        children="Name"
                    />
                    <SortItem
                        value="date"
                        activeSort={sort}
                        onClick={(value) => {
                            setSortOrder({ sort: value, order });
                            onQuery({ status, filter, sort: value, order });
                        }}
                        children="Date created"
                    />
                </SortButton>
            </div>

            {url.startsWith("/myapproval") ? (
                <div className="ml-auto relative sm:max-w-64 lg:max-w-96 w-full">
                    <SearchInput
                        placeholder="Search name"
                        onSearch={
                            (search) =>
                            onQuery({ status, filter, sort, order, search })
                        }
                    />
                </div>
            ) : (
                <Menubar className="ml-auto">
                    <MenubarMenu>
                        <MenubarTrigger
                            variant={"default"}
                            className="data-[state=open]:bg-primary data-[state=open]:text-primary-foreground"
                        >
                            <Add /> <span className="max-sm:hidden">Apply</span>
                        </MenubarTrigger>
                        <MenubarContent align="end">
                            <MenubarItem onClick={() => onAdd('sick')}>
                                <Add /> For Sick Leave
                            </MenubarItem>
                            <MenubarItem onClick={() => onAdd('business')}>
                                <Add /> For Official Business
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            )}
        </div>
    );
};

export default ActionHeader;
