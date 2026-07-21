// src/components/PrivateRoute.jsx
import React, { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import axios from "../api/axios";
import { hasPermission } from "../utils/permissions";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { data, accessToken, bootstrapping } = useSelector((state) => state.user);

  // Local UI state
  const [loading, setLoading] = useState(false);
  const [shouldRedirectToSubscription, setShouldRedirectToSubscription] = useState(false);

  // Guard to ensure we only initiate the subscription call once per mount
  const subscriptionInitiatedRef = useRef(false);

  // token (redux or fallback to localStorage)
  const token = accessToken || localStorage.getItem("access_token");

  const hasSystemInternalPermission = hasPermission(data, 'system-internal');
  // Always declare hooks at top — effect below will run consistently
  useEffect(() => {
    if (!token || !data || subscriptionInitiatedRef.current) return;

    const path = location.pathname;
   if (
    path === "/upload-profile" ||
    path === "/subscription" ||
    path === "/welcome"
)  return;

    if (!data.plan_id && data.trial_used == 0 && !hasSystemInternalPermission) {
      subscriptionInitiatedRef.current = true; // prevent re-entry
      const createSession = async () => {
        try {
          setLoading(true);
          const planIdentifier = "default";
          const response = await axios.get(`/billing/stripe/create-subscription-session/2?isFreeTrial=true`);
          const checkoutUrl = response?.data?.checkoutUrl || response?.data?.url || null;
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
            return;
          } else {
            console.error("No checkout URL returned from backend", response);
            // fallback to internal subscription page
            setShouldRedirectToSubscription(true);
          }
        } catch (err) {
          console.error("Error creating subscription session:", err);
          setShouldRedirectToSubscription(true);
        } finally {
          setLoading(false);
        }
      };

      createSession();
    }
    else if(!data.plan_id && !hasSystemInternalPermission){
      window.location.href = "/subscription"
    }
  }, [token, data, location.pathname]);


  if (bootstrapping || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" />
      </div>
    );
  }

  // 2) if no token -> go to sign in
  if (!token) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (!data) {
    return null;
  }

  if (shouldRedirectToSubscription) {
    return <Navigate to="/subscription" state={{ from: location }} replace />;
  }

  if (location.pathname === "/upload-profile" || location.pathname === "/subscription") {
    return children;
  }

  if (!data.plan_id && !hasSystemInternalPermission) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;