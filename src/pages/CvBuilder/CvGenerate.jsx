import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import GenerateCv from "./components/GenerateCv";

export default function CvGenerate() {
  return (
    <MasterLayout>
        {/* <BreadCrum title='Smart CV Builder' subTitle='Tailor your CV to any job in seconds. Just upload and optimise.' /> */}
        <GenerateCv />
      </MasterLayout>
  )
}
