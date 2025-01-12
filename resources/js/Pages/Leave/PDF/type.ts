import { DETAILS } from './../Types/LeaveFormSchema';
import { APPROVALTYPE, User } from "@/Types";
import { LEAVETYPEKEYS } from "../Types/leavetypes";

export type PRINCIPAL = {
    name: string
    full_name: string
    position: string
}

export type APPLICATIONFORLEAVETYPES = Pick<User, "firstname"|"lastname"|"middlename"|"position"|"department"|"avatar"> & {
    id: number;
    filingfrom: string;
    filingto: string;
    salary: string;
    type: LEAVETYPEKEYS;
    others: string;
    details: typeof DETAILS[number];
    detailsinput: string;
    from: string;
    to: string;
    daysapplied: string;
    commutation: "requested" | "not"
    principalstatus: APPROVALTYPE
    principaldisapprovedmsg: string
    hrstatus: APPROVALTYPE
    hrdisapprovedmsg: string
    medical: string | null
}

