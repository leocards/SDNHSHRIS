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
import { useEffect } from "react";
import { z } from "zod";

type NewPersonnelProps = {
    personnel?: User | null;
    hasPrincipal: boolean;
    personneltype: "teaching" | "non-teaching";
    curriculumnheads: string[];
    academicheads: string[];
};

let REFINEDSCHEMA = ACCOUNTSCHEMA.superRefine(({ personnel }, ctx) => {
    if(!personnel.gradelevel)
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please select grade levels 7 to 12.',
            path: ['personnel.gradelevel']
        })
})

const NewPersonnel: React.FC<NewPersonnelProps> = ({
    personnel,
    hasPrincipal,
    personneltype,
    curriculumnheads,
    academicheads,
}) => {
    const { toast } = useToast();
    const { setLabel } = useProcessIndicator();

    const form = useFormSubmit<IFormAccount>({
        schema: REFINEDSCHEMA,
        route: route("personnel.store", {
            personnelid: personnel?.id,
            _query: { pt: personneltype },
        }),
        method: "post",
        async: true,
        values: {
            personal: {
                firstname: personnel?.firstname ?? "",
                lastname: personnel?.lastname ?? "",
                middlename: personnel?.middlename ?? "",
                extensionname: personnel?.extensionname ?? "",
                gender: personnel?.gender ?? undefined,
                birthday: personnel?.birthday
                    ? new Date(personnel?.birthday)
                    : undefined,
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
                role:
                    personnel?.role ??
                    (!hasPrincipal ? "principal" : personneltype),
                department:
                    personnel?.department ||
                    (personneltype === "non-teaching"
                        ? !hasPrincipal
                            ? "deped"
                            : "accounting"
                        : !hasPrincipal
                        ? "deped"
                        : undefined),
                position: personnel?.position || undefined,
                gradelevel: personnel ? personnel.gradelevel??null : null,
                curriculumnhead: null,
                academichead: null,
                credits: !personnel && personneltype != "teaching" ? "30" : "0",
                splcredits:
                    !personnel && personneltype != "teaching" ? "15" : "0",
            },
            password: "12345678",
        },
        callback: {
            onBefore: () => {
                if (personnel) setLabel("Updating...");
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

    useEffect(() => {
        if (!hasPrincipal) {
            toast({
                title: "No Principal",
                description:
                    "Create a principal first before creating a new personnel",
                status: "info",
            });
        }
        if(personnel) {
            form.setValue('personnel.curriculumnhead', personnel.curriculumnhead??null)
            form.setValue('personnel.academichead', personnel.academichead??null)
        }
    }, []);

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
                curriculumnheads={curriculumnheads}
                academicheads={academicheads}
                personneltype={personneltype}
            />
        </div>
    );
};

export default NewPersonnel;
