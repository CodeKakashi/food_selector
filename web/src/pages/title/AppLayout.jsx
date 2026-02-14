import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import TitleBar from "./TitleBar.jsx";
import AppFooter from "./AppFooter.jsx";
import "./title.css";

const { Content } = Layout;

const AppLayout = () => {
  return (
    <Layout className="app-shell" style={{ minHeight: "100vh" }}>
      <TitleBar />
      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default AppLayout;
