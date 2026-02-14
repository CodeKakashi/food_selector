import React from "react";
import { Layout, Button, Space, Typography, Grid, Row, Col, Image } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../../logo.svg";
import ThemeToggle from "../../components/ThemeToggle.jsx";
const { Header } = Layout;
const { Text } = Typography;

const TitleBar = () => {
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.sm;

  return (
    <Header className="app-header" style={{ padding: isMobile ? "8px 12px" : "10px 24px" }}>
      <Row align="middle" gutter={[12, 12]} className="app-header-row">
        <Col xs={24} sm={16}>
          <Space
            align="center"
            size="middle"
            className="app-brand"
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
            <Text strong className="app-brand-name">
              Thenu's Cook Book
            </Text>
          </Space>
        </Col>

        <Col xs={24} sm={8}>
          <Space
            size="middle"
            align="center"
            className="app-header-actions"
            direction={isMobile ? "vertical" : "horizontal"}
          >
            <Button
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
              block={isMobile}
              className="lp-secondary app-home-btn"
            >
              Home
            </Button>
            <ThemeToggle placement="inline" />
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default TitleBar;
