import Header from "@/Components/Header";
import TypographySmall from "@/Components/Typography";
import { useFormSubmit } from "@/Hooks/useFormSubmit";
import { ArrowRight2 } from "iconsax-react";
import AccountInformationForm, {
    ACCOUNTSCHEMA,
    IFormAccount,
} from "../Profile/Partials/ProfileInformation/AccountInformationForm";
import { User } from "@/Types";
import { useToast } from "@/Hooks/use-toast";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";

type NewPersonnelProps = {
    personnel?: User | null;
    hasPrincipal: boolean;
    personneltype: "teaching"|"non-teaching";
};

const NewPersonnel: React.FC<NewPersonnelProps> = ({ personnel, hasPrincipal, personneltype }) => {
    const { toast } = useToast();
    const { setLabel } = useProcessIndicator();

    const form = useFormSubmit<IFormAccount>({
        schema: ACCOUNTSCHEMA,
        route: route("personnel.store", {personnelid: personnel?.id, _query: { pt: personneltype }}),
        method: "post",
        async: true,
        values: {
            personal: {
                firstname: personnel?.firstname ?? "",
                lastname: personnel?.lastname ?? "",
                middlename: personnel?.middlename ?? "",
                extensionname: personnel?.extensionname ?? "",
                gender: personnel?.gender ?? undefined,
                birthday: personnel?.birthday ? new Date(personnel?.birthday) : undefined,
            },
            contact: {
                email: personnel?.email ?? "",
                mobilenumber: personnel?.mobilenumber ?? "",
            },
            personnel: {
                ispersonnel: true,
                personnelid: personnel?.personnelid ?? "",
                datehired: personnel?.hiredate
                    ? new Date(personnel?.hiredate)
                    : undefined,
                role: personnel?.role ?? personneltype,
                department: personnel?.department || (personneltype === "non-teaching" ? "accounting" : undefined),
                position: personnel?.position || undefined,
                credits: !personnel && personneltype != "teaching" ? '30' : '0',
                splcredits: !personnel && personneltype != "teaching" ? '15' : '0',
            },
            password: "12345678"
        },
        callback: {
            onBefore: () => {
                if(personnel)
                    setLabel("Updating...")
            },
            onSuccess: (page: any) => {
                toast({
                    status: page.props.flash.status,
                    title: page.props.flash.title,
                    description: page.props.flash.message,
                });
            },
            onError: (error: any) => {
                if ("0" in error) console.log("error", error[0]);
                else {
                    for (const key in error) {
                        form.setError(
                            key as keyof Omit<IFormAccount, "personnel">,
                            {
                                type: "manual",
                                message: error[key],
                            }
                        );
                    }
                }
            },
        },
    });

    return (
        <div className="mb-5">
            <Header title="New Personnel" className="mb-2">
                <div className="flex items-center gap-1">
                    Personnel{" "}
                    <ArrowRight2 className="size-4 [&>path]:stroke-[3]" /> New
                </div>
            </Header>

            <AccountInformationForm
                form={form}
                user={personnel}
                isProfile={false}
                hasPrincipal={hasPrincipal}
            />
        </div>
    );
};

export default NewPersonnel;
