import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  Checkbox,
  Col,
  Flex,
  Form,
  Grid,
  Input,
  Progress,
  Radio,
  Row,
  Typography,
  message,
} from "antd";
import CustomBackTop from "../../components/customTop";
import basilSvg from "../../assets/ingredients/basil.svg";
import lemonSvg from "../../assets/ingredients/lemon.svg";
import pepperSvg from "../../assets/ingredients/pepper.svg";
import "../dashboard/dashboard.css";
import { BASE_URL } from "../../config";

const { Text, Title } = Typography;

const frequencyScale = ["Never", "Rarely", "Sometimes", "Often", "Daily"];
const wasteScale = ["None", "A little", "A moderate amount", "A lot", "Almost everything"];
const mealsScale = ["One", "Two", "Three", "Four", "Five+"];
const agreementScale = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];
const importanceScale = [
  "Not at all",
  "Slightly",
  "Moderately",
  "Very",
  "Extremely Important",
];

const surveySections = [
  {
    id: "demographic",
    title: "Section 1: Demographic Data ",
    intro: "This section helps us understand who is answering the survey.",
    questions: [
      {
        id: "q1",
        question: "Q1. What is your age?",
        type: "mcq",
        options: ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"],
      },
      {
        id: "q2",
        question: "Q2. What is your profession?",
        type: "mcq",
        helper: "Select all that apply.",
        options: [
          "Student",
          "Healthcare",
          "Education",
          "Technology",
          "Finance/Business",
          "Hospitality/Food Service",
          "Skilled Trades",
          "Creative/Media",
          "Government/Public Service",
          "Retail/Customer Service",
          "Retired",
          "Unemployed",
          "Other",
        ],
      },
      {
        id: "q3",
        question: "Q3. What is your ethnicity?",
        type: "mcq",
        options: [
          "White",
          "Mixed/Multiple ethnic groups",
          "Asian/Asian British",
          "Black/African/Caribbean/Black British",
          "Other ethnic group",
          "Prefer not to say",
        ],
      },
      {
        id: "q4",
        question: "Q4. How long have you lived in your current city or area?",
        type: "mcq",
        options: [
          "Less than 1 year",
          "1–5 years",
          "6–10 years",
          "10+ years",
          "I was born and raised here (Native)",
        ],
      },
    ],
  },
  {
    id: "experience",
    title: "Section 2: Cooking Experience",
    questions: [
      {
        id: "q5",
        question: "Q5. Which best describes your relationship with cooking?",
        type: "mcq",
        options: [
          "The Beginner: I rarely cook and mostly rely on pre-made meals, takeout, or very simple dishes.",
          "The Recipe Follower: I can cook well, but I need a clear recipe to follow; I rarely improvise.",
          "The Confident Cook: I cook regularly and feel comfortable swapping ingredients or adjusting flavors.",
          "The Expert/Professional: I create my own recipes and have a deep understanding of advanced techniques.",
        ],
      },
    ],
  },
  {
    id: "habits",
    title: "Section 3: Current Habits & Frequency",
    intro: "Please select the frequency that best describes your typical week.",
    scale: {
      label: "Scale for Q6–Q8",
      options: frequencyScale,
    },
    questions: [
      {
        id: "q6",
        question: "Q6. How often do you consume pre-packaged or frozen meals?",
        type: "mcq",
        options: frequencyScale,
      },
      {
        id: "q7",
        question: "Q7. How often do you eat out or order food delivery?",
        type: "mcq",
        options: frequencyScale,
      },
      {
        id: "q8",
        question: "Q8. How often do you search for recipes for ingredients you already have?",
        type: "mcq",
        options: frequencyScale,
      },
      {
        id: "q9",
        question:
          "Q9. How much of your fresh grocery inventory goes to waste because you don't know how to use it before it expires?",
        type: "mcq",
        options: wasteScale,
      },
      {
        id: "q10",
        question: "Q10. How many full meals do you typically consume per day?",
        type: "mcq",
        options: mealsScale,
      },
    ],
  },
  {
    id: "challenges",
    title: "Section 4: Challenges & Pain Points",
    intro: "Please rate your agreement with the following statements.",
    scale: {
      label: "Agreement scale for Q11–Q16",
      options: agreementScale,
    },
    questions: [
      {
        id: "q11",
        question: "Q11. I struggle to find recipes for the ingredients I already have.",
        type: "mcq",
        options: agreementScale,
      },
      {
        id: "q12",
        question: "Q12. I find it difficult to locate specific international ingredients.",
        type: "mcq",
        options: agreementScale,
      },
      {
        id: "q13",
        question: "Q13. Grocery shopping takes up too much of my weekly time.",
        type: "mcq",
        options: agreementScale,
      },
      {
        id: "q14",
        question: "Q14. I worry about the nutritional balance and calorie intake of my meals.",
        type: "mcq",
        options: agreementScale,
      },
      {
        id: "q15",
        question: "Q15. Searching for specific ingredients in my locality is a frustrating process.",
        type: "mcq",
        options: agreementScale,
      },
      {
        id: "q16",
        question: "Q16. I struggle to find recipe ideas that meet my dietary restrictions/preferences.",
        type: "mcq",
        options: agreementScale,
      },
    ],
  },
  {
    id: "features",
    title: "Section 5: Feature Importance",
    intro: "How important are the following features to your cooking routine?",
    scale: {
      label: "Importance scale for Q17–Q20",
      options: importanceScale,
    },
    questions: [
      {
        id: "q17",
        question: "Q17. Inventory Search: Finding recipes based on what is in my fridge.",
        type: "mcq",
        options: importanceScale,
      },
      {
        id: "q18",
        question: "Q18. Calorie Tracking: Tracking and planning calorie intake in-app.",
        type: "mcq",
        options: importanceScale,
      },
      {
        id: "q19",
        question: "Q19. Time Efficiency: Knowing total prep/cook time before starting.",
        type: "mcq",
        options: importanceScale,
      },
      {
        id: "q20",
        question: "Q20. Price Comparison: Comparing prices across different local stores.",
        type: "mcq",
        options: importanceScale,
      },
    ],
  },
  {
    id: "budget",
    title: "Section 6: Budget & Logistics",
    questions: [
      {
        id: "q21",
        question: "Q21. On average, how much money do you spend on food groceries per week?",
        type: "mcq",
        options: ["Under £20", "£20–£30", "£30–£40", "£40–£50", "Over £50"],
      },
      {
        id: "q22",
        question: "Q22. Compared to cooking at home, how expensive do you believe eating out is?",
        type: "mcq",
        options: [
          "Much more expensive",
          "Slightly more expensive",
          "About the same cost",
          "Cheaper than cooking at home",
        ],
      },
      {
        id: "q23",
        question:
          "Q23. Would a website that allows you to order recipe ingredients for home delivery be helpful to you?",
        type: "mcq",
        options: ["Yes, definitely", "No, I prefer to shop in person"],
      },
    ],
  },
  {
    id: "feedback",
    title: "Section 7: Final Feedback (Open-Ended)",
    questions: [
      {
        id: "q24",
        question: "Q24. Do you have any specific cooking goals or challenges you would like to overcome?",
        type: "fillup",
        helper:
          "Share a brief note about your goals, constraints, or challenges (e.g., meal planning, reducing waste, learning new techniques) or Please type 'None' if you don't have any specific goals or challenges. ",
      },
    ],
  },
];

