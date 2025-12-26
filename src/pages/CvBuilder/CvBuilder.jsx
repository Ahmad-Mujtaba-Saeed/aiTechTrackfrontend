import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum from "../../components/BreadCrum";
import BuildingComponents from "../../components/CvBuilder/BuildingComponents";

const CvBuilder = () => {
  return (
    <>
      <MasterLayout>
        <BreadCrum title='Upload existing CV or build a new one with MyPathfinder' subTitle='Every role deserves a tailored application. We make it effortless.' />
        <BuildingComponents />
      </MasterLayout>
    </>
  );
};

export default CvBuilder;
