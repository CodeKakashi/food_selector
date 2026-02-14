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
    <Footer className="app-footer">
      <div
        className="app-footer-inner"
      >
        {/* LEFT SIDE */}
        <Space direction="vertical" size={6}>
          <Space size="small">
            <Link
              href="/privacy"
              underline={false}
              className="app-footer-link"
            >
              Privacy Policy
            </Link>
            <Text className="app-footer-sep">•</Text>
            <Link
              href="/terms"
              underline={false}
              className="app-footer-link"
            >
              Terms of Service
            </Link>
          </Space>

          <Text className="app-footer-copy">
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
              className="app-social-link"
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
