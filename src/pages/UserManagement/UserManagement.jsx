import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum from "../../components/BreadCrum";

import Users from "./components/Users";

const UserManagement = () => {
    return (
        <MasterLayout>
            <BreadCrum title='User Management' subTitle='' />
            <Users />
        </MasterLayout>
    );
};

export default UserManagement;