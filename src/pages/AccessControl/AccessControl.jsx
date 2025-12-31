import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum from "../../components/BreadCrum";

import Permissionss from "../../components/AccessControlComponents/Permissions";
import Roles from "../../components/AccessControlComponents/Roles";
import AssignRoles from "../../components/AccessControlComponents/AssignRoles";

const AccessControl = () => {
    return (
        <MasterLayout>
            <BreadCrum title='Access Control' subTitle='' />
            <Permissionss />
            <Roles />
            <AssignRoles />
        </MasterLayout>
    );
};

export default AccessControl;