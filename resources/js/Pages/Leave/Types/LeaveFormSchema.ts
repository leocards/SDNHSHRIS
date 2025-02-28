import { LEAVETYPEKEYSARRAY } from '@/Pages/Leave/Types/leavetypes';
import { requiredError } from "@/Types/types";
import { z } from "zod";

export const DETAILS = ['vphilippines', 'vabroad', 'shospital', 'spatient', 'degree', 'examreview', 'monitization', 'terminal'] as const

export const LEAVESCHEMA = z.object({
    filingfrom: z.date({ required_error: requiredError("date of filing") }),
    filingto: z.date().optional().nullable(),
    salary: z.string().min(1, requiredError("salary")).default(""),
    type: z.enum(LEAVETYPEKEYSARRAY, {
        required_error: "Please select the type of leave.",
        invalid_type_error: "Please select the type of leave.",
    }).nullable(),
    others: z.string().optional().default(""),
    // Details of Leave
    details: z.enum(DETAILS).nullable().default(null),
    detailsinput: z.string().optional().default(''), // special benefits for women
    // dates
    from: z.date().nullable().default(null),
    to: z.date().optional().nullable().default(null),
    daysapplied: z.string().min(1, requiredError("number of days applied")).default(""),
    // Commutation
    commutation: z.enum(['requested', 'not']).optional(),
    // Medical for maternity
    medical: z.number().optional().nullable().default(null)
}).superRefine((leave, ctx) => {
    if(leave.type) {
        if(!leave.details) {
            if(!['mandatory', 'maternity', 'solo', 'vowc', 'rehabilitation', 'emergency', 'adoption', 'paternity', 'slbw', 'others'].includes(leave.type))
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Please choose details of leave.",
                    path: ['details']
                })
        }

        if(!leave.detailsinput && ((leave.details && ['vabroad', 'shospital', 'spatient'].includes(leave.details)) || leave.type === "slbw"))
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "This field is required.",
                path: ['detailsinput']
            })

        if(!leave.from && !['monitization','terminal'].includes(leave.details??''))
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: requiredError('"from"'),
                path: ['from']
            })

        if (leave.to) {
            if (leave.from && leave.to.getTime() == leave.from.getTime())
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "'from' and 'to' dates should not be the same",
                    path: ['to']
                })

            if (leave.from && leave.to.getTime() < leave.from.getTime())
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "'to' must be after 'from'.",
                    path: ['to']
                })
        }

        if(!leave.commutation)
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: requiredError("commutation"),
                path: ['commutation']
            })

        if(leave.type === "maternity" && !leave.medical)
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: requiredError("medical"),
                path: ['medical']
            })
    }


})

export type IFormLeave = z.infer<typeof LEAVESCHEMA>

export const defaultLeave = {
    filingfrom: new Date(),
    filingto: null,
    salary: "",
    type: null,
    others: "",
    // Details of Leave
    details: null,
    detailsinput: '',

    from: null,
    to: null,
    daysapplied: "",
    // Commutation
    commutation: undefined,
    // Medical for maternity
    medical: null,
}


