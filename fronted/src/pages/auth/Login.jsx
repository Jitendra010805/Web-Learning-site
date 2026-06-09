import React, { useState, useEffect } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { CourseData } from "../../context/CourseContext";
import { MdAccountCircle, MdArrowBack } from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();
  const { btnLoading, loginUser } = UserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [recentAccounts, setRecentAccounts] = useState([]);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentAccounts")) || [];
    if (saved.length > 0) {
      setRecentAccounts(saved);
      setShowAccountSelector(true);
    }
  }, []);

  const { fetchMyCourse } = CourseData();

  const submitHandler = async (e) => {
    e.preventDefault();
    await loginUser(email, password, navigate, fetchMyCourse);
  };

  const handleAccountSelect = (acc) => {
    setSelectedAccount(acc);
    setEmail(acc.email);
    setShowAccountSelector(false);
  };

  const clearSelection = () => {
    setSelectedAccount(null);
    setEmail("");
    setShowAccountSelector(recentAccounts.length > 0);
  };

  const useAnotherAccount = () => {
    setSelectedAccount(null);
    setEmail("");
    setShowAccountSelector(false);
  };

  const removeAccount = (e, emailToRemove) => {
    e.stopPropagation();
    const updated = recentAccounts.filter(acc => acc.email !== emailToRemove);
    setRecentAccounts(updated);
    localStorage.setItem("recentAccounts", JSON.stringify(updated));
    if (updated.length === 0) {
      setShowAccountSelector(false);
    }
  };

  return (
    <div className="main-content">
      <div className="auth-page">
        <div className="auth-form">
          {showAccountSelector ? (
            <div className="account-selector fade-in">
              <h2>Choose an account</h2>
              <p className="auth-sub">to continue to E-Learning</p>
              
              <div className="recent-accounts-list">
                {recentAccounts.map((acc, index) => (
                  <div key={index} className="recent-account-card" onClick={() => handleAccountSelect(acc)}>
                    <div className="ra-avatar">{acc.name.charAt(0).toUpperCase()}</div>
                    <div className="ra-info">
                      <span className="ra-name">{acc.name}</span>
                      <span className="ra-email">{acc.email}</span>
                    </div>
                    <button type="button" className="ra-remove" onClick={(e) => removeAccount(e, acc.email)}>✕</button>
                  </div>
                ))}
                
                <div className="recent-account-card use-another" onClick={useAnotherAccount}>
                  <div className="ra-avatar alt"><MdAccountCircle size={24} /></div>
                  <div className="ra-info">
                    <span className="ra-name" style={{fontWeight: 600}}>Use another account</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="fade-in">
              {selectedAccount ? (
                <div className="selected-account-header">
                  <button type="button" className="back-btn" onClick={clearSelection}>
                     <MdArrowBack size={20} />
                  </button>
                  <div className="sa-profile">
                    <div className="ra-avatar">{selectedAccount.name.charAt(0).toUpperCase()}</div>
                    <span className="sa-email">{selectedAccount.email}</span>
                  </div>
                  <h2 style={{marginBottom: "20px"}}>Welcome back</h2>
                </div>
              ) : (
                <h2>Login</h2>
              )}
              
              <form onSubmit={submitHandler}>
                {!selectedAccount && (
                  <>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </>
                )}

                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus={!!selectedAccount}
                />

                <button disabled={btnLoading} type="submit" className="common-btn">
                  {btnLoading ? "Please Wait..." : "Login"}
                </button>
              </form>
              
              {!selectedAccount && (
                <p>
                  Don't have an account? <Link to="/register">Register</Link>
                </p>
              )}
              <p style={{marginTop: selectedAccount ? '20px' : '30px'}}>
                <Link to="/forgot">Forgot password?</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;