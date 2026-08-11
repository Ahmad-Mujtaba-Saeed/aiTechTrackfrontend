import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum from "../../components/BreadCrum";

import PlanSettings from "./components/PlanSettings";

const PlanManagement = () => {
    return (
        <MasterLayout>
            
            <PlanSettings />
        </MasterLayout>
    );
};

export default PlanManagement;