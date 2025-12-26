import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum  from "../../components/BreadCrum";

const PaymentPlans = () => {
  return (
    <>
      <MasterLayout>
        <BreadCrum title='Payment Plans' subTitle='Manage your subscription details, all in one place.' />
        <div className="row  mt-5">
        <div className="col-md-6">
          <div className="card text-center shadow-sm border">
            <div className="card-header bg-light">
              <ul className="nav nav-pills justify-content-center" id="pricingTabs" role="tablist">
                <li className="nav-item">
                  <button className="nav-link active" id="weekly-tab" data-bs-toggle="pill" data-bs-target="#weekly" type="button" role="tab">
                    Weekly
                  </button>
                </li>
                <li className="nav-item">
                  <button className="nav-link" id="monthly-tab" data-bs-toggle="pill" data-bs-target="#monthly" type="button" role="tab">
                    Monthly
                  </button>
                </li>
                <li className="nav-item">
                  <button className="nav-link" id="quarterly-tab" data-bs-toggle="pill" data-bs-target="#quarterly" type="button" role="tab">
                    Quarterly
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <div className="tab-content" id="pricingTabsContent">
                <div className="tab-pane fade show active" id="weekly" role="tabpanel">
                  <h2 className="display-5 fw-bold text-primary">£5</h2>
                  <p className="text-body-tertiary">per week</p>
                  <button className="btn btn-primary w-100">Choose Weekly</button>
                </div>
                <div className="tab-pane fade" id="monthly" role="tabpanel">
                  <h2 className="display-5 fw-bold text-primary">£15</h2>
                  <p className="text-body-tertiary">per month</p>
                  <button className="btn btn-primary w-100">Choose Monthly</button>
                </div>
                <div className="tab-pane fade" id="quarterly" role="tabpanel">
                  <h2 className="display-5 fw-bold text-primary">£35</h2>
                  <p className="text-body-tertiary">per quarter</p>
                  <button className="btn btn-primary w-100">Choose Quarterly</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </MasterLayout>
    </>
  );
};

export default PaymentPlans;
