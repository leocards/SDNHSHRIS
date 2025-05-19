import { User } from "@/Types";
import { requiredError } from "@/Types/types";
import { z } from "zod";
import { SALNTOTALTYPE } from "../Print/SALNSeparatePage";

const SALNSCHEMA = z.object({
    spouse: z.object({
        familyname: z.string().optional().default(''),
        firstname: z.string().optional().default(''),
        middleinitial: z.string().optional().default(''),
        position: z.string().optional().default(''),
        office: z.string().optional().default(''),
        officeaddress: z.string().optional().default(''),
        governmentissuedid: z.string().optional().default(''),
        idno: z.string().optional().default(''),
        dateissued: z.date().nullable().default(null)
    }).optional(),
    children: z.array(
        z.object({
            name: z.string().default(''),
            dateofbirth: z.date().nullable().default(null),
        }).partial()
    ).optional().default([{ name: "", dateofbirth: null }]),
    assets: z.object({
        real: z.array(
            z.object({
                description: z.string().default(''),
                kind: z.string().default(''),
                exactlocation: z.string().default(''),
                assessedvalue: z.string().default(''),
                currentfairmarketvalue: z.string().default(''),
                acquisition: z.object({
                    year: z.string().refine(
                        (value) => value.toLowerCase() === 'n/a' || /^\d{4}$/.test(value),
                        {
                            message: 'Must be 4 characters representing a year or "N/A".',
                        }
                    ).default(''),
                    mode: z.string().default(''),
                }).partial(),
                acquisitioncost: z.string().default('')
            }).partial()
        ).optional(),
        personal: z.array(
            z.object({
                description: z.string().default(''),
                yearacquired: z.string().default(''),
                acquisitioncost: z.string().default(''),
            }).partial()
        ).optional()
    }),
    liabilities: z.array(
        z.object({
            nature: z.string(),
            nameofcreditors: z.string(),
            outstandingbalances: z.string(),
        }).partial()
    ),
    biandfc: z.object({
        nobiandfc: z.boolean().optional(),
        bifc: z.array(
            z.object({
                name: z.string(),
                address: z.string(),
                nature: z.string(),
                date: z.date().or(z.string()).optional().nullable(),
            }).partial()
        ).optional()
    }),
    relativesingovernment: z.object({
        norelative: z.boolean(),
        relatives: z.array(
            z.object({
                name: z.string(),
                relationship: z.string(),
                position: z.string(),
                agencyandaddress: z.string()
            })
        ).optional()
    }),
    asof: z.date({ required_error: requiredError('as of') }).nullable().default(null),
    date: z.date({ required_error: requiredError('date') }).default(new Date()),
    isjoint: z.enum(['joint', 'separate', 'not']).nullable().default(null)
}).superRefine(({ biandfc, relativesingovernment, isjoint, spouse, asof }, ctx) => {
    if (!biandfc.nobiandfc) {
        if (biandfc.bifc?.length ?? 0 > 0) {
            biandfc.bifc?.forEach((bifc, index) => {
                if (!bifc.name) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["biandfc.bifc", index, "name"],
                        message: "This field is required"
                    });
                }
                if (!bifc.address) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["biandfc.bifc", index, "address"],
                        message: "This field is required"
                    });
                }
                if (!bifc.nature) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["biandfc.bifc", index, "nature"],
                        message: "This field is required"
                    });
                }
            })
        }
    }

    if (!relativesingovernment.norelative) {
        if (relativesingovernment.relatives?.length ?? 0 > 0) {
            relativesingovernment.relatives?.forEach((relative, index) => {
                if (!relative.name) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["relativesingovernment.relatives", index, "name"],
                        message: "This field is required"
                    });
                }
                if (!relative.relationship) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["relativesingovernment.relatives", index, "relationship"],
                        message: "This field is required"
                    });
                }
                if (!relative.position) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["relativesingovernment.relatives", index, "position"],
                        message: "This field is required"
                    });
                }
                if (!relative.agencyandaddress) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ["relativesingovernment.relatives", index, "agencyandaddress"],
                        message: "This field is required"
                    });
                }
            })
        }
    }

    if (isjoint && isjoint == "joint") {
        // Check if spouse is defined
        if (!spouse) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["spouse"],
                message: `Spouse information is required when "joint" or "separate" filing.`,
            });

            return; // Exit early if spouse is undefined
        }

        // Define required spouse fields
        const requiredSpouseFields: (keyof typeof spouse)[] = [
            "familyname",
            "firstname",
            "middleinitial",
            "position",
            "office",
            "officeaddress",
            "governmentissuedid",
            "idno",
            "dateissued"
        ];

        // Iterate through required fields and validate
        requiredSpouseFields.forEach((field) => {
            if (!spouse[field]) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["spouse", field],
                    message: `This field is required when "joint" or "separate" filing.`
                });
            }
        });
    }

    if (!asof) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This field is required.",
            path: ['asof']
        })
    }

    if (!isjoint) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This field is required.",
            path: ['isjoint']
        })
    }
})

