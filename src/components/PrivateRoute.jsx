// src/components/PrivateRoute.jsx

import React, { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import axios from "../api/axios";
import { hasPermission } from "../utils/permissions";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  const { data, accessToken, bootstrapping } = useSelector(
    (state) => state.user
  );

  const [loading, setLoading] = useState(false);
  const [shouldRedirectToSubscription, setShouldRedirectToSubscription] =
    useState(false);

  const subscriptionInitiatedRef = useRef(false);

  const token = accessToken || localStorage.getItem("access_token");

  const hasSystemInternalPermission = hasPermission(
    data,
    "system-internal"
  );

  useEffect(() => {
    console.log("========================================");
    console.log("PrivateRoute Loaded");
    console.log("Current Path:", location.pathname);
    console.log("Token:", token);
    console.log("Bootstrapping:", bootstrapping);
    console.log("User Data:", data);
    console.log("Plan ID:", data?.plan_id);
    console.log("Trial Used:", data?.trial_used);
    console.log("Has Internal Permission:", hasSystemInternalPermission);
    console.log("========================================");

    if (!token || !data || subscriptionInitiatedRef.current) {
      console.log("Stopped because:");
      console.log("Token exists?", !!token);
      console.log("User exists?", !!data);
      console.log(
        "Already initiated?",
        subscriptionInitiatedRef.current
      );
      return;
    }

    const path = location.pathname;

    if (
      path === "/upload-profile" ||
      path === "/subscription" ||
      path === "/welcome"
    ) {
      console.log("Allowed page:", path);
      return;
    }

    console.log("Checking subscription...");
    console.log({
      plan_id: data.plan_id,
      trial_used: data.trial_used,
      hasSystemInternalPermission,
    });

    if (
      !data.plan_id &&
      data.trial_used == 0 &&
      !hasSystemInternalPermission
    ) {
      console.log("Creating Stripe Checkout Session...");

      subscriptionInitiatedRef.current = true;

      const createSession = async () => {
        try {
          setLoading(true);

          const response = await axios.get(
            "/billing/stripe/create-subscription-session/2?isFreeTrial=true"
          );

          console.log("Stripe Session Response:", response.data);

          const checkoutUrl =
            response?.data?.checkoutUrl ||
            response?.data?.url ||
            null;

          console.log("Checkout URL:", checkoutUrl);

          if (checkoutUrl) {
            console.log("Redirecting to Stripe Checkout...");
            window.location.href = checkoutUrl;
            return;
          }

          console.error("No checkout URL returned.");
          setShouldRedirectToSubscription(true);
        } catch (err) {
          console.error("Stripe Session Error:", err);
          console.error("Response:", err?.response?.data);
          setShouldRedirectToSubscription(true);
        } finally {
          setLoading(false);
        }
      };

      createSession();
    } else if (!data.plan_id && !hasSystemInternalPermission) {
      console.log(
        "User has no plan but trial already used. Redirecting to subscription page."
      );
      window.location.href = "/subscription";
    } else {
      console.log("User already has a plan:", data.plan_id);
    }
  }, [token, data, location.pathname]);

  if (bootstrapping || loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  if (!token) {
    console.log("No token found. Redirecting to Sign In.");
    return (
      <Navigate
        to="/sign-in"
        state={{ from: location }}
        replace
      />
    );
  }

  if (!data) {
    console.log("Waiting for user data...");
    return null;
  }

  if (shouldRedirectToSubscription) {
    console.log("Redirecting to Subscription page.");
    return (
      <Navigate
        to="/subscription"
        state={{ from: location }}
        replace
      />
    );
  }

  if (
    location.pathname === "/upload-profile" ||
    location.pathname === "/subscription"
  ) {
    return children;
  }

  if (!data.plan_id && !hasSystemInternalPermission) {
    console.log("Redirecting to Home because no plan exists.");
    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    );
  }

  console.log("Access Granted.");
  return children;
};

export default PrivateRoute;