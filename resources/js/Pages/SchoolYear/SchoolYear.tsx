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

const SchoolYear = () => {
    const { schoolyear } = usePage().props;
    const [show, setShow] = useState(!schoolyear?true:false);
    const [edit, setEdit] = useState(false);

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
                        <MenubarItem className="space-x-2" onClick={() => setShow(true)}>
                            <Add />
                            <div>New School Year</div>
                        </MenubarItem>
                        <MenubarItem className="space-x-2" onClick={() => {
                            setShow(true)
                            setEdit(true)
                        }}>
                            <Edit />
                            <div>Edit School Year</div>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>

            <CreateSchoolYear onClose={(close: boolean) => {
                setShow(close)
                setTimeout(() => setEdit(close), 500)
            }} show={show} edit={edit} />
        </div>
    );
};

export default SchoolYear;
