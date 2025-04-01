import { usePage } from "@inertiajs/react";
import { useMemo } from "react";

export type AuthTabsProps = {
    tab: (typeof tabs)[number];
    children: React.ReactNode;
}

const AuthTabs: React.FC<AuthTabsProps> = (props) => {
    const {role, academichead, curriculumnhead} = usePage().props.auth.user;

    const isHead: boolean = !!(academichead || curriculumnhead)

    const isAuthorized = useMemo(() => {
        const allowedtabs = {
            hr: [...tabs.slice(0, 17), tabs[22]],
            principal: [
                ...tabs.slice(0, 5),
                tabs[6],
                tabs[7],
                tabs[17],
                tabs[18],
                tabs[19],
                tabs[21],
                tabs[23],
                tabs[26],
            ],
            teaching: [tabs[1], ...tabs.slice(17, 22), tabs[24], tabs[25]],
            "non-teaching": [tabs[1], ...tabs.slice(17, 22), tabs[24], tabs[25]],
        };
        return allowedtabs[role].includes(props.tab);
    }, []);

    if (isAuthorized) return props.children;
    else return null;
};

const tabs = [
    "generalsearch",
    "dashboard",
    "personnel",
    "personnel.teaching",
    "personnel.non-teaching",
    "personnel.tardiness",
    "myapprovals",
    "myapprovals.leave",
    "myapprovals.pds",
    "myapprovals.saln",
    "myapprovals.sr",
    "myreports",
    "myreports.lp",
    "myreports.ipcr",
    "myreports.saln",
    "myreports.coc",
    "myreports.logs",
    "leave",
    "saln",
    "sr",
    "tardiness",
    "pds",
    "personnel.archive",
    "myapprovals.locatorslip",
    "locatorslip",
    "classassumption",
    "myapprovals.classassumption",
] as const;

export default AuthTabs;
