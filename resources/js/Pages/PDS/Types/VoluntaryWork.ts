import { requiredError } from "@/Types/types"
import { z } from "zod"

export const VOLUNTARYWORK = z.object({
    vw: z.array(
        z.object({
            vwid: z.number().optional().nullable().default(null),
            nameandaddress: z.string().min(1, requiredError('name and address')).default(""),
            inclusivedates: z.object({
                from: z.date({ invalid_type_error: requiredError('"from"') }).optional(),
                to: z.date({ invalid_type_error: requiredError('"to"') }).optional()
            }),
            numberofhours: z.string().min(1, requiredError('number of hours')).default(""),
            positionornatureofwork: z.string().min(1, requiredError('position or nature of work')).default("")
        }).superRefine(({ inclusivedates: { from, to } }, ctx) => {
            if (!from || !to) {
                if (!from)
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["inclusivedates.from"],
                        message: requiredError('"from"')
                    })

                if (!to)
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["inclusivedates.to"],
                        message: requiredError('"to"')
                    })
            } else {
                if (to < from)
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["inclusivedates.to"],
                        message: "'To' date must be after the 'from' date"
                    })
            }
        })
    ),
    deletedVW: z.array(z.number()).optional()
})

export type IformVoluntaryWork = z.infer<typeof VOLUNTARYWORK>

export const defaultVW = {
    vwid: null,
    nameandaddress: "",
    inclusivedates: {
        from: undefined, to: undefined
    },
    numberofhours: "",
    positionornatureofwork: ""
}

export type VOLUNTARYWORKTYPESINGLE = {
    id: number
    user_id: number
    inclusivedates: any
    organization: string
    numberofhours: string
    position: string
}

export type VOLUNTARYWORKTYPE = Array<VOLUNTARYWORKTYPESINGLE>
