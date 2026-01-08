import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum from "../../components/BreadCrum";
import BuildingComponents from "./components/BuildingComponents";

const CvBuilder = () => {

  const icon = (<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-cloud-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 18.004h-5.343c-2.572 -.004 -4.657 -2.011 -4.657 -4.487c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.38 0 2.57 .811 3.128 1.986" /><path d="M19 22v-6" /><path d="M22 19l-3 -3l-3 3" /></svg>)
  return (
    <>
      <MasterLayout>
        <BreadCrum title='Upload existing CV or build a new one with Cv Builder' subTitle='Every role deserves a tailored application. We make it effortless.' icon={icon} />
      <BuildingComponents />
      </MasterLayout>
    </>
  );
};

export default CvBuilder;
