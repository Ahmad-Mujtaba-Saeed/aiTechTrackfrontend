// src/components/GoogleSignIn.jsx
import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import axios from "../../utils/axios";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { googleSignIn } from "../../features/user/userSlice";

export default function GoogleSignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function handleGoogleSignIn() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Get Firebase ID token (JWT)
      const idToken = await result.user.getIdToken(/* forceRefresh = */ true);

      const formData = new FormData();
      formData.append("idToken", idToken);

      // // Send token to your Laravel backend
      // const res = await axios.post("/api/auth/firebase", {
      //   idToken
      // });
      // const data = await res.data;
      // // data should include your Laravel auth token / user details
      // console.log("Backend response:", data);
      const response = await dispatch(googleSignIn(formData)).unwrap();
      navigate("/");
      console.log(response);
    } catch (err) {
      console.error("Google sign-in error", err);
    }
  }

  return <Button variant="light" className="w-100 mb-3 gap-2 d-flex align-items-center justify-content-center border google-btn" onClick={handleGoogleSignIn}>
                    <svg width={13} className="me-2 text-danger" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    sign in with Google
                  </Button>;
}
