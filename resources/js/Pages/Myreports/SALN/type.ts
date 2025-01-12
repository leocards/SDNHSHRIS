export type SALNType = {
    id: number;
    counter?: number;
    joint: number;
    networth: string;
    spouse: string;
    user_id: number;
    year: string | number;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        middle_name: string;
        position: string;
        personnel_id: string;
        pds_personal_information: any;
        name: string;
    };
    created_at: string;
    pds_personal_information: { tin: string };
};

export type PrincipalType = { name: string; position: string; email: string; phone_number: string };
export type HrType = { name: string; position: string; email: string; phone_number: string };

export const toNumber = (value: string|number): number | null => {
    if(typeof value === "string") {
        // Remove commas and validate if the result is numeric
        const sanitizedValue = value.replace(/,/g, "");
        return isNaN(Number(sanitizedValue)) ? null : Number(sanitizedValue);
    } else {
        return value
    }
};
