import { createContext, useContext, useEffect, useState } from "react";
import API from "../api";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // ----------------- LOGIN -----------------
  async function loginUser(email, password, navigate, fetchMyCourse) {
    setBtnLoading(true);
    try {
      const { data } = await API.post("/api/user/login", { email, password });
      toast.success(data.message);

      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);

      if (fetchMyCourse) fetchMyCourse();
      navigate("/");
    } catch (error) {
      setBtnLoading(false);
      setIsAuth(false);
      toast.error(error.response?.data?.message || error.message);
    }
  }

  // ----------------- REGISTER -----------------
  async function registerUser(name, email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await API.post("/api/user/register", { name, email, password });

      toast.success(data.message);

      localStorage.setItem("activationToken", data.activationToken);
      setBtnLoading(false);
      navigate("/verify");
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response?.data?.message || error.message);
    }
  }

  // ----------------- OTP VERIFICATION -----------------
  async function verifyOtp(otp, navigate) {
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");

    try {
     const { data } = await API.post("/api/user/verify", { otp, activationToken });

      toast.success(data.message);

      localStorage.removeItem("activationToken");
      setBtnLoading(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setBtnLoading(false);
    }
  }

  // ----------------- FETCH LOGGED-IN USER -----------------
  async function fetchUser() {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuth(false);
      setLoading(false);
      return;
    }

    try {
     const { data } = await API.get("/api/user/me");

      setUser(data.user);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.error("fetchUser error:", error.response?.data || error.message);
      setIsAuth(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        btnLoading,
        loading,
        loginUser,
        registerUser,
        verifyOtp,
        fetchUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
