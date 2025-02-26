import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/Components/ui/menubar";
import { Tooltip, TooltipLabel } from "@/Components/ui/tooltip";
import { ChevronDown, Edit } from "lucide-react";
import { Add } from "iconsax-react";
import CreateSchoolYear from "./CreateSchoolYear";
import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

const SchoolYear = ({ create, edit, onSelectMenu }:{
    create: boolean;
    edit: boolean;
    onSelectMenu: (value: "create"|"edit"|"close") => void
}) => {
    const { schoolyear } = usePage().props;

    return (
        <div>
            <Menubar className="size-fit shadow-none">
                <MenubarMenu>
                    <TooltipLabel label="School Year">
                        <span>
                        <MenubarTrigger className="!h-10">
                            <span className="max-sm:hidden">{schoolyear?"SY "+schoolyear.schoolyear:"Add School Year"}</span>
                            <ChevronDown className="!size-3.5" />
                        </MenubarTrigger>
                        </span>
                    </TooltipLabel>
                    <MenubarContent
                        align="end"
                        alignOffset={0}
                        className="min-w-[10.5rem]"
                    >
                        <MenubarItem className="space-x-2" onClick={() => onSelectMenu("create")}>
                            <Add />
                            <div>New School Year</div>
                        </MenubarItem>
                        <MenubarItem className="space-x-2" onClick={() => onSelectMenu("edit")}>
                            <Edit />
                            <div>Edit School Year</div>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>

            <CreateSchoolYear onClose={() => onSelectMenu("close")} show={create || edit} edit={edit} />
        </div>
    );
};

export default SchoolYear;
