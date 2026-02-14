// RecipeFilters.jsx
import React, { useMemo } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Space,
  Button,
  Typography,
  Flex,
  Collapse,
} from "antd";

const { Text } = Typography;
const { Option } = Select;

const RecipeFilters = ({
  form,
  data = [],
  total = 0,
  onReset,
  sticky = true,
}) => {
  const normalize = (v) => String(v || "").trim().toLowerCase();

  const dietOptions = useMemo(() => {
    const set = new Set(data.map((d) => normalize(d.diet)).filter(Boolean));
    return Array.from(set);
  }, [data]);

  const courseOptions = useMemo(() => {
    const set = new Set(data.map((d) => normalize(d.course)).filter(Boolean));
    return Array.from(set);
  }, [data]);

  const stateOptions = useMemo(() => {
    const set = new Set(data.map((d) => String(d.state || "").trim()).filter(Boolean));
    return Array.from(set);
  }, [data]);

  return (
    <div
      className={`dash-filters lp-glass-card${sticky ? " is-sticky" : ""}`}
      style={{
        position: sticky ? "sticky" : "static",
        top: sticky ? 12 : undefined,
        zIndex: sticky ? 50 : undefined,
      }}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 12 }}>

        <Row gutter={[12, 8]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="course" label="Course">
              <Select placeholder="Select course" allowClear>
                {courseOptions.map((c) => (
                  <Option key={c} value={c}>
                    {c ? c.charAt(0).toUpperCase() + c.slice(1) : "Unknown"}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item name="state" label="State">
              <Select
                placeholder="Select state"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {stateOptions.map((s) => (
                  <Option key={s} value={s}>
                    {s}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>




        <Col xs={24}>
          <Collapse
            ghost
            expandIconPosition="end"
            items={[
              {
                key: "advanced",
                label: "Explore more filters",
                children: (
                  <Row gutter={[12, 8]}>

                    <Col xs={24} sm={12} md={8}>
                      <Form.Item name="diet" label="Diet">
                        <Select placeholder="Select diet" allowClear>
                          {dietOptions.map((d) => (
                            <Option key={d} value={d}>
                              {d ? d.charAt(0).toUpperCase() + d.slice(1) : "Unknown"}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item name="name" label="Recipe Name">
                        <Input placeholder="e.g. lassi" allowClear />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                      <Form.Item name="prep_time" label="Preparation Time (minutes)">
                        <InputNumber min={0} style={{ width: "100%" }} placeholder="Max prep time" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                      <Form.Item name="cook_time" label="Cooking Time (minutes)">
                        <InputNumber min={0} style={{ width: "100%" }} placeholder="Max cook time" />
                      </Form.Item>
                    </Col>
                  </Row>
                ),
              },
            ]}
          />
        </Col>

        <Col xs={24}>
          <Flex justify="space-between" align="center" wrap>
            <Text type="secondary">
              Showing <b>{total}</b> result(s)
            </Text>

            <Space>
              <Button onClick={onReset} className="lp-secondary">
                Reset Filters
              </Button>
            </Space>
          </Flex>
        </Col>

      </Form>
    </div>
  );
};

export default RecipeFilters;
