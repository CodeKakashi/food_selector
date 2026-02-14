import { BackTop, Image, Flex, Tag } from "antd";
import "./customTop.css";
import backToTopIcon from "../assets/customTop.svg";


const CustomBackTop = () => (
  <BackTop>
    <Flex
      vertical
      align="center"
      gap={6}
      className="custom-backtop"
      style={{
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Circular button */}
      <div
        className="custom-backtop-btn"
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
      <Tag className="custom-backtop-tag">
        Back to Up
      </Tag>
    </Flex>
  </BackTop>
);

export default CustomBackTop;
