import { APPROVALTYPE, User } from "@/Types"
import { requiredError } from "@/Types/types"
import { z } from "zod"

export type CLASSASSUMPTIONTYPE = {
    id: number;
    user: User;
    principal: User;
    curriculumnhead: User;
    academichead: User;
    details: {
        date: {
            from: string;
            to: string | null;
        }
        classloads: Array<{
            time: string;
            timeTo: string;
            gradesection: string;
            subject: string;
            teacher: number;
        }>
        details: {
            catype: 'sick' | 'business'
            type: 'checkup' | 'business' | 'conference' | 'illness' | 'hospitalization' | 'death' | 'slothers' | 'obothers'
            others: string | null
        }
    };
    status: APPROVALTYPE;
}

export const CLASSASSUMPTIONSCHEMA = z.object({
    date: z.object({
        from: z.date({ required_error: 'This field is required' }),
        to: z.date().optional().nullable().default(null)
    }),
    details: z.object({
        catype: z.enum(['sick','business']),
        type: z.enum(['checkup','business','conference','illness','hospitalization','death','slothers','obothers']),
        others: z.string().optional().default('')
    }),
    classloads: z.array(
        z.object({
            time: z.string().min(1, requiredError('time from')),
            timeTo: z.string().min(1, requiredError('time to')),
            gradesection: z.string().min(1, requiredError('grade and section')),
            subject: z.string().min(1, requiredError('subject')),
            teacher: z.number(),
        })
    )
})

export type IFormClassAssumption = z.infer<typeof CLASSASSUMPTIONSCHEMA>

export const ClassAssumptionDetailsList: {
    business: {
        checkup: string;
        business: string;
        conference: string;
        obothers: string;
    };
    sick: {
        illness: string;
        hospitalization: string;
        death: string;
        slothers: string;
    }
} = {
    business: {
        checkup: 'Scheduled Medical Check-up/Personal Transaction',
        business: 'Official Business/Attendance to Trainings/Seminar',
        conference: 'Division conference/Participation of Division/Regional Activities',
        obothers: 'Others, please specify',
    },
    sick: {
        illness: 'Illness/Sick Leave',
        hospitalization: 'Hospitalization of a Member of the Family',
        death: 'Death of a Member of the Family',
        slothers: 'Others, please specify',
    },
} as const

export const ClassAssumptionDetails = {
    business: [
        { type: 'checkup', label: ClassAssumptionDetailsList.business.checkup },
        { type: 'business', label: ClassAssumptionDetailsList.business.business },
        { type: 'conference', label: ClassAssumptionDetailsList.business.conference },
        { type: 'obothers', label: ClassAssumptionDetailsList.business.obothers },
    ],
    sick: [
        { type: 'illness', label: ClassAssumptionDetailsList.sick.illness },
        { type: 'hospitalization', label: ClassAssumptionDetailsList.sick.hospitalization },
        { type: 'death', label: ClassAssumptionDetailsList.sick.death },
        { type: 'slothers', label: ClassAssumptionDetailsList.sick.slothers },
    ]
}

export const formatTimeTo12Hr = (time: string): string => {
    if(!time)
        return ''

    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}
