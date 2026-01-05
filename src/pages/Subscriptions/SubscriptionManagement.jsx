import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum from "../../components/BreadCrum";

import Subscriptions from "./components/Subscriptions";

const SubscriptionManagement = () => {
    return (
        <MasterLayout>
            <BreadCrum title='Subscriptions' subTitle='' />
            <Subscriptions />
        </MasterLayout>
    );
};

export default SubscriptionManagement;