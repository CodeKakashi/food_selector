import React, { useEffect, useMemo, useRef, useState } from "react";
import "./intro.css";
import axios from "axios";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Tag,
  Flex,
  Card,
  Steps,
  Space,
  Typography,
  // Image,
  Grid,
  Tour,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom";
// import recipeIcon from "../../assets/recipe.svg";
import basilSvg from "../../assets/ingredients/basil.svg";
import lemonSvg from "../../assets/ingredients/lemon.svg";
import pepperSvg from "../../assets/ingredients/pepper.svg";
import { BASE_URL } from "../../config";

const { Option } = Select;
const { Title, Text } = Typography;

const IntroPage = () => {
  const rootRef = useRef(null);
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ingredientsPreview, setIngredientsPreview] = useState([]);
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.sm;
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const titleRef = useRef(null);
  const stepsRef = useRef(null);
  const ingredientsRef = useRef(null);
  const detailsRef = useRef(null);

  // ✅ Step 1 = Recipes (ingredients), Step 2 = Details (other filters)
  const stepItems = useMemo(() => [{ title: "Recipes" }, { title: "Details" }], []);
  const tourStorageKey = "intro_tour_seen";

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion) return;

    let targetScroll = window.scrollY || 0;
    let currentScroll = targetScroll;
    let mx = 0;
    let my = 0;
    let raf = 0;

    const onScroll = () => {
      targetScroll = window.scrollY || 0;
    };

    const onPointer = (e) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      mx = (e.clientX / w - 0.5) * 2;
      my = (e.clientY / h - 0.5) * 2;
    };

    const tick = () => {
      currentScroll += (targetScroll - currentScroll) * 0.085;

      const bgTx = mx * 10;
      const bgTy = -currentScroll * 0.12 + my * 8;
      const midTx = mx * 22;
      const midTy = -currentScroll * 0.5 + my * 14;

      root.style.setProperty("--lp-bg-tx", `${bgTx.toFixed(1)}px`);
      root.style.setProperty("--lp-bg-ty", `${bgTy.toFixed(1)}px`);
      root.style.setProperty("--lp-mid-tx", `${midTx.toFixed(1)}px`);
      root.style.setProperty("--lp-mid-ty", `${midTy.toFixed(1)}px`);

      raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    tick();

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasSeenTour = localStorage.getItem(tourStorageKey) === "true";
    if (!hasSeenTour) {
      setTourOpen(true);
    }
  }, []);

  const onIngredientsChange = (e) => {
    const parsed = (e.target.value || "")
      .split(",")
      .map((i) => i.trim().toLowerCase())
      .filter((i) => i.length > 0);

    setIngredientsPreview(parsed);
  };

  const goNext = async () => {
    try {
      const fieldsToValidate =
        currentStep === 0
          ? ["ingredients"] // ✅ step 1 only ingredients
          : ["name", "prep_time", "cook_time", "diet", "course", "state"]; // ✅ step 2 others

      await form.validateFields(fieldsToValidate);
      setCurrentStep((s) => s + 1);
    } catch {
      // antd shows errors
    }
  };

  const goPrev = () => setCurrentStep((s) => s - 1);

  const handleReset = () => {
    form.resetFields();
    setIngredientsPreview([]);
    setCurrentStep(0);
  };

  const onFinalSubmit = async () => {
    setLoading(true);

    const values = form.getFieldsValue(true);

    const ingredientsArray = (values.ingredients || "")
      .split(",")
      .map((i) => i.trim().toLowerCase())
      .filter((i) => i.length > 0);

    const payloadToSend = {
      name: values.name,
      prep_time: values.prep_time,
      cook_time: values.cook_time,
      diet: values.diet,
      course: values.course,
      state: values.state,
      ingredients: ingredientsArray,
    };

    try {
      const res = await axios.post(BASE_URL, payloadToSend);

      const status = res?.data?.status;
      const msg = res?.data?.message;
      const filteredRecipes = res?.data?.payload?.filtered_recipes || [];

      if (status === 1) {
        message.success(msg || "Recipes filtered successfully");

        navigate("/dashboard", {
          state: {
            filtered_recipes: filteredRecipes,
            ingredients: ingredientsArray,
          },
        });

        handleReset();
      } else {
        message.error(msg || "Operation failed");
      }
    } catch (err) {
      console.error("POST error:", err);
      message.error("Failed to submit. Check backend route.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-root intro-root" ref={rootRef}>
      <div className="lp-scene" aria-hidden="true">
        <div className="lp-bg" />
        <div className="lp-mid">
          <img
            className="lp-float basil is-lg"
            data-kind="basil"
            src={basilSvg}
            alt=""
            style={{ left: "6%", top: "18%" }}
            loading="lazy"
          />
          <img
            className="lp-float lemon"
            data-kind="lemon"
            src={lemonSvg}
            alt=""
            style={{ right: "8%", top: "12%" }}
            loading="lazy"
          />
          <img
            className="lp-float pepper is-sm"
            data-kind="pepper"
            src={pepperSvg}
            alt=""
            style={{ left: "14%", bottom: "12%" }}
            loading="lazy"
          />
          <img
            className="lp-float lemon is-sm"
            data-kind="lemon"
            src={lemonSvg}
            alt=""
            style={{ right: "18%", bottom: "10%" }}
            loading="lazy"
          />
          <img
            className="lp-float basil is-sm"
            data-kind="basil"
            src={basilSvg}
            alt=""
            style={{ left: "42%", top: "54%" }}
            loading="lazy"
          />
        </div>
        <div className="lp-vignette" />
      </div>

      <section className="intro-hero">
        <div className="lp-container">
          <Card className="lp-glass-card intro-card" bordered={false}>
            <Row gutter={[28, 28]} align="top">
              <Col xs={24} lg={14}>
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <Tour
                    open={tourOpen}
                    current={tourStep}
                    onChange={(nextStep) => {
                      setTourStep(nextStep);
                      if (nextStep >= 3) {
                        setCurrentStep(1);
                      } else {
                        setCurrentStep(0);
                      }
                    }}
                    onClose={() => {
                      localStorage.setItem(tourStorageKey, "true");
                      setTourOpen(false);
                    }}
                    steps={[
                      {
                        title: "Recipe Selector",
                        description: "Start here to find recipes based on what you have.",
                        target: () => titleRef.current,
                      },
                      {
                        title: "Add ingredients",
                        description: "Type ingredients separated by commas to get the best matches.",
                        target: () => ingredientsRef.current,
                      },
                      {
                        title: "Steps",
                        description: "Move to Details to refine your results.",
                        target: () => stepsRef.current,
                      },
                    ]}
                  />

                  <div ref={titleRef}>
                    <Tag className="lp-pill">Guided recipe finder</Tag>
                    <Title level={2} className="intro-title">
                      Recipe Selector
                    </Title>
                    <Text className="intro-sub">
                      Add ingredients first, then optionally filter by details.
                    </Text>
                  </div>

                  <div ref={stepsRef}>
                    <Steps
                      current={currentStep}
                      items={stepItems}
                      direction={isMobile ? "vertical" : "horizontal"}
                    />
                  </div>

                  <Form form={form} layout="vertical" autoComplete="off" onFinish={onFinalSubmit}>
                    {/* ✅ STEP 1: RECIPES (ONLY INGREDIENTS) */}
                    {currentStep === 0 && (
                      <div style={{ marginTop: 16 }} ref={ingredientsRef}>
                        <Form.Item
                          name="ingredients"
                          label="Ingredients (Use comma to separate E.g. milk, sugar, ghee)"
                          rules={[{ required: true, message: "Ingredients are required" }]}
                        >
                          <Input placeholder="milk, sugar, ghee" onChange={onIngredientsChange} allowClear />
                        </Form.Item>

                        {ingredientsPreview.length > 0 && (
                          <Flex wrap gap={8} style={{ marginBottom: 12 }}>
                            {ingredientsPreview.map((ing, idx) => (
                              <Tag key={`${ing}-${idx}`} className="lp-pill">
                                {ing}
                              </Tag>
                            ))}
                          </Flex>
                        )}
                      </div>
                    )}

                    {/* ✅ STEP 2: DETAILS (ALL OTHERS) */}
                    {currentStep === 1 && (
                      <div style={{ marginTop: 16 }} ref={detailsRef}>
                        <Form.Item name="name" label="Recipe Name (Optional)">
                          <Input placeholder="e.g. lassi" allowClear />
                        </Form.Item>

                        <Form.Item
                          name="prep_time"
                          label="Preparation Time (minutes) (Optional)"
                          rules={[{ type: "number", min: 0, message: "Must be >= 0" }]}
                        >
                          <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>

                        <Form.Item
                          name="cook_time"
                          label="Cooking Time (minutes) (Optional)"
                          rules={[{ type: "number", min: 0, message: "Must be >= 0" }]}
                        >
                          <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>

                        <Form.Item name="diet" label="Diet (Optional)">
                          <Select placeholder="Select diet" allowClear className="intro-select">
                            <Option value="vegetarian">Vegetarian</Option>
                            <Option value="non-vegetarian">Non-Vegetarian</Option>
                            <Option value="vegan">Vegan</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item name="course" label="Course (Optional)">
                          <Select placeholder="Select course" allowClear className="intro-select">
                            <Option value="starter">Starter</Option>
                            <Option value="main course">Main Course</Option>
                            <Option value="dessert">Dessert</Option>
                            <Option value="snack">Snack</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item name="state" label="State (Optional)">
                          <Select placeholder="Select state" allowClear className="intro-select">
                            <Option value="Punjab">Punjab</Option>
                            <Option value="Kerala">Kerala</Option>
                            <Option value="Tamil Nadu">Tamil Nadu</Option>
                            <Option value="Karnataka">Karnataka</Option>
                            <Option value="Rajasthan">Rajasthan</Option>
                            <Option value="Goan">Goan</Option>
                          </Select>
                        </Form.Item>
                      </div>
                    )}

                    {/* FOOTER BUTTONS */}
                    <Flex
                      justify="space-between"
                      style={{ marginTop: 8 }}
                      wrap
                      gap={12}
                      vertical={isMobile}
                      align={isMobile ? "stretch" : "center"}
                    >
                      <Button onClick={handleReset} disabled={loading} className="lp-secondary">
                        Reset
                      </Button>

                      <Space
                        wrap
                        size={8}
                        style={{
                          width: isMobile ? "100%" : "auto",
                          justifyContent: isMobile ? "space-between" : "flex-start",
                        }}
                      >
                        {currentStep > 0 && (
                          <Button onClick={goPrev} disabled={loading} className="lp-secondary">
                            Previous
                          </Button>
                        )}

                        {currentStep < stepItems.length - 1 && (
                          <Button
                            type="primary"
                            onClick={goNext}
                            disabled={loading}
                            block={isMobile}
                            className="lp-primary"
                          >
                            Next
                          </Button>
                        )}

                        {currentStep === stepItems.length - 1 && (
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            onClick={() => form.submit()}
                            block={isMobile}
                            className="lp-primary"
                          >
                            Submit
                          </Button>
                        )}
                      </Space>
                    </Flex>
                  </Form>
                </Space>
              </Col>

              <Col xs={24} lg={10}>
                <div className="intro-aside">
                  {/* <Image
                    src={recipeIcon}
                    alt="recipe"
                    preview={false}
                    className="intro-illustration"
                  /> */}
                  <div className="lp-glass-card intro-note">
                    <Space direction="vertical" size={8} style={{ width: "100%" }}>
                      <Text strong className="intro-note-title">
                        Quick tips
                      </Text>
                      <Text type="secondary">Use commas to separate ingredients.</Text>
                      <Text type="secondary">Add diet, course, and state for tighter matches.</Text>
                      <Text type="secondary">Missing ingredients are highlighted in results.</Text>
                    </Space>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default IntroPage;
