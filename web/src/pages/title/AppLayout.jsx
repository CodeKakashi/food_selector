import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import TitleBar from "./TitleBar.jsx";
import AppFooter from "./AppFooter.jsx";

const { Content } = Layout;

const AppLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <TitleBar />
      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default AppLayout;
