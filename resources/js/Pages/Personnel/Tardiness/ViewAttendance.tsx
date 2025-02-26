import Modal, { ModalProps } from "@/Components/Modal";
import React from "react";
import { TARDINESSTYPE } from "./Tardiness";
import { Button } from "@/Components/ui/button";

type Props = ModalProps & {
    attendance: TARDINESSTYPE | null;
};

const ViewAttendance = ({ attendance, show, onClose }: Props) => {
    return (
        <Modal show={show} onClose={onClose} title={attendance?.user.name} maxWidth="lg">
            <div className="grid grid-cols-2 gap-4">
                <div className="h-16 border border-border p-2 text-center rounded-lg shadow-sm">
                    <div>No. of Days Present</div>
                    <div className="font-bold">{attendance?.present}</div>
                </div>
                <div className="h-16 border border-border p-2 text-center rounded-lg shadow-sm">
                    <div>No. of Days Absent</div>
                    <div className="font-bold">{attendance?.absent}</div>
                </div>
                <div className="h-16 border border-border p-2 text-center rounded-lg shadow-sm">
                    <div>No. of Days Tardy</div>
                    <div className="font-bold">{attendance?.timetardy}</div>
                </div>
                <div className="h-16 border border-border p-2 text-center rounded-lg shadow-sm">
                    <div>No. of Undertime</div>
                    <div className="font-bold">{attendance?.undertime}</div>
                </div>
            </div>

            <div className="flex">
                <Button variant="default" className="px-8 mt-5 ml-auto" onClick={() => onClose(false)}>
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default ViewAttendance;
