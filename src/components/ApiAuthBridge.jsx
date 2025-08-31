import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setTokenProvider } from "../lib/api";

export default function ApiAuthBridge() {
  const { getToken } = useAuth();
  useEffect(() => {
    setTokenProvider(() => getToken({ template: "simmer" })); 
  }, [getToken]);
  return null;
}
