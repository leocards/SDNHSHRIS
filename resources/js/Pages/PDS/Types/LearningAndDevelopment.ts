import { requiredError } from "@/Types/types"
import { z } from "zod"

export const LEARNINGANDDEVELOPMENTSCHEMA = z.object({
    ld: z.array(
        z.object({
            ldid: z.number().optional().nullable().default(null),
            title: z.string().min(1, requiredError('title')).default(""),
            inclusivedates: z.object({
                from: z.date({ invalid_type_error: requiredError('"from"') }).optional(),
                to: z.date({ invalid_type_error: requiredError('"to"') }).optional()
            }),
            numberofhours: z.string().min(1, requiredError('number of hours')).default(""),
            typeofld: z.string().min(1, requiredError('type of LD')).default(""),
            conductedsponsoredby: z.string().min(1, "This field is required.").default("")
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
    deletedLD: z.array(z.number()).optional()
})

export type IFormLearningAndDevelopment = z.infer<typeof LEARNINGANDDEVELOPMENTSCHEMA>

export const defaultLD = {
    ldid: null,
    title: "",
    inclusivedates: {
        from: undefined, to: undefined
    },
    numberofhours: "",
    typeofld: "",
    conductedsponsoredby: ""
}

export type LEARNINGANDEVELOPMENTTYPESINGLE = {
    id: number;
    user_id: number;
    title: string;
    inclusivedates: any;
    numofhours: string;
    type: string;
    conductedby: string;
}

export type LEARNINGANDEVELOPMENTTYPE = Array<LEARNINGANDEVELOPMENTTYPESINGLE>
