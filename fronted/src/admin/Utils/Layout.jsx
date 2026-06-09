import React from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const Layout = ({ children }) => {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

export default Layout;