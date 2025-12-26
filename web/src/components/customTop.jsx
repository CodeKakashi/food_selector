import { BackTop, Image, Flex, Tag } from "antd";
import backToTopIcon from "../assets/customTop.svg";


const CustomBackTop = () => (
  <BackTop>
    <Flex
      vertical
      align="center"
      gap={6}
      style={{
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Circular button */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          backgroundColor: "#1677ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        <Image
          src={backToTopIcon}
          alt=""
          preview={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          imgStyle={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Processing tag */}
      <Tag
        color="blue"
      >
        Back to Up
      </Tag>
    </Flex>
  </BackTop>
);

export default CustomBackTop;

