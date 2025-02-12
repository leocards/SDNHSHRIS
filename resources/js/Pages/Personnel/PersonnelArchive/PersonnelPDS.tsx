import PDSPDF from "@/Pages/PDS/PDF/PDSPDF";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { useState } from "react";
import { PDSTABSTYPE } from "@/Types/types";

type Props = {
    userId: number;
};

const PersonnelPDS: React.FC<Props> = ({ userId }) => {
    const [tabs, setTabs] = useState<PDSTABSTYPE>('C1')

    return (
        <TabsContent value="pds" className="mx-auto">
            <Tabs
                defaultValue={tabs}
                className="overflow-hidden rounded-md grow flex flex-col my-4 mb-2 mx-auto w-fit"
                onValueChange={(value) => setTabs(value as PDSTABSTYPE)}
            >
                <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button_span]:max-w-44 [&>button]:text-left [&>button]:!justify-start [&>button_span]:line-clamp-1 [&>button_span]:!whitespace-normal bg-primary/15 text-primary/60">
                    <TabsTrigger value="C1">C1</TabsTrigger>
                    <TabsTrigger value="C2">C2</TabsTrigger>
                    <TabsTrigger value="C3">C3</TabsTrigger>
                    <TabsTrigger value="C4">C4</TabsTrigger>
                </TabsList>
            </Tabs>

            <PDSPDF userid={userId} tab={tabs} />
        </TabsContent>
    );
};

export default PersonnelPDS;
