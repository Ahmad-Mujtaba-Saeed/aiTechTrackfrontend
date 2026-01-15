import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import PrivateRoute from "./components/PrivateRoute";
// If you're using createBrowserRouter
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Pages
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard/Dashboard";

import CvBuilder from "./pages/CvBuilder/CvBuilder";
import CvGenerate from "./pages/CvBuilder/CvGenerate";

import PaymentPlans from "./pages/PaymentPlans/PaymentPlans";
import Support from "./pages/Support/Support";

import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Verification from "./pages/Auth/Verification";
import F2Verification from "./pages/Auth/F2Verification";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import UpdatePassword from "./pages/Auth/UpdatePassword";
import Welcome from "./pages/Welcome";

import TermsCondition from "./pages/TermsPolicy/Terms";
import PrivacyPolicy from "./pages/TermsPolicy/Privacy";

import ProfileSetting from "./pages/Profile/ProfileSetting";
import ProfilePage from "./pages/Profile/Profile";
import CareerAdvice from "./pages/CareerAdvice/CareerAdvice";

import { useDispatch, useSelector } from "react-redux";
import { login, getUser, logout } from "./features/user/userSlice";
import SubscribePlan from "./pages/Subscription/SubscribePlan";
import UpgradeSubscribePlan from "./pages/Subscription/UpgradeSubscribePlan";

import UserManagement from "./pages/UserManagement/UserManagement";
import TransactionsManagement from "./pages/Billing/TransactionsManagement";
import SubscriptionManagement from "./pages/Subscriptions/SubscriptionManagement";
import CoreSettingsManagement from "./pages/CoreSettings/CoreSettingsManagement";
import PlanManagement from "./pages/PlanSettings/PlanManagement"

import Career from "./pages/CareerAdvice";
import SignOut from "./pages/Auth/SignOut";



// const Loader = () => (
//   <div id="preloader">
//     <div id="loader"></div>
//   </div>
// );

const PageWrapper = ({ children }) => {

  const dispatch = useDispatch();
  const { data, bootstrapping, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

return children;
};

const publicRoutes = [
  { path: '/sign-in', element: <SignIn /> },
  { path: '/sign-up', element: <SignUp /> },
  { path: '/verification', element: <Verification /> },
  { path: '/2f-verification', element: <F2Verification /> },
  { path: '/forget-password', element: <ForgetPassword /> },
  { path: '/update-password', element: <UpdatePassword /> },
  { path: '/terms', element: <TermsCondition /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
  { path: '/career-advice', element: <Career /> },
  { path: '*', element: <ErrorPage /> },
  { path: '/sign-out', element: <SignOut /> },
];

const protectedRoutes = [
  { path: '/', element: <Dashboard /> },
  { path: '/welcome', element: <Welcome /> },
  { path: '/career-advice', element: <CareerAdvice /> },
  { path: '/upgrade-subscription', element:<UpgradeSubscribePlan/> },
  { path: '/subscription', element:<SubscribePlan/> },
  { path: '/cv-builder', element: <CvBuilder /> },
  { path: '/cv-generate/:id', element: <CvGenerate /> },
  { path: '/payment-plans', element: <PaymentPlans /> },
  { path: '/support', element: <Support /> },
  { path: '/profile-settings', element: <ProfileSetting /> },
  { path: '/profile', element: <ProfilePage /> },

  { path: '/manage-users', element: <UserManagement /> },
  { path: '/billing/transactions', element: <TransactionsManagement /> },
  { path: '/billing/subscriptions', element: <SubscriptionManagement /> },
  { path:'/billing/plan-management', element: <PlanManagement /> },
  { path: '/core-settings', element: <CoreSettingsManagement /> },
];


function App() {
  return (
    <BrowserRouter>
      <PageWrapper>
        <ToastContainer />
        <Routes>
          {/* Public routes */}
          {publicRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          {/* Protected routes */}
          {protectedRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <PrivateRoute>
                  {route.element}
                </PrivateRoute>
              }
            />
          ))}
        </Routes>
      </PageWrapper>
    </BrowserRouter>
  );
}


export default App;