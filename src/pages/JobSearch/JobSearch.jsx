import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum from "../../components/BreadCrum";
import VacanciesList from "../../components/JobSearch/VacencyList";

const JobSearch = () => {
  return (
    <>
      <MasterLayout>
        <BreadCrum title='Job Search' subTitle='Find roles that align with your experience, strengths and goals.' />
        <VacanciesList />
      </MasterLayout>
    </>
  );
};

export default JobSearch;
