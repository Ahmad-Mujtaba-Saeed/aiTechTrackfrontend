import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum from "../../components/BreadCrum";

import DashboardComponents from '../../components/Dashboard/ControlComponents';
import GettingStarted from '../../components/Dashboard/GettingStarted';
import HowToLearn from '../../components/Dashboard/HowToLearn';

const GetStarted = () => {
  return (
    <>
      <MasterLayout>
        <BreadCrum title='Getting Started' subTitle='The UK’s first all-in-one AI platform for tailored CVs, instant job matching, and interview prep.' />
        <DashboardComponents />


        <div className="my-4" style={{translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1}}>
          <div className="row g-3">
            <div className="col-12 col-xl-6">
              <GettingStarted />
            </div>
            <div className="col-12 col-xl-6">
              <HowToLearn />
            </div>
          </div>
        </div>


      </MasterLayout>
    </>
  );
};

export default GetStarted;
