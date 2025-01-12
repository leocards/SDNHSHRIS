import Modal, { ModalProps } from "@/Components/Modal";
import { PDSTABSTYPE } from "@/Types/types";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import PDSPDF from "@/Pages/PDS/PDF/PDSPDF";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";

type Props = ModalProps & {
    userid: number | null;
};

const ViewPdsLogs = ({ userid, show, onClose }: Props) => {
    const [tab, setTab] = useState<PDSTABSTYPE>("C1");
    return (
        <Modal show={show} onClose={onClose} maxWidth="fit">
            <div className="w-full flex">
            <Button variant="outline" size="icon" className="ml-auto" onClick={() => onClose()}>
                <X />
            </Button>
            </div>

            <Tabs
                defaultValue={tab}
                className="overflow-hidden rounded-md grow flex flex-col my-5 mx-auto w-fit"
                onValueChange={(value) => setTab(value as PDSTABSTYPE)}
            >
                <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button_span]:max-w-44 [&>button]:text-left [&>button]:!justify-start [&>button_span]:line-clamp-1 [&>button_span]:!whitespace-normal bg-primary/15 text-primary/60">
                    <TabsTrigger value="C1">C1</TabsTrigger>
                    <TabsTrigger value="C2">C2</TabsTrigger>
                    <TabsTrigger value="C3">C3</TabsTrigger>
                    <TabsTrigger value="C4">C4</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="">
                <PDSPDF tab={tab} userid={userid} />
            </div>
        </Modal>
    );
};

export default ViewPdsLogs;
