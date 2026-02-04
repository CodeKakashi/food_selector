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
  Grid,
  Modal,
  Result,
  Divider,
  Steps,
  message
} from "antd";
import {
  YoutubeOutlined,
  HomeOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import CustomBackTop from "../../components/customTop";
import DishImage from "./dishImage";
import RecipeFilters from "./RecipeFilters";
import resultIcon from "../../assets/result.svg";
import noDataIcon from "../../assets/noData.svg";

const { Text, Title, Link } = Typography;

const scrollToItem = (itemId) => {
  const element = document.getElementById(itemId);

  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const RecipeListPage = ({ data = [] }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.sm;
  const { isIOS, isAndroid } = useMemo(() => {
    if (typeof window === "undefined") return { isIOS: false, isAndroid: false };
    const ua = window.navigator.userAgent || "";
    const android = /Android/i.test(ua);
    const ios =
      /iPad|iPhone|iPod/i.test(ua) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
    return { isIOS: ios, isAndroid: android };
  }, []);
  const isStandalone =
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true);

  // ✅ read recipes passed from IntroPage navigate state
  const recipesFromState = location?.state?.filtered_recipes || [];

  // ✅ final dataset source
  const finalData = recipesFromState.length > 0 ? recipesFromState : data;

  const selectedIngredients =
    location?.state?.ingredients ||
    JSON.parse(localStorage.getItem("selectedIngredients") || "[]");


  const noData = finalData.length === 0;

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

  scrollToItem('recipeList');

  // keep page valid
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredData.length / pageSize));
    if (page > maxPage) setPage(1);
  }, [filteredData.length, page, pageSize]);

  // reset page on filters / size changes
  useEffect(() => {
    setPage(1);
  }, [filters, pageSize]);

  // capture install prompt (Chrome/Edge/Android)
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (choice?.outcome === "accepted") {
        message.success("Installed! Look for the app on your home screen.");
      } else {
        setShowInstallHelp(true);
      }
      return;
    }

    setShowInstallHelp(true);
  };

  const onResetFilters = () => {
    form.resetFields();
    setPage(1);
  };

  return (
    <Row justify="center">
      <Col xs={24} sm={22} md={20} lg={18} xl={16}>
        <Flex vertical gap="large">
          <Alert
            type="info"
            showIcon
            message="Selected Ingredients"
            description={
              <Flex vertical gap="small">
                <Text>
                  The ingredients that you have selected are{" "}
                  <Text strong>
                    {selectedIngredients.length > 0
                      ? selectedIngredients.join(", ")
                      : "Not provided"}
                  </Text>
                  . Results are based on this.
                </Text>

                <Text>
                  If you want to update ingredients, go back to{" "}
                  <Button type="link" icon={<HomeOutlined />} onClick={() => navigate("/")}>
                    Home
                  </Button>{" "}
                  and update. Otherwise, use the filters to update what you need.
                </Text>
              </Flex>
            }
            closable
          />
          {
            noData ? (
              <Card
                bordered={false}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(235, 245, 255, 0.9) 0%, rgba(255, 244, 235, 0.9) 100%)",
                  boxShadow: "0 18px 40px rgba(24, 39, 75, 0.08)",
                  borderRadius: 20,
                }}
                bodyStyle={{ padding: isMobile ? 20 : 32 }}
              >
                <Result
                  icon={
                    <Image
                      src={noDataIcon}
                      alt="no data"
                      preview={false}
                      width={isMobile ? 240 : 320}
                    />
                  }
                  title="No recipes found"
                  subTitle="Your current ingredients and filters didn’t return any matches. Try using different ingredients or remove some ingredients."
                  extra={
                    <Space wrap>
                      <Button
                        type="primary"
                        icon={<HomeOutlined />}
                        onClick={() => navigate("/intro")}
                      >
                        Try Again
                      </Button>
                    </Space>
                  }
                />
                <Divider />
                <Flex vertical gap="small">
                  <Text strong>Selected ingredients</Text>
                  {selectedIngredients.length > 0 ? (
                    <Space wrap>
                      {selectedIngredients.map((item) => (
                        <Tag key={item} color="blue">
                          {item}
                        </Tag>
                      ))}
                    </Space>
                  ) : (
                    <Text type="secondary">No ingredients provided</Text>
                  )}
                </Flex>
              </Card>
            ) : <Col>
              <Row align="middle" justify="space-between" gutter={[12, 12]}>
                <Col xs={24} sm={16}>
                  <Title level={3}>Filtered Recipes</Title>
                </Col>

                {/* <Col xs={24} sm={8}>
              <Button icon={<HomeOutlined />} onClick={() => navigate("/")} block={isMobile}>
                Home
              </Button>
            </Col> */}
              </Row>
              <RecipeFilters
                form={form}
                data={finalData}
                total={filteredData.length}
                onReset={onResetFilters}
                sticky={!isMobile}
              />

              <List
                itemLayout="vertical"
                size={isMobile ? "small" : "large"}
                id="recipeList"
                dataSource={pagedData}
                renderItem={(item) => (
                  <List.Item key={item._id || item.name} >
                    <Card size={isMobile ? "small" : "large"} >
                      <Row gutter={[16, 16]} align="top" justify={isMobile ? "center" : "start"}>
                        <Col xs={24} sm={8} md={6} style={{ display: "flex", justifyContent: "center" }}>
                          <Flex justify="center">
                            <DishImage name={item.name} course={item.course} size={isMobile ? 110 : 160} />
                          </Flex>
                        </Col>

                        <Col xs={24} sm={16} md={18}>
                          <Flex vertical gap="middle">
                            <Flex justify="space-between" align="center" wrap>
                              <Title level={4} style={{ marginBottom: 0 }}>
                                {item.name}
                              </Title>

                              {(() => {
                                const diet = (item.diet || "").toLowerCase();
                                const isVeg = diet === "vegetarian";

                                return (
                                  <Tag color={isVeg ? "green" : "red"}>
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

                            <Space wrap align="center">
                              <Text strong>Ingredients:</Text>
                              <Tag color="green">Available</Tag>
                              <Tag color="volcano">Missing</Tag>
                            </Space>

                            <List
                              size="default"
                              dataSource={(() => {
                                const allIngredients = String(item.ingredients || "")
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean);

                                const missingSet = new Set(
                                  (item.missing_ingredients?.missing_ingredients || [])
                                    .map((s) => String(s).trim().toLowerCase())
                                    .filter(Boolean)
                                );

                                return allIngredients.map((ing) => ({
                                  name: ing,
                                  isMissing: missingSet.has(ing.toLowerCase()),
                                }));
                              })()}
                              renderItem={(ing) => {
                                const displayName =
                                  ing.name.length > 32 ? `${ing.name.slice(0, 29)}...` : ing.name;
                                return (
                                  <List.Item>
                                    <Tag color={ing.isMissing ? "volcano" : "green"}>
                                      <Tooltip title={ing.name}>
                                        <Link
                                          href={`https://www.google.com/search?q=what+is+${encodeURIComponent(
                                            ing.name
                                          )}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {displayName}
                                        </Link>
                                      </Tooltip>
                                    </Tag>
                                  </List.Item>
                                );
                              }}
                            />

                            <Tooltip title="Watch on YouTube">
                              <Button
                                type="primary"
                                danger
                                icon={<YoutubeOutlined />}
                                href={item.youtube_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                disabled={!item.youtube_link}
                                block={isMobile}
                              >
                                Watch on YouTube
                              </Button>
                            </Tooltip>
                          </Flex>
                        </Col>
                      </Row>
                    </Card>
                  </List.Item>
                )}
              />

            </Col>
          }
          {filteredData.length > 0 && (
            <Flex justify="center">
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
                showQuickJumper={!isMobile}
                responsive
              />
            </Flex>
          )}

          <CustomBackTop />

        </Flex>

      </Col>
      {!isStandalone && (
        <>
          <Button
            shape="round"
            onClick={handleInstallClick}
            color="cyan"
            variant="filled"
            style={{
              position: "fixed",
              left: 20,
              bottom: 24,
              zIndex: 1000,
              boxShadow: "0 10px 24px rgba(0, 0, 0, 0.18)",
              paddingInline: 18,
            }}
            icon={<DownloadOutlined />}
          >
            Install App
          </Button>

          <Modal
            title="Add to Home Screen"
            open={showInstallHelp}
            onCancel={() => setShowInstallHelp(false)}
            onOk={() => setShowInstallHelp(false)}
            okText="Got it"
            cancelText="Close"
          >
            <Flex vertical gap="middle">
              <Text>
                We can’t add apps to your home screen automatically (mobile browsers require a user
                action), but you can install it in under 10 seconds:
              </Text>

              <Alert
                type="info"
                showIcon
                message={
                  isIOS
                    ? "iPhone/iPad: Install is manual"
                    : isAndroid
                      ? "Android: Use the install option"
                      : "Desktop: Use your browser install option"
                }
                description={
                  isIOS
                    ? "On iOS there is no install popup. Use the Share menu → Add to Home Screen."
                    : "If you don’t see a popup, use the browser menu to install."
                }
              />

              <Steps
                direction="vertical"
                size="small"
                items={
                  isIOS
                    ? [
                        {
                          title: "Open the Share menu",
                          description: (
                            <span>
                              Tap <ShareAltOutlined /> in Safari.
                            </span>
                          ),
                        },
                        {
                          title: "Add to Home Screen",
                          description: (
                            <span>
                              Scroll and tap <PlusOutlined /> <Text strong>Add to Home Screen</Text>.
                            </span>
                          ),
                        },
                        {
                          title: "Confirm",
                          description: "Tap Add. The app icon will appear on your home screen.",
                        },
                      ]
                    : [
                        {
                          title: "Open browser menu",
                          description: (
                            <span>
                              Tap <MoreOutlined /> (three dots) in Chrome.
                            </span>
                          ),
                        },
                        {
                          title: "Install",
                          description: (
                            <span>
                              Tap <Text strong>Install app</Text> or <Text strong>Add to Home screen</Text>,
                              then confirm.
                            </span>
                          ),
                        },
                        {
                          title: "Launch",
                          description: "Open it from your home screen for a full-screen app experience.",
                        },
                      ]
                }
              />

              <Text type="secondary">
                Tip: If you’re in private/incognito mode, or not on HTTPS (production), install may not
                be available.
              </Text>
            </Flex>
          </Modal>
        </>
      )}
      {
        !noData && (
          <Flex justify="center">
            <Image src={resultIcon} alt="recipe" preview={false} width={isMobile ? 320 : 500} />
          </Flex>
        )
      }

    </Row>


  );
};

export default RecipeListPage;
