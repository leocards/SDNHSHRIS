export const LEAVETYPES = [
    "Vacation Leave",
    "Mandatory/Forced Leave",
    "Sick Leave",
    "Maternity Leave",
    "Paternity Leave",
    "Special Privilege Leave",
    "Solo Parent Leave",
    "Study Leave",
    "10-Day VOWC Leave",
    "Rehabilitation Privilege",
    "Special Leave Benefits for Women",
    "Special Emergency (Calamity) Leave",
    "Adoption Leave",
    "Others",
] as const;

export const LEAVETYPESOBJ = {
    vacation: "Vacation Leave",
    mandatory: "Mandatory/Forced Leave",
    sick: "Sick Leave",
    maternity: "Maternity Leave",
    paternity: "Paternity Leave",
    spl: "Special Privilege Leave",
    solo: "Solo Parent Leave",
    study: "Study Leave",
    vowc: "10-Day VOWC Leave",
    rehabilitation: "Rehabilitation Privilege",
    slbw: "Special Leave Benefits for Women",
    emergency: "Special Emergency (Calamity) Leave",
    adoption: "Adoption Leave",
    others: "Others",
} as const;

export const LEAVETYPESSECTIONOBJ = {
    vacation: "(Sec. 51, Rule XV, Omnibus Rules Implementing E.O. No. 292)",
    mandatory: "(Sec. 25, Rule XV, Omnibus Rules Implementing E.O. No. 292)",
    sick: "(Sec. 43, Rule XV, Omnibus Rules Implementing E.O. No. 292)",
    maternity: "(R.A. No. 11210/IRR issued by CSC, DOLE and SSS)",
    paternity: "(R.A. No. 8187/CSC MC No. 71, s. 1998, as amended)",
    spl: "(Sec. 21, Rule XV, Omnibus Rules Implementing E.O. No. 292)",
    solo: "(R.A. No. 8972/CSC MC No. 8, s. 2004)",
    study: "(Sec. 68, Rule XV, Omnibus Rules Implementing E.O. No. 292)",
    vowc: "(R.A. No. 9262/CSC MC No. 15, s. 2005)",
    rehabilitation: "(Sec. 56, Rule XV, Omnibus Rules Implementing E.O. No. 292)",
    slbw: "(R.A. No. 9710/CSC MC No. 25, s. 2010)",
    emergency: "(CSC MC No. 2, s. 2012, as amended)",
    adoption: "(R.A. No. 8552)",
    others: "",
} as const;

export type LEAVETYPEKEYS = keyof typeof LEAVETYPESOBJ;

export const LEAVETYPEKEYSARRAY = [
    "vacation", "mandatory", "sick", "maternity", "paternity",
    "spl", "solo", "study", "vowc", "rehabilitation",
    "slbw", "emergency", "adoption", "others"
  ] as const
