import Header, { TableHeader, TableRow } from "@/Components/Header";
import {
    PaginateProvider,
    usePagination,
} from "@/Components/Provider/paginate-provider";
import SearchInput from "@/Components/SearchInput";
import TableDataSkeletonLoader from "@/Components/TableDataSkeletonLoader";
import { Card } from "@/Components/ui/card";
import {
    FilterButton,
    FilterItem,
    MenubarLabel,
    SortButton,
    SortItem,
} from "@/Components/ui/menubar";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { APPROVALTYPE, PAGINATEDDATA, User } from "@/Types";
import React, { Fragment, useState } from "react";
import Empty from "@/Components/Empty";
import empty from "@/Assets/empty-file.svg";
import { Eye } from "iconsax-react";
import { Button } from "@/Components/ui/button";
import { TooltipLabel } from "@/Components/ui/tooltip";
import { cn } from "@/Lib/utils";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { format } from "date-fns";
import LocatorSlip from "@/Pages/LocatorSlip/LocatorSlip";

type LOCATORSLIPTYPE = {
    id: number;
    user: User;
    dateoffiling: string;
    station: string;
    purposeoftravel: string;
    option: "business" | "time";
    destination: string;
    agenda: string;
    status: APPROVALTYPE;
};

type LocatorSlipProps = {};

const LocatorSlipPrincipal: React.FC<
    LocatorSlipProps & { locatorslips: PAGINATEDDATA<LOCATORSLIPTYPE> }
> = (props) => <LocatorSlip {...props} />;

export default LocatorSlipPrincipal;
