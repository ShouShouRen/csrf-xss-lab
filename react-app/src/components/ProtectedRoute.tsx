import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenValid } from "../utils/token";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.warn("No token found in localStorage");
        setIsValid(false);
        navigate("/login");
        return;
      }

      // 先檢查 token 是否過期
      if (!isTokenValid(token)) {
        console.warn("Token has expired");
        localStorage.removeItem("access_token");
        setIsValid(false);
        navigate("/login");
        return;
      }

      try {
        console.log("Validating token...");
        const response = await axios.get("http://localhost:3000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Token validation successful:", response.data);
        setIsValid(true);
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.removeItem("access_token");
        setIsValid(false);
        navigate("/login");
      }
    };

    validateToken();
  }, [navigate]);

  if (isValid === null) {
    return <div>Loading...</div>;
  }

  if (!isValid) {
    return null;
  }

  return <>{children}</>;
}
