import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum from "../../components/BreadCrum";

import Transactions from "./components/Transactions";

const TransactionsManagement = () => {
    return (
        <MasterLayout>
            <BreadCrum title='Transactions' subTitle='Manage payment transactions' />
            <Transactions />
        </MasterLayout>
    );
};

export default TransactionsManagement;