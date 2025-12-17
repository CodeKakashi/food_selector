import React, { useState } from "react";
import "../intro/intro.css";
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
} from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const IntroPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [ingredientsPreview, setIngredientsPreview] = useState([]);
  const navigate = useNavigate();

  const onIngredientsChange = (e) => {
    const parsed = (e.target.value || "")
      .split(",")
      .map((i) => i.trim().toLowerCase())
      .filter((i) => i.length > 0);

    setIngredientsPreview(parsed);
  };

  const onFinish = async (values) => {
    setLoading(true);

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
      const res = await axios.post("/api/dashboard", payloadToSend);

      const status = res?.data?.status;
      const msg = res?.data?.message;
      const filteredRecipes = res?.data?.payload?.filtered_recipes || [];

      if (status === 1) {
        message.success(msg || "Recipes filtered successfully");

        navigate("/dashboard", {
          state: { filtered_recipes: filteredRecipes },
        });

        form.resetFields();
        setIngredientsPreview([]);
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

  const handleReset = () => {
    form.resetFields();
    setIngredientsPreview([]);
  };

  return (
    <div className="intro-page">
      <Flex justify="center">
        <Card
          style={{ maxWidth: 680, width: "100%" }}
          actions={[
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={() => form.submit()}
            >
              Submit
            </Button>,
            <Button key="reset" onClick={handleReset} disabled={loading}>
              Reset
            </Button>,
          ]}
        >
          <Card.Meta
            title="Recipe Input"
            description={
              <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                onFinish={onFinish}
              >
                <Form.Item
                  name="name"
                  label="Recipe Name"
                >
                  <Input placeholder="e.g. lassi" />
                </Form.Item>

                <Form.Item
                  name="ingredients"
                  label="Ingredients"
                  rules={[{ required: true, message: "Ingredients are required" }]}
                >
                  <Input
                    placeholder="milk, sugar, ghee"
                    onChange={onIngredientsChange}
                    allowClear
                  />
                </Form.Item>

                {ingredientsPreview.length > 0 && (
                  <Flex wrap gap={8} style={{ marginBottom: 12 }}>
                    {ingredientsPreview.map((ing, idx) => (
                      <Tag key={`${ing}-${idx}`}>{ing}</Tag>
                    ))}
                  </Flex>
                )}

                <Form.Item
                  name="prep_time"
                  label="Preparation Time (minutes)"
                  rules={[{ type: "number", min: 0, message: "Must be >= 0" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="cook_time"
                  label="Cooking Time (minutes)"
                  rules={[{ type: "number", min: 0, message: "Must be >= 0" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="diet" label="Diet">
                  <Select placeholder="Select diet" allowClear>
                    <Option value="vegetarian">Vegetarian</Option>
                    <Option value="non-vegetarian">Non-Vegetarian</Option>
                    <Option value="vegan">Vegan</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="course" label="Course">
                  <Select placeholder="Select course" allowClear>
                    <Option value="starter">Starter</Option>
                    <Option value="main course">Main Course</Option>
                    <Option value="dessert">Dessert</Option>
                    <Option value="snack">Snack</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="state" label="State">
                  <Select placeholder="Select state" allowClear>
                    <Option value="Punjab">Punjab</Option>
                    <Option value="Kerala">Kerala</Option>
                    <Option value="Tamil Nadu">Tamil Nadu</Option>
                    <Option value="Karnataka">Karnataka</Option>
                    <Option value="Rajasthan">Rajasthan</Option>
                    <Option value="Goan">Goan</Option>
                  </Select>
                </Form.Item>
              </Form>
            }
          />
        </Card>
      </Flex>
    </div>
  );
};

export default IntroPage;
