import Modal, { ModalProps } from "@/Components/Modal";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { cn } from "@/Lib/utils";
import { User } from "@/Types";
import { AtSign, Smartphone, X } from "lucide-react";
import MaleGender from "@/Assets/malegender.png";
import FemaleGender from "@/Assets/femalegender.png";
import { Cake } from "iconsax-react";
import { format } from "date-fns";

type Props = ModalProps & {
    user: User | null;
};

const ViewDetails: React.FC<Props> = ({ user, show, onClose }) => {
    const gender = {
        male: {
            icon: MaleGender,
            label: "Male",
            style: "bg-blue-100 text-blue-600",
        },
        female: {
            icon: FemaleGender,
            label: "Female",
            style: "bg-red-100 text-red-600",
        },
    }[user?.gender ?? "male"];

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Personnel Details"
            maxWidth="sm"
        >
            <Button
                className="absolute top-3 right-3"
                variant="outline"
                size="icon"
                onClick={() => onClose(false)}
            >
                <X />
            </Button>

            <div className="p-6 flex flex-col">
                <div className="mx-auto">
                    <ProfilePhoto src={user?.avatar} className="size-20" fallbackSize={30} />
                </div>

                <Label className="text-lg text-center mt-2">{`${user?.firstname} ${user?.middlename} ${user?.lastname}`}</Label>
                <Label className="text-center">{user?.position}</Label>

                <div className="flex flex-wrap justify-center gap-2 mx-auto mt-3">
                    <div
                        className={cn(
                            "flex items-center gap-2 rounded-md p-1 px-3 text-sm font-medium shrink-0",
                            gender?.style
                        )}
                    >
                        <img src={gender?.icon} alt="" className="size-5" />
                        {gender?.label}
                    </div>
                    <div className="flex items-center px-3 py-1 gap-2 text-yellow-600 bg-yellow-100 rounded-md text-sm font-medium shrink-0">
                        <Cake className="size-5 text-yellow-600" />
                        {user?.birthday && format(user?.birthday, "PP")}
                    </div>
                </div>

                <div className="mx-auto flex flex-col p-3 rounded-md border shadow-sm mt-5">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="">Contact:</div>
                        {user?.mobilenumber}
                    </div>

                    <div className="flex items-center gap-2 text-sm mt-2">
                        <div>Email:</div>
                        {user?.email}
                    </div>

                    <div className="flex items-center gap-2 text-sm mt-2">
                        <div>Department:</div>
                        {user?.department}
                    </div>

                    <div className="flex items-center gap-2 text-sm mt-2">
                        <div>Credits:</div>
                        {user?.credits??0 + (user?.role != 'teaching' ? user?.splcredits??0 : 0)}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewDetails;
