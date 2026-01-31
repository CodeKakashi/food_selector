import React from "react";
import { Layout, Button, Space, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../../logo.svg";
import { Image } from "antd";
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
      <Space align="center" size="middle"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}>
        <div
          style={{
            width: 60,
            height: 80,
            borderRadius: 10,
            display: "grid",
            placeItems: "center",
          }}
          aria-hidden
        >
          <Image
            src={logo}
            alt="Thenu's Cook Book logo"
            preview={false}
            style={{ width: 60, height: 80, display: "block" }}
          />
        </div>
        <div>
          <Text strong style={{ fontSize: 16 }}>
            Thenu's Cook Book
          </Text>

        </div>
      </Space>

      <Button icon={<HomeOutlined />} onClick={() => navigate("/")}>
        Home
      </Button>
    </Header>
  );
};

export default TitleBar;
