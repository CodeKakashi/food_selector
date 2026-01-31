import React from "react";
import { Layout, Typography, Space } from "antd";
import {
  GithubOutlined,
  LinkedinOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Text, Link } = Typography;

const AppFooter = () => {
  return (
    <Footer
      style={{
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        padding: "28px 48px",
        color: "#475569",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {/* LEFT SIDE */}
        <Space direction="vertical" size={6}>
          <Space size="small">
            <Link
              href="/privacy"
              underline={false}
              style={{ color: "#2563eb", fontWeight: 500 }}
            >
              Privacy Policy
            </Link>
            <Text style={{ color: "#94a3b8" }}>•</Text>
            <Link
              href="/terms"
              underline={false}
              style={{ color: "#2563eb", fontWeight: 500 }}
            >
              Terms of Service
            </Link>
          </Space>

          <Text style={{ fontSize: 13, color: "#64748b" }}>
            © {new Date().getFullYear()} Thenu's Cook Book. All rights reserved.
          </Text>
        </Space>

        {/* RIGHT SIDE – SOCIAL ICONS */}
        <Space size="middle">
          {[
            { href: "https://github.com/CodeKakashi", icon: <GithubOutlined /> },
            { href: "https://www.linkedin.com/in/haarish-s-251b78224", icon: <LinkedinOutlined /> },
            { href: "https://haary-porfolio.vercel.app/", icon: <GlobalOutlined /> },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              target="_blank"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2563eb",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.background = "#eff6ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {item.icon}
            </Link>
          ))}
        </Space>
      </div>
    </Footer>
  );
};

export default AppFooter;
