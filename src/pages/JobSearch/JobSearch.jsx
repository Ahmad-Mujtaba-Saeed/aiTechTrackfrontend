import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum from "../../components/BreadCrum";

const JobSearch = () => {
  return (
    <>
      <MasterLayout>
        <BreadCrum title='Job Search' subTitle='Find roles that align with your experience, strengths and goals.' />
       
      </MasterLayout>
    </>
  );
};

export default JobSearch;
