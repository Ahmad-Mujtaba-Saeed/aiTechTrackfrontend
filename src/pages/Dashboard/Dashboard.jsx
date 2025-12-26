import React, { useEffect, useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import BreadCrum from "../../components/BreadCrum";

import DashboardComponents from '../../components/Dashboard/ControlComponents';
import InterviewHistory from '../../components/Dashboard/InterviewHistoryComponent';
import Activity from '../../components/Dashboard/Activity';
import ApplicationHistory from '../../components/Dashboard/ApplicationHistoryComponent';
import ApplicationTracking from "../../components/ApplicationTracking";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setParsedFeedback, fetchInterviewHistory } from "../../features/interview/interviewSlice";
import { getAllCompletedSteps } from "../../features/user/userSlice";
import GettingStarted from '../../components/Dashboard/GettingStarted';
import HowToLearn from '../../components/Dashboard/HowToLearn';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllCompletedSteps());
  }, [dispatch]);
  // const { parsedFeedback , setParsedFeedback} = useContext(FeedbackContext);
  const { parsedFeedback, history } = useSelector((state) => state.interview);
  // const { parsedResume , setParsedResume} = useResume();
  // const [interviewHistory, setInterviewHistory] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const { data, completedSteps } = useSelector((state) => state.user);



  //   const getInterviewHistory = async (searchTerm = "") => {
  //     try {
  //         const response = await axios.get(`/api/interview/history?limit=6&searchTerm=${searchTerm}`);
  //         setInterviewHistory(response.data);
  //     } catch (error) {
  //         console.error("Error fetching interview history:", error);
  //     }
  // };

  const getRecentActivities = async () => {
    try {
      const response = await axios.get(`/api/recent-activities?limit=3`);
      setRecentActivities(response.data);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
    }
  };

  const handleViewDetails = (item) => {
    console.log('Viewing details for interview:', item.id);
    dispatch(setParsedFeedback(item));
    navigate(`/question-feedback`);
  };

  const handleRetry = (interviewId) => {
    navigate(`/prepration/${interviewId}`);
    console.log('Retrying interview:', interviewId);
  };



  useEffect(() => {
    dispatch(fetchInterviewHistory());
    getRecentActivities();
  }, []);

  // const handleSearch = (searchTerm) => {
  //   if(searchTerm){
  //     fetchInterviewHistory(searchTerm);
  //   }
  // };

  const handleRedirectActivity = (activity) => {
    console.log('Redirecting to activity:', activity?.id);
    if (activity?.type == 'resume') {
      setParsedResume(activity?.resume?.cv_resumejson);
      navigate(`/cv-builder`);
    } else if (activity?.type == 'interview') {
      setParsedFeedback(activity?.interview);
      navigate(`/dashboard/question-feedback`);
    }
  };


  return (
    <>
      {(completedSteps?.sign_up == true &&
        completedSteps?.first_cv == true &&
        completedSteps?.first_interview == true &&
        completedSteps?.progress_tracker == true &&
        completedSteps?.applied_job == true) ?

        <MasterLayout>
          <BreadCrum title={`Welcome to MyPathfinder, ${data?.name}`} subTitle='The UK’s first all-in-one AI platform for tailored CVs, instant job matching, and interview prep.' />
          <DashboardComponents />
          <div className=" my-4" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>
            <div className="row g-3">
              <div className="col-12 col-xl-6 col-xxl-7">
                <InterviewHistory interviewHistory={history} handleViewDetails={handleViewDetails} handleRetry={handleRetry} />
              </div>
              <div className="col-12 col-xl-6 col-xxl-5">
                <Activity recentActivities={recentActivities} handleViewDetails={handleViewDetails} />
              </div>
            </div>
          </div>

          <ApplicationTracking />

        </MasterLayout>
        :
        <MasterLayout>
          <BreadCrum title='Getting Started' subTitle='The UK’s first all-in-one AI platform for tailored CVs, instant job matching, and interview prep.' />
          <DashboardComponents />


          <div className="my-4" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>
            <div className="row g-3">
              <div className="col-12 col-xl-6">
                <GettingStarted completedSteps={completedSteps} />
              </div>
              {/* <div className="col-12 col-xl-6">
                <HowToLearn />
              </div> */}
            </div>
          </div>


        </MasterLayout>

      }



    </>
  );
};

export default Dashboard;
