import { requiredError } from "@/Types/types";
import { z } from "zod";

const CHOICES = z.object({
    choices: z.enum(['y', 'n'], { required_error: 'Please select Yes or No.', invalid_type_error: 'Please select Yes or No.' })
        .nullable(),
    details: z.string().optional()
}).refine(({ choices, details }) => {
    if (choices === "y" && details === "")
        return false

    return true
}, { message: "Please provide details.", path: ['details'] })

export const C4SCHEMA = z.object({
    "34": z.object({
        choicea: z.object({
            choices: z.enum(['y', 'n'], { required_error: 'Please select Yes or No.', invalid_type_error: 'Please select Yes or No.' })
                .nullable()
        }),
        choiceb: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        })
    }).superRefine((data, ctx) => {
        if (data.choicea === null) {
            ctx.addIssue({
                code: "custom",
                path: ['choicea'],
                message: 'Please select Yes or No.'
            });
        }
    }),
    "35": z.object({
        choicea: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        }),
        choiceb: z.object({
            choices: z.enum(['y', 'n'], { required_error: 'Please select Yes or No.', invalid_type_error: 'Please select Yes or No.' })
                .nullable(),
            datefiled: z.date({ required_error: requiredError('date filed'), invalid_type_error: requiredError('date filed') }).nullable().optional(),
            statusofcase: z.string().optional().default("")
        }).superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }

            if (data.choices === "y" && !data.statusofcase) {
                ctx.addIssue({
                    code: "custom",
                    path: ['statusofcase'],
                    message: requiredError('status of case')
                });
            }

            if (data.choices === "y" && !data.datefiled) {
                ctx.addIssue({
                    code: "custom",
                    path: ['datefiled'],
                    message: requiredError('date filed')
                });
            }
        })
    }),
    "36": CHOICES.superRefine((data, ctx) => {
        if (data.choices === null) {
            ctx.addIssue({
                code: "custom",
                path: ['choices'],
                message: 'Please select Yes or No.'
            });
        }
    }),
    "37": CHOICES.superRefine((data, ctx) => {
        if (data.choices === null) {
            ctx.addIssue({
                code: "custom",
                path: ['choices'],
                message: 'Please select Yes or No.'
            });
        }
    }),
    "38": z.object({
        choicea: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        }),
        choiceb: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        }),
    }),
    "39": CHOICES.superRefine((data, ctx) => {
        if (data.choices === null) {
            ctx.addIssue({
                code: "custom",
                path: ['choices'],
                message: 'Please select Yes or No.'
            });
        }
    }),
    "40": z.object({
        choicea: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        }),
        choiceb: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        }),
        choicec: CHOICES.superRefine((data, ctx) => {
            if (data.choices === null) {
                ctx.addIssue({
                    code: "custom",
                    path: ['choices'],
                    message: 'Please select Yes or No.'
                });
            }
        }),
    }),
    "41": z.array(
        z.object({
            name: z.string().optional().default(""),
            address: z.string().optional().default(""),
            telno: z.string().optional().default("")
        })
    ),
    governmentids: z.object({
        governmentissuedid: z.string().optional().default(""),
        licensepassportid: z.string().optional().default(""),
        issued: z.string().optional().default("")
    }).superRefine((data, ctx) => {
        if(data.licensepassportid) {
            if (data.licensepassportid.length < 7)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['licensepassportid'],
                    message: "Must have atleaset 7 digits."
                })
        }
    })
})

export type IFormC4 = z.infer<typeof C4SCHEMA>

export const referenceDefault = [
    {
        name: "",
        address: "",
        telno: ""
    },
    {
        name: "",
        address: "",
        telno: ""
    },
    {
        name: "",
        address: "",
        telno: ""
    }
]

export const defaults = {
    "34": {
        choicea: {
            choices: null,
        },
        choiceb: {
            choices: null,
            details: "",
        },
    },
    "35": {
        choicea: {
            choices: null,
            details: "",
        },
        choiceb: {
            choices: null,
            datefiled: null,
            statusofcase: "",
        },
    },
    "36": {
        choices: null,
        details: "",
    },
    "37": {
        choices: null,
        details: "",
    },
    "38": {
        choicea: {
            choices: null,
            details: "",
        },
        choiceb: {
            choices: null,
            details: "",
        },
    },
    "39": {
        choices: null,
        details: "",
    },
    "40": {
        choicea: {
            choices: null,
            details: "",
        },
        choiceb: {
            choices: null,
            details: "",
        },
        choicec: {
            choices: null,
            details: "",
        },
    },
    "41": referenceDefault,
    governmentId: {
        governmentissuedid: "",
        licensepassportid: "",
        issued: "",
    }
}

export type C4Type = "34" | "35" | "36" | "37" | "38" | "39" | "40" | "41" | "governmentId";

export type C4TYPESINGLE = {
    id: number;
    user_id: number
    type: C4Type;
    details: any;
}

export type C4TYPE = Array<C4TYPESINGLE>

export const getC4 = <T = any>(data: C4TYPE | null, type: C4Type, defaultC4: any, key?: string): T => {
    const c4 = data?.find((c) => c.type === type);

    if (c4)
        if (key) {
            const keys = key.split(".");
            let current = c4.details;

            for (const part of keys) {
                if (current[part] !== undefined) {
                    current = current[part];
                }
            }

            return current;
        } else return c4.details;
    else return defaultC4;
};
