import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import Login from "./pages/Login.jsx";
import Feed from "./pages/Feed.jsx";
import Discover from "./pages/Discover.jsx";
import Profile from "./pages/Profile.jsx";
import ToastHost from "./components/ToastHost.jsx";
import ApiAuthBridge from "./components/ApiAuthBridge.jsx";
import DemoControls from "./components/DemoControls.jsx";


const DEV_BYPASS = import.meta.env.VITE_DEV_BYPASS_AUTH === "true";

function Protected({ children }) {
  if (DEV_BYPASS) return children; 
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function Gate() {
 
  if (DEV_BYPASS) return <Navigate to="/feed" replace />;
  return (
    <>
      <SignedIn>
        <Navigate to="/feed" replace />
      </SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/sign-in" element={<Login />} />

       
        <Route
          path="/feed"
          element={
            <Protected>
              <Feed />
            </Protected>
          }
        />
        <Route
          path="/discover"
          element={
            <Protected>
              <Discover />
            </Protected>
          }
        />
        <Route
          path="/profile/:handle"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />

        
        <Route path="*" element={<Gate />} />
      </Routes>
      <ToastHost/>
      <ApiAuthBridge />
        <DemoControls />
    </BrowserRouter>
  );
}
