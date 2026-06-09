import React from "react";
import { 
  LayoutDashboard, 
  LogOut, 
  User, 
  Mail, 
  ShieldCheck 
} from "lucide-react";
import { motion } from "framer-motion";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Account = ({ user }) => {
  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  // Safety first: handle potential undefined user properties
  const userName = user?.name || "Guest User";
  const userEmail = user?.email || "No email provided";
  const userId = user?._id || "";

  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };

  if (!user && !userName) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#1e3a8a] via-[#581c87] to-[#020617] relative overflow-hidden">
      {/* Decorative Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-lg w-full z-10"
      >
        <header className="mb-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent px-4 py-2 drop-shadow-sm"
          >
            My Profile
          </motion.h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2 rounded-full opacity-60" />
        </header>

        <div className="relative group">
          {/* Card Outer Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
              {/* Circular Avatar with Glow */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-slate-900">
                    <User className="w-12 h-12 text-blue-400" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 p-2 rounded-full border-2 border-slate-900 shadow-lg">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* User Details */}
              <div className="flex flex-col text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1">{userName}</h3>
                <div className="flex items-center justify-center md:justify-start gap-2 text-white/70 mb-4">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <p className="text-sm font-medium truncate max-w-[200px]">{userEmail}</p>
                </div>
                <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full w-fit mx-auto md:mx-0">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Active Member</span>
                </div>
              </div>
            </div>

            {/* Horizontal Row of Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => userId && navigate(`/${userId}/dashboard`)}
                disabled={!userId}
                className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-[0_4px_20px_rgba(59,130,246,0.25)] transition-all duration-300 disabled:opacity-50"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={logoutHandler}
                className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-[0_4px_20px_rgba(225,29,72,0.25)] transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Account;
