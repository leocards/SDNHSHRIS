import { requiredError } from "@/Types/types";
import { z } from "zod";

export const CIVILSERVICEELIGIBILITYSCHEMA = z.object({
    cs: z.array(
        z.object({
            csid: z.number().optional().nullable().default(null),
            eligibility: z.string().min(1, requiredError('career service')).default(""),
            rating: z.string().optional().default(""),
            dateofexaminationconferment: z.date({ required_error: requiredError('date of examination'), invalid_type_error: requiredError('date of examination') }).nullable().default(null),
            placeofexaminationconferment: z.string().min(1, requiredError('place of examination')).default(""),
            license: z.object({
                number: z.string().optional().default(""),
                dateofvalidity: z.date().nullable().default(null),
            })
        }).refine(data => data.dateofexaminationconferment !== null, { message: requiredError('date of examination'), path: ["dateofexaminationconferment"] })
    ),
    deletedCS: z.array(z.number()).optional()
})

export type IFormCivilServiceEligibility = z.infer<typeof CIVILSERVICEELIGIBILITYSCHEMA>

export const defaultCS = {
    csid: null,
    eligibility: "",
    rating: "",
    dateofexaminationconferment: null,
    placeofexaminationconferment: "",
    license: {
        number: "",
        dateofvalidity: null
    },
}

export type CIVILSERVICETYPESINGLE = {
    id: number
    user_id: number
    careerservice: string
    rating: string
    examination: string
    placeexamination: string
    licensenumber: string
    validity: string
}

export type CIVILSERVICETYPE = Array<CIVILSERVICETYPESINGLE>
