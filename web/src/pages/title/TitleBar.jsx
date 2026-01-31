import React from "react";
import { Layout, Button, Space, Typography, Grid, Row, Col } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../../logo.svg";
import { Image } from "antd";
const { Header } = Layout;
const { Text } = Typography;

const TitleBar = () => {
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.sm;

  return (
    <Header
      style={{
        background: "#fff",
        padding: isMobile ? "8px 12px" : "0 24px",
        height: "auto",
        lineHeight: "normal",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Row align="middle" gutter={[12, 12]} style={{ width: "100%" }}>
        <Col xs={24} sm={16}>
          <Space
            align="center"
            size="middle"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <div
              style={{
                width: isMobile ? 48 : 56,
                height: isMobile ? 66 : 76,
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
                style={{
                  width: isMobile ? 48 : 56,
                  height: isMobile ? 66 : 76,
                  display: "block",
                }}
              />
            </div>
            <Text strong style={{ fontSize: 16 }}>
              Thenu's Cook Book
            </Text>
          </Space>
        </Col>

        <Col xs={24} sm={8}>
          <Button icon={<HomeOutlined />} onClick={() => navigate("/")} block={isMobile}>
            Home
          </Button>
        </Col>
      </Row>
    </Header>
  );
};

export default TitleBar;
