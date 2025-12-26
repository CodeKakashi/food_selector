// RecipeListPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  List,
  Card,
  Tag,
  Space,
  Button,
  Typography,
  Flex,
  Tooltip,
  Pagination,
  Form,
  Row,
  Col,
  Alert,
  Image,
} from "antd";
import { YoutubeOutlined, HomeOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import CustomBackTop from "../../components/customTop";
import DishImage from "./dishImage";
import RecipeFilters from "./RecipeFilters";
import resultIcon from "../../assets/result.svg";

const { Text, Title, Link } = Typography;

const RecipeListPage = ({ data = [] }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ read recipes passed from IntroPage navigate state
  const recipesFromState = location?.state?.filtered_recipes || [];

  // ✅ final dataset source
  const finalData = recipesFromState.length > 0 ? recipesFromState : data;

  const selectedIngredients =
    location?.state?.ingredients ||
    JSON.parse(localStorage.getItem("selectedIngredients") || "[]");

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const normalize = (v) => String(v ?? "").trim().toLowerCase();

  // watch filters
  const rawFilters = Form.useWatch([], form);
  const filters = useMemo(() => rawFilters || {}, [rawFilters]);

  // ✅ local filtering (IMPORTANT FIX: filter finalData, not data)
  const filteredData = useMemo(() => {
    const nameQ = normalize(filters.name);
    const dietQ = normalize(filters.diet);
    const courseQ = normalize(filters.course);
    const stateQ = String(filters.state || "").trim();

    const prepMax = filters.prep_time;
    const cookMax = filters.cook_time;

    return finalData.filter((item) => {
      const itemName = normalize(item.name);
      const itemDiet = normalize(item.diet);
      const itemCourse = normalize(item.course);
      const itemState = String(item.state || "").trim();

      if (nameQ && !itemName.includes(nameQ)) return false;

      if (prepMax !== undefined && prepMax !== null) {
        const prep = Number(item.prep_time);
        if (!Number.isFinite(prep) || prep > Number(prepMax)) return false;
      }

      if (cookMax !== undefined && cookMax !== null) {
        const cook = Number(item.cook_time);
        if (!Number.isFinite(cook) || cook > Number(cookMax)) return false;
      }

      if (dietQ && itemDiet !== dietQ) return false;
      if (courseQ && itemCourse !== courseQ) return false;
      if (stateQ && itemState !== stateQ) return false;

      return true;
    });
  }, [finalData, filters]);

  // paginate
  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // keep page valid
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredData.length / pageSize));
    if (page > maxPage) setPage(1);
  }, [filteredData.length, page, pageSize]);

  // reset page on filters / size changes
  useEffect(() => {
    setPage(1);
  }, [filters, pageSize]);

  const onResetFilters = () => {
    form.resetFields();
    setPage(1);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <Alert
        type="info"
        showIcon
        message="Selected Ingredients"
        description={
          <div>
            <div style={{ marginBottom: 8 }}>
              The ingredients that you have selected are{" "}
              <b>
                {selectedIngredients.length > 0
                  ? selectedIngredients.join(", ")
                  : "Not provided"}
              </b>
              . Results are based on this.
            </div>

            <div>
              If you want to update ingredients, go back to{" "}
              <Button
                type="link"
                icon={<HomeOutlined />}
                onClick={() => navigate("/")}
                style={{ padding: 0 }}
              >
                Home
              </Button>{" "}
              and update. Otherwise, use the filters to update what you need.
            </div>
          </div>
        }
        style={{
          margin: "12px 16px 0 16px",
          borderRadius: 12,
        }}
        closable={true}
      />

      {/* TITLE IMAGE */}
      <Flex justify="center">
        <Image
          src={resultIcon}
          alt="recipe"
          preview={false}
          style={{
            width: "100%",
            maxWidth: 500,
            height: "auto",
          }}
        />
      </Flex>

      <Row
        align="middle"
        justify="space-between"
        style={{ padding: 16, paddingBottom: 0, marginTop: 16 }}
      >
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Filtered Recipes
          </Title>
        </Col>

        <Col>
          <Button icon={<HomeOutlined />} onClick={() => navigate("/")} type="default">
            Home
          </Button>
        </Col>
      </Row>

      {/* FILTERS */}
      <RecipeFilters
        form={form}
        data={finalData}
        total={filteredData.length}
        onReset={onResetFilters}
        sticky
      />

      {/* LIST */}
      <div style={{ padding: 16 }}>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={pagedData}
          renderItem={(item) => (
            <List.Item key={item._id || item.name}>
              <Card bodyStyle={{ padding: 20 }}>
                <Flex gap={16} align="flex-start" wrap>
                  <DishImage name={item.name} course={item.course} />

                  <div style={{ flex: 1, minWidth: 260 }}>
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                      <Flex justify="space-between" align="center">
                        <Title level={4} style={{ margin: 0 }}>
                          {item.name}
                        </Title>

                        {(() => {
                          const diet = (item.diet || "").toLowerCase();
                          const isVeg = diet === "vegetarian";

                          return (
                            <Tag color={isVeg ? "green" : "red"}>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  backgroundColor: isVeg ? "#2e7d32" : "#c62828",
                                  marginRight: 6,
                                }}
                              />
                              {diet ? diet.charAt(0).toUpperCase() + diet.slice(1) : "Unknown"}
                            </Tag>
                          );
                        })()}
                      </Flex>

                      <Space wrap size="small">
                        <Tag color="blue">{item.course || "Unknown course"}</Tag>
                        <Tag color="purple">{item.state || "Unknown state"}</Tag>
                        <Tag>Prep: {item.prep_time ?? "?"} min</Tag>
                        <Tag>Cook: {item.cook_time ?? "?"} min</Tag>
                      </Space>

                      <Flex align="center" gap={8} wrap>
                        <Text strong>Ingredients:</Text>
                        <Tag color="green">Available</Tag>
                        <Tag color="volcano">Missing</Tag>
                      </Flex>

                      <Space wrap size="small">
                        {(() => {
                          const allIngredients = String(item.ingredients || "")
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);

                          const missingSet = new Set(
                            (item.missing_ingredients?.missing_ingredients || [])
                              .map((s) => String(s).trim().toLowerCase())
                              .filter(Boolean)
                          );

                          return allIngredients.map((ing, idx) => {
                            const isMissing = missingSet.has(ing.toLowerCase());
                            return (
                              <Tag key={`${ing}-${idx}`} color={isMissing ? "volcano" : "green"}>
                                <Link
                                  href={`https://www.google.com/search?q=what+is+${encodeURIComponent(
                                    ing
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: "inherit" }}
                                >
                                  {ing}
                                </Link>
                              </Tag>
                            );
                          });
                        })()}
                      </Space>

                      <Tooltip title="Watch on YouTube">
                        <Button
                          type="primary"
                          danger
                          icon={<YoutubeOutlined style={{ color: "#fff" }} />}
                          href={item.youtube_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          disabled={!item.youtube_link}
                          style={{
                            backgroundColor: "#b80000ff",
                            borderColor: "#b80000ff",
                            color: "#fff",
                          }}
                        >
                          Watch on YouTube
                        </Button>
                      </Tooltip>
                    </Space>
                  </div>
                </Flex>
              </Card>
            </List.Item>
          )}
        />

        {filteredData.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={filteredData.length}
              onChange={(p) => setPage(p)}
              onShowSizeChange={(p, size) => {
                setPage(1);
                setPageSize(size);
              }}
              showSizeChanger
              pageSizeOptions={[5, 10, 20, 50]}
              showQuickJumper
            />
          </div>
        )}
      </div>
      <CustomBackTop

      />

    </div>
  );
};

export default RecipeListPage;
