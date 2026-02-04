import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Image,
  Grid,
  Tour,
} from "antd";
import { useNavigate } from "react-router-dom";
import recipeIcon from "../../assets/recipe.svg";
import { BASE_URL } from "../../config";

const { Option } = Select;
const { Title, Text } = Typography;

const IntroPage = () => {
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
      const res = await axios.post(
        BASE_URL,
        payloadToSend
      );

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
    <Card
      style={{
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? 12 : 0,
      }}
    >
      <Card
        style={{
          width: isMobile ? "100%" : "min(720px, 96vw)",
          borderRadius: isMobile ? 12 : 16,
        }}
      >
        <Space direction="vertical" size={10} style={{ width: "100%" }}>
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
              }]}
          />
          <Flex justify="center">
            <Image
              src={recipeIcon}
              alt="recipe"
              preview={false}
              style={{
                width: "100%",
                maxWidth: isMobile ? 320 : 500,
                height: "auto",
              }}
            />
          </Flex>

          <div ref={titleRef}>
            <Title level={3} style={{ margin: 0 }}>
              Recipe Selector
            </Title>
            <Text type="secondary">
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
                      <Tag key={`${ing}-${idx}`}>{ing}</Tag>
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
                  <Select placeholder="Select diet" allowClear>
                    <Option value="vegetarian">Vegetarian</Option>
                    <Option value="non-vegetarian">Non-Vegetarian</Option>
                    <Option value="vegan">Vegan</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="course" label="Course (Optional)">
                  <Select placeholder="Select course" allowClear>
                    <Option value="starter">Starter</Option>
                    <Option value="main course">Main Course</Option>
                    <Option value="dessert">Dessert</Option>
                    <Option value="snack">Snack</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="state" label="State (Optional)">
                  <Select placeholder="Select state" allowClear>
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
              <Button onClick={handleReset} disabled={loading}>
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
                  <Button onClick={goPrev} disabled={loading}>
                    Previous
                  </Button>
                )}

                {currentStep < stepItems.length - 1 && (
                  <Button type="primary" onClick={goNext} disabled={loading} block={isMobile}>
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
                  >
                    Submit
                  </Button>
                )}
              </Space>
            </Flex>
          </Form>
        </Space>
      </Card>
    </Card>

  );
};

export default IntroPage;
