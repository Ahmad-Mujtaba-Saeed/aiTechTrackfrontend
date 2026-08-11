import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum from "../../components/BreadCrum";

import Subscriptions from "./components/Subscriptions";

const SubscriptionManagement = () => {
    return (
        <MasterLayout>
            <BreadCrum title='Subscriptions' subTitle='Manage All Subscriptions' />
            <Subscriptions />
        </MasterLayout>
    );
};

export default SubscriptionManagement;