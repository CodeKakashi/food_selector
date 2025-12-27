import React from "react";
import { Layout, Button, Space, Typography, Avatar } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DishImage from "../dashboard/dishImage";

const { Header } = Layout;
const { Text } = Typography;

const TitleBar = () => {
  const navigate = useNavigate();

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Space
        align="center"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <Avatar size={40} shape="circle" style={{ background: "transparent" }}>
          <DishImage name="cat" />
        </Avatar>
        <Text strong style={{ fontSize: 16 }}>
          Food Selector
        </Text>
      </Space>

      <Button icon={<HomeOutlined />} onClick={() => navigate("/")}>
        Home
      </Button>
    </Header>
  );
};

export default TitleBar;