type IFormSaln = z.infer<typeof SALNSCHEMA>

export type SALNTYPE = {
    id: number
    asof: string;
    spouse: {
        familyname: string;
        firstname: string;
        middleinitial: string;
        position: string;
        office: string;
        officeaddress: string;
        governmentissuedid: string;
        idno: string;
        dateissued: string;
    }
    children: { name: string; dateofbirth: string }[]
    assets: {
        real: {
            description: string
            kind: string
            exactlocation: string
            assessedvalue: string
            currentfairmarketvalue: string
            acquisition: {
                year: string
                mode: string
            }
            acquisitioncost: string
        }[],
        personal: {
            description: string;
            yearacquired: string;
            acquisitioncost: string;
        }[],
    }
    liabilities: {
        nature: string;
        nameofcreditors: string;
        outstandingbalances: string;
    }[]
    biandfc: {
        nobiandfc: boolean
        bifc: {
            name: string
            address: string
            nature: string
            date: string
        }[]
    }
    relativesingovernment: {
        norelative: boolean
        relatives: {
            name: string
            relationship: string
            position: string
            agencyandaddress: string
        }[]
    }
    date: string
    isjoint: 'joint' | 'separate' | 'not'
    status: 'approved' | 'pending' | 'disapproved'
    created_at: string
    updated_at: string
}

export type dataSaln = {
    id: number
    assets: number
    liability: number
    networth: number
    asof: string
}

export function getRecord(data: Array<SALNTYPE>): any[] {
    let mappedData: dataSaln[] = []

    data.forEach(saln => {
        const { assets: { real, personal }, liabilities, id, asof } = saln
        let assets = 0;
        let liability = 0;

        real.forEach(ra => {
            let asset = isNaN(parseFloat(ra.acquisitioncost)) ? 0 : parseFloat(ra.acquisitioncost)
            assets = assets + asset
        });

        personal.forEach(pa => {
            let asset = isNaN(parseFloat(pa.acquisitioncost)) ? 0 : parseFloat(pa.acquisitioncost)
            assets = assets + asset
        });

        liabilities.forEach(l => {
            let liabilitycost = isNaN(parseFloat(l.outstandingbalances)) ? 0 : parseFloat(l.outstandingbalances)
            liability = liability + liabilitycost
        });

        mappedData.push({
            id,
            assets,
            liability,
            networth: assets - liability,
            asof,
        })
    });


    return mappedData
}

export function getBifc(data: SALNTYPE['biandfc']['bifc']) {
    return data.map((bifc) => ({
        name: bifc.name ?? "",
        address: bifc.address ?? "",
        nature: bifc.nature ?? "",
        date: bifc.date ?? null,
    }))
}

export function getRelatives(data: SALNTYPE['relativesingovernment']['relatives']) {
    return data.map((relative) => ({
        name: relative.name ?? "",
        relationship: relative.relationship ?? "",
        position: relative.position ?? "",
        agencyandaddress: relative.agencyandaddress ?? "",
    }))
}

export type SALNTPRINTYPE = {
    user: User
    saln: SALNTYPE
    spouse: SALNTYPE['spouse']
    declarant: {
        governmentissuedid: string
        licensepassportid: string
        issued: string
    }
    pages: Array<PAGE>
    address: string | null
}

export type PAGE = {
    children: Array<{
        name: string
        dateofbirth: string
    }> | null
    real: SALNTYPE['assets']['real']
    personal: SALNTYPE['assets']['personal']
    liabilities: SALNTYPE['liabilities']
    bifc: SALNTYPE['liabilities']
    relatives: SALNTYPE['relativesingovernment']
    saln_totals: SALNTOTALTYPE
}

export {
    type IFormSaln,
    SALNSCHEMA
}
