import { requiredError } from "@/Types/types";
import { z } from "zod";

const caseInsensitiveLiteral = (expected: string) =>
    z.string().refine((val) => val.toLowerCase() === expected.toLowerCase(), {
      message: `Input must be "${expected}" (case-insensitive).`,
    });

export const WORKEXPERIENCESCHEMA = z.object({
    we: z.array(
        z.object({
            weid: z.number().optional().nullable().default(null),
            inclusivedates: z.object({
                from: z.date({required_error: requiredError('"from"'), invalid_type_error: requiredError('"from"')}).optional(),
                to: z.date({invalid_type_error: requiredError('"to"')}).or(caseInsensitiveLiteral('Present')).optional(),
            }),
            positiontitle: z.string().min(1, requiredError('position title')).default(""),
            department: z.string().min(1, requiredError('department/agency/office/company')).default(""),
            monthlysalary: z.string().min(1, requiredError('monthly salary')).max(15, "Maximum of 15 characters only.").default(""),
            salarygrade: z.string().min(1, requiredError('salary/job/pay grade')).default(""),
            statusofappointment: z.string().min(1, requiredError('status of appointment')).default(""),
            isgovernment: z.enum(['y', 'n'], { invalid_type_error: "This field is required." }).optional().refine((data) => {
                if(!data) return false

                return true
            }, "This field is required.")
        }).superRefine(({ inclusivedates }, ctx) => {
            if(!inclusivedates.from || !inclusivedates.to) {
                if(!inclusivedates.from)
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: requiredError('"from"'),
                        path: ["inclusivedates.from"],
                    });

                if(!inclusivedates.to)
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: requiredError('"to"'),
                        path: ["inclusivedates.to"],
                    });
            } else {
                if(inclusivedates.to < inclusivedates.from)
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "'To' date must be after the 'from' date",
                        path: ["inclusivedates.to"],
                    })
            }
        })
    ),
    deletedWE: z.array(z.number()).optional()
})

export type IFormWorkExperience = z.infer<typeof WORKEXPERIENCESCHEMA>

export const defaultWE = {
    weid: null,
    inclusivedates: {
        from: undefined,
        to: undefined
    },
    positiontitle: "",
    department: "",
    monthlysalary: "",
    salarygrade: "",
    statusofappointment: "",
    isgovernment: undefined
}

export type WORKEXPERIENCESINGLE = {
    id: number,
    user_id: number,
    inlcusivedates: { from: string, to: string},
    positiontitle: string,
    department: string,
    monthlysalary: string,
    salarygrade: string,
    statusofappointment: string,
    isgovernment: 'y' | 'n'
}

export type WORKEXPERIENCETYPE = Array<WORKEXPERIENCESINGLE>
