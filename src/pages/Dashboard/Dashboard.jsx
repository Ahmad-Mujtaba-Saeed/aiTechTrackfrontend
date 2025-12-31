import React, { useEffect, useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum from "../../components/BreadCrum";

import DashboardComponents from '../../components/Dashboard/ControlComponents';


const Dashboard = () => {

  return (
    <MasterLayout>
      <BreadCrum title='Getting Started' subTitle='The UK’s first all-in-one AI platform for tailored CVs, instant job matching, and interview prep.' />
      <DashboardComponents />
    </MasterLayout>
  );
};

export default Dashboard;
