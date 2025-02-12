import { PERSONNELPOSITIONS } from '.types';

export interface User {
    id: number;
    name: string;
    full_name: string;
    firstname: string;
    lastname: string;
    extensionname?: string | null;
    middlename?: string | null;
    birthday: string;
    gender: "male" | "female";
    birthplace: string;
    status: string;
    email: string;
    mobilenumber: string;
    personnelid: string;
    department: DepartmentsType;
    role: 'hr' | 'principal' | 'teaching' | 'non-teaching';
    position: PERSONNELPOSITIONS | null;
    hiredate: string;
    credits: number;
    splcredits: number;
    avatar: string;
    enable_email_notification: boolean;
    enable_email_message_notification: boolean;
    enable_email_announcement_reminder: boolean;
    employmentstatus: string | null;
    email_verified_at?: string;
    status_updated_at: string | null;
}

export type DepartmentsType = "junior"|"senior"|"accounting"|"N/A"

export interface Flash {
    message: string;
    status: "success" | "warning" | "error" | "info" | "notification" | "message";
    title: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash: Flash;
    schoolyear: SCHOOLYEAR | null;
    ct: string;
};

export type SCHOOLYEAR = {
    id: number;
    start: string;
    end: string;
    resume: string;
    schoolyear: string;
}

export type APPROVALTYPE = "approved" | "disapproved" | "pending";

export type PAGINATEDDATA<T> = {
    current_page: number,
    data: Array<T>,
    first_page_url: string,
    from: number,
    last_page: number,
    last_page_url: string,
    links: Array<{ active: boolean; label: StaticRange; url: string | null }>,
    next_page_url: string | null,
    path: string,
    per_page: number,
    prev_page_url: string | null,
    to: number,
    total: number
}