const SurveyPage = () => {
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form) || {};
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.sm;
  const [activeSection, setActiveSection] = useState(0);
  const [isSurveySubmitting, setIsSurveySubmitting] = useState(false);

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

  const isAnswered = (question, value) => {
    if (question.type === "msq") return Array.isArray(value) && value.length > 0;
    if (question.type === "fillup") return typeof value === "string" && value.trim().length > 0;
    return value !== undefined && value !== null && value !== "";
  };

  const getSectionProgress = (section) => {
    const total = section.questions.length;
    const answered = section.questions.reduce((count, question) => {
      const value = formValues?.[question.id];
      return isAnswered(question, value) ? count + 1 : count;
    }, 0);
    const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
    return { total, answered, percent };
  };

  const renderOptions = (question) => {
    if (question.type === "mcq") {
      return (
        <Radio.Group className="dash-survey-radio">
          <Flex vertical gap="small">
            {question.options.map((option) => (
              <Radio key={option} value={option}>
                {option}
              </Radio>
            ))}
          </Flex>
        </Radio.Group>
      );
    }

    if (question.type === "msq") {
      return (
        <Checkbox.Group className="dash-survey-checkbox">
          <Flex vertical gap="small">
            {question.options.map((option) => (
              <Checkbox key={option} value={option}>
                {option}
              </Checkbox>
            ))}
          </Flex>
        </Checkbox.Group>
      );
    }

    return (
      <Input.TextArea
        className="dash-survey-input"
        rows={4}
        placeholder="Type your response here..."
      />
    );
  };

  const handleSubmit = async () => {
    if (activeSection !== surveySections.length - 1) {
      message.error("Please complete all sections before submitting.");
      return;
    }
    // message.success("Survey submitted. Thank you for your feedback!");

    const values = form.getFieldsValue(true);

    const payloadToSend = {
      ...values
      
    };
    console.log("Payload to send:", payloadToSend);

    try {
      setIsSurveySubmitting(true);
      const res = await axios.post(`${BASE_URL}/survey`, payloadToSend);

      const status = res?.data?.status;
      console.log("Response from backend:", status, res?.data);
      const msg = res?.data?.message;

      if (status === 1) {
        message.success(msg || "Survey submitted successfully. Thank you for your feedback!");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        navigate("/");
      } else if (status === 0) {
        message.error(msg || "Survey submission failed. Please try again.");
      } else {
        message.error(msg || "Operation failed");
      }
    } catch (err) {
      console.error("POST error:", err);
      message.error("Failed to submit. Check backend route.");
    } finally {
      setIsSurveySubmitting(false);
    }
  };

  const handleSectionChange = (nextIndex) => {
    const safeIndex = Math.max(0, Math.min(nextIndex, surveySections.length - 1));
    setActiveSection(safeIndex);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isSectionComplete = (section) => {
    const progress = getSectionProgress(section);
    return progress.answered === progress.total;
  };

  const currentSection = surveySections[activeSection];

  const handleNext = async () => {
    if (!currentSection) return;
    try {
      await form.validateFields(currentSection.questions.map((q) => q.id));
      handleSectionChange(activeSection + 1);
    } catch {
      message.error("Please answer all questions in this section before continuing.");
    }
  };

  return (
    <div className="lp-root dash-root" ref={rootRef}>
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

      <section className="dash-hero">
        <div className="lp-container">
          <Row justify="center">
            <Col xs={24} sm={22} md={20} lg={18} xl={16}>
              <Flex vertical gap="large" className="dash-stack">
                <Card
                  variant={false}
                  className="lp-glass-card dash-survey"
                  styles={{ body: { padding: isMobile ? 18 : 26 } }}
                >
                  <Flex vertical gap="small" className="dash-survey-head">
                    <Title level={3} className="dash-title">
                      Survey Questions
                    </Title>
                    <Text type="secondary">
                      Help us personalize the experience by sharing a few quick details about your
                      cooking habits and preferences.
                    </Text>
                  </Flex>

                  <Form
                    form={form}
                    layout="vertical"
                    className="dash-survey-form"
                    onFinish={handleSubmit}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      const target = event.target;
                      const isTextArea =
                        target?.tagName === "TEXTAREA" || target?.getAttribute?.("role") === "textbox";
                      if (!isTextArea) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <Form.Item
                      name="email"
                      label="Email address"
                      rules={[
                        { required: true, message: "Email is required." },
                        { type: "email", message: "Enter a valid email address." },
                      ]}
                    >
                      <Input placeholder="you@example.com" type="email" />
                    </Form.Item>

                    <div className="dash-survey-current">
                      <Text className="dash-survey-current-step">
                        Section {activeSection + 1} of {surveySections.length}
                      </Text>
                      <Text type="secondary" className="dash-survey-current-title">
                        {currentSection?.title}
                      </Text>
                    </div>

                    <div className="dash-survey-sections" ref={sectionRef}>
                      {currentSection && (() => {
                        const progress = getSectionProgress(currentSection);
                        return (
                          <div key={currentSection.id} className="dash-survey-section">
                            <Title level={4} className="dash-survey-title">
                              {currentSection.title}
                            </Title>
                            {currentSection.intro && (
                              <Text className="dash-survey-intro" type="secondary">
                                {currentSection.intro}
                              </Text>
                            )}
                            <div className="dash-survey-progress">
                              <Progress percent={progress.percent} size="small" showInfo={false} />
                              <Text type="secondary" className="dash-survey-progress-value">
                                {progress.answered}/{progress.total}
                              </Text>
                            </div>
                            {currentSection.scale && (
                              <div className="dash-survey-scale">
                                <Text className="dash-survey-scale-label" type="secondary">
                                  {currentSection.scale.label}
                                </Text>
                                <div className="dash-survey-scale-pills">
                                  {currentSection.scale.options.map((option) => (
                                    <span key={option} className="dash-survey-scale-pill">
                                      {option}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="dash-survey-questions">
                              {currentSection.questions.map((question) => (
                                <div key={question.id} className="dash-survey-question">
                                  <Text className="dash-survey-question-title">
                                    {question.question}
                                  </Text>
                                  <div className="dash-survey-answer">
                                    {question.helper && (
                                      <Text type="secondary" className="dash-survey-helper">
                                        {question.helper}
                                      </Text>
                                    )}
                                    <Form.Item
                                      name={question.id}
                                      className="dash-survey-item"
                                      rules={[
                                        {
                                          required: true,
                                          message: "This question is required.",
                                          whitespace: question.type === "fillup",
                                        },
                                      ]}
                                    >
                                      {renderOptions(question)}
                                    </Form.Item>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <Flex justify="space-between" align="center" className="dash-survey-nav">
                      <Button
                        className="lp-secondary"
                        disabled={activeSection === 0 || isSurveySubmitting}
                        onClick={() => handleSectionChange(activeSection - 1)}
                      >
                        Previous
                      </Button>
                      {activeSection < surveySections.length - 1 ? (
                        <Button
                          type="primary"
                          className="lp-primary"
                          onClick={handleNext}
                          disabled={!isSectionComplete(currentSection) || isSurveySubmitting}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="lp-primary"
                          disabled={!isSectionComplete(currentSection) || isSurveySubmitting}
                          loading={isSurveySubmitting}
                        >
                          Submit Survey
                        </Button>
                      )}
                    </Flex>
                  </Form>
                </Card>

                <CustomBackTop />
              </Flex>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
};

export default SurveyPage;
