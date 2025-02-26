import PDSPDF from "@/Pages/PDS/PDF/PDSPDF";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { useState } from "react";
import { PDSTABSTYPE } from "@/Types/types";
import { useSidebar } from "@/Components/ui/sidebar";
import useWindowSize from "@/Hooks/useWindowResize";
import { cn } from "@/Lib/utils";

type Props = {
    userId: number;
};

const PersonnelPDS: React.FC<Props> = ({ userId }) => {
    const [tabs, setTabs] = useState<PDSTABSTYPE>("C1");
    const { state } = useSidebar();
    const { width } = useWindowSize();

    return (
        <TabsContent value="pds" className="max-sm:w-full sm:mx-auto">
            <Tabs
                defaultValue={tabs}
                className="overflow-hidden rounded-md grow flex flex-col my-4 mb-2 sm:mx-auto w-fit"
                onValueChange={(value) => setTabs(value as PDSTABSTYPE)}
            >
                <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button_span]:max-w-44 [&>button]:text-left [&>button]:!justify-start [&>button_span]:line-clamp-1 [&>button_span]:!whitespace-normal bg-primary/15 text-primary/60">
                    <TabsTrigger value="C1">C1</TabsTrigger>
                    <TabsTrigger value="C2">C2</TabsTrigger>
                    <TabsTrigger value="C3">C3</TabsTrigger>
                    <TabsTrigger value="C4">C4</TabsTrigger>
                </TabsList>
            </Tabs>

            <div
                className={cn(
                    "overflow-x-auto min-h-[8.11in] border border-border rounded-lg",
                    width > 630 &&
                        "data-[sidebarstate=expanded]:[@media(max-width:1162px)]:max-w-2xl data-[sidebarstate=expanded]:[@media(max-width:810px)]:max-w-xl",
                    width > 630 &&
                        "data-[sidebarstate=collapsed]:[@media(max-width:1020px)]:max-w-2xl data-[sidebarstate=collapsed]:[@media(max-width:810px)]:max-w-xl",
                    width <= 630 && "max-w-[91vw]",
                    width <= 500 && "max-w-[91vw]",
                    width <= 490 && "max-w-[85vw]"
                )}
                data-sidebarstate={state}
            >
                <PDSPDF userid={userId} tab={tabs} />
            </div>
        </TabsContent>
    );
};

export default PersonnelPDS;
