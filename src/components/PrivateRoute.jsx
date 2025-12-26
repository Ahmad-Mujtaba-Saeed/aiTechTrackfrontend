// src/components/PrivateRoute.jsx
import React, { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import axios from "../utils/axios";

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

  // Always declare hooks at top — effect below will run consistently
  useEffect(() => {
    // Don't attempt anything if:
    // - No token (we'll redirect to sign-in elsewhere)
    // - User data not loaded yet
    // - We're on the subscription route already
    // - We've already initiated subscription creation
    if (!token || !data || subscriptionInitiatedRef.current) return;

    // Allow upload-profile and subscription pages without forcing plan creation
    const path = location.pathname;
    if (path === "/upload-profile" || path === "/subscription") return;

    // If user has no plan_id, we need to create a subscription session
    if (!data.plan_id && data.trial_used == 0) {
      subscriptionInitiatedRef.current = true; // prevent re-entry
      const createSession = async () => {
        try {
          setLoading(true);
          // Use a default plan slug or id if you want a fallback. Here we assume backend can handle missing param.
          // IMPORTANT: don't use data.plan_id here because it's null.
          const planIdentifier = "default"; // or choose a real fallback plan id
          const response = await axios.get(`/api/billing/stripe/create-subscription-session/2?isFreeTrial=true`);
          const checkoutUrl = response?.data?.checkoutUrl || response?.data?.url || null;
          if (checkoutUrl) {
            // Navigate to Stripe hosted checkout (hard navigation is fine here)
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
    else if(!data.plan_id){
      window.location.href = "/subscription"
    }
  }, [token, data, location.pathname]);

  // 1) while app is determining auth state or while we are preparing redirect -> spinner
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

  // 3) if user data still not loaded, render nothing (or a spinner)
  if (!data) {
    return null;
  }

  // 4) If we've decided to redirect to internal subscription page, do it once
  if (shouldRedirectToSubscription) {
    return <Navigate to="/subscription" state={{ from: location }} replace />;
  }

  // 5) Allow certain public/protected exceptions
  if (location.pathname === "/upload-profile" || location.pathname === "/subscription") {
    return children;
  }

  // 6) If user still has no plan_id and we didn't navigate away, show subscription link
  // (This is a fallback if the session creation didn't redirect)
  if (!data.plan_id) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 7) All checks passed: render protected content
  return children;
};

export default PrivateRoute;
