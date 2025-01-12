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

export type LEAVETYPEKEYS = keyof typeof LEAVETYPESOBJ;

export const LEAVETYPEKEYSARRAY = [
    "vacation", "mandatory", "sick", "maternity", "paternity",
    "spl", "solo", "study", "vowc", "rehabilitation",
    "slbw", "emergency", "adoption", "others"
  ] as const
