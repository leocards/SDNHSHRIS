import { PAGINATEDDATA } from "@/Types";
import React from "react";
import LocatorSlip, { LOCATORSLIPTYPE } from "@/Pages/LocatorSlip/LocatorSlip";


type LocatorSlipProps = {};

const LocatorSlipPrincipal: React.FC<
    LocatorSlipProps & { locatorslips: PAGINATEDDATA<LOCATORSLIPTYPE> }
> = (props) => <LocatorSlip {...props} />;

export default LocatorSlipPrincipal;
