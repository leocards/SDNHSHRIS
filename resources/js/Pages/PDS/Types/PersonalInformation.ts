import { requiredError } from "@/Types/types";
import { z } from "zod";

const ADDRESS = z.object({
    pdspi_id: z.number().nullable().default(null),
    houselotblockno: z.string().optional().default(""),
    street: z.string().optional().default(""),
    subdivision: z.string().optional().default(""),
    barangay: z.string().min(1, requiredError('barangay')).default(""),
    citymunicipality: z.string().min(1, requiredError('City/Municipality')).default(""),
    province: z.string().min(1, requiredError('province')).default(""),
    zipcode: z.string().min(1, requiredError('province')).length(4, "The zip code must be 4 characters long.").default(""),
})

export const PERSONALINFORMATIONSCHEMA = z.object({
    firstname: z.string().min(1, requiredError("first name")).default(""),
    lastname: z.string().min(1, requiredError("last name")).default(""),
    middlename: z.string().optional().default(""),
    extensionname: z.string().optional().default(""),
    dateofbirth: z
        .date({ required_error: requiredError("date of birth") })
        .optional()
        .refine((attribute) => {
            if (!attribute) return false;

            return true;
        }, requiredError("date of birth")),
    gender: z
        .enum(["male", "female"], {
            required_error: requiredError("gender"),
        })
        .optional()
        .refine((attribute) => {
            if (!attribute) return false;

            return true;
        }, requiredError("gender")),
    placeofbirth: z.string().min(1, requiredError("place of birth")).default(""),
    height: z.string().min(1, requiredError("height")).default(""),
    weight: z.string().min(1, requiredError("weight")).default(""),
    bloodtype: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'O', 'A', 'B', 'AB'], {
        required_error: requiredError("blood type"),
        invalid_type_error: "Must be a valid blood type.",
    }),
    civilstatus: z.object({
        status: z.enum(['single', 'married', 'widowed', 'separate', 'others'], {
            required_error: requiredError("civil status"),
            invalid_type_error: "Must be a valid civil status.",
        }),
        others: z.string().optional().default("")
    }),
    gsis: z.string().optional().default(""),
    pagibig: z.string().optional().default(""),
    philhealth: z.string().optional().default(""),
    sss: z.string().optional().default(""),
    tin: z.string().optional().default(""),
    agencyemployee: z.string().optional().default(""),
    citizenship: z.object({
        citizen: z.enum(['filipino', 'dual']),
        dual: z.object({
            by: z.enum(['birth', 'naturalization']).nullable().optional().default(null),
            country: z.string().optional().default("")
        }).optional()
    }).superRefine(({ citizen, dual }, ctx) => {
        if (citizen === 'dual' && (!dual?.by)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please indicate how you acquired dual citizenship.",
                path: ['dual.by']
            })
        }

        if (citizen === 'dual' && (!dual?.country)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please indicate country.",
                path: ['dual.country']
            })
        }

    }),
    residentialaddress: ADDRESS,
    permanentaddress: ADDRESS.extend({
        isSameResidential: z.boolean().optional().default(false)
    }),
    telephone: z.string().optional().default(""),
    mobile: z.string({ invalid_type_error: requiredError('mobile no.'), required_error: requiredError('mobile no.') }).min(1, requiredError('mobile no.')).length(10, "The mobile no. must be 10 characters long").default(""),
    email: z.string().email().optional().nullable().or(z.literal(""))
})

export type IFormPersonalInformation = z.infer<typeof PERSONALINFORMATIONSCHEMA>

export type PERSONALINFORMATIONTYPE = {
    id: number;
    placeofbirth: string;
    civilstatus: {
        status: "single"|"married"|"widowed"|"separate"|"others";
        others?: string;
    };
    height: string;
    weight: string;
    bloodtype: "A" | "A+" | "A-" | "B+" | "B" | "B-" | "AB" | "AB+" | "AB-" | "O" | "O+" | "O-";
    gsis: string | null;
    pagibig: string | null;
    philhealth: string | null;
    sss: string | null;
    tin: string | null;
    agencyemployee: string | null;
    telephone: string;
    mobile: number|string;
    email: string;
    citizenship: {
        citizen: "filipino"|"dual";
        dual?: {
            by: "birth"|"naturalization";
            country: string;
        };
    };
    addresses: Array<ADDRESSTYPE>
}

export type ADDRESSTYPE = {
    id: number;
    pdspi_id: number;
    type: "residential" | "permanent";
    same: boolean;
    houselotblockno: string;
    street: string;
    subdivision: string;
    barangay: string;
    citymunicipality: string;
    province: string;
    zipcode: string;
}
