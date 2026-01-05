import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum from "../../components/BreadCrum";

import CoreSettings from "./components/CoreSettings";

const CoreSettingsManagement = () => {
    return (
        <MasterLayout>
            <BreadCrum title='Core Settings' subTitle='' />
            <CoreSettings />
        </MasterLayout>
    );
};

export default CoreSettingsManagement;