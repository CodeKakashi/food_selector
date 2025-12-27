// LandingPage.jsx
import React, { useMemo, useState } from "react";
import {
    Layout,
    Menu,
    Button,
    Typography,
    Space,
    Row,
    Col,
    Card,
    Tag,
    Select,
    Divider,
    Steps,
    Flex,
    Collapse,
    Image,
    message,
    Tooltip
} from "antd";
import CustomBackTop from "../../components/customTop";

import {
    RocketOutlined,
    SearchOutlined,
    CheckCircleOutlined,
    SafetyOutlined,
    ThunderboltOutlined,
    GlobalOutlined,
    EditOutlined,
    ArrowRightOutlined,
    TrophyOutlined,
    YoutubeOutlined,
} from "@ant-design/icons";
import DishImage from "../dashboard/dishImage.jsx";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph, Link } = Typography;

const features = [
    {
        icon: <ThunderboltOutlined />,
        title: "Fast recipe discovery",
        desc: "Find dishes quickly using ingredients and smart filters.",
        tag: "Speed",
    },
    {
        icon: <SafetyOutlined />,
        title: "Diet-friendly filters",
        desc: "Vegetarian / non-veg, course, prep time and more.",
        tag: "Accuracy",
    },
    {
        icon: <GlobalOutlined />,
        title: "Global cuisine coverage",
        desc: "Explore dishes across states with consistent metadata.",
        tag: "Diversity",
    },
];

const faqs = [
    {
        key: "1",
        label: "How does ingredient matching work?",
        children:
            "You enter ingredients you have. The app highlights missing vs available ingredients and ranks recipes by best match.",
    },
    {
        key: "2",
        label: "Can I filter by state, course, and cooking time?",
        children:
            "Yes. You can filter by course, state, prep time, cook time, and diet type.",
    },
    {
        key: "3",
        label: "Does it work on mobile?",
        children:
            "Yes. The layout is responsive and adapts automatically to smaller screens.",
    },
];

const LandingPage = () => {
    const [diet, setDiet] = useState("vegetarian");
    const [course, setCourse] = useState("Main course");
    const navigate = useNavigate();


    const highlight = useMemo(() => {
        const dietLabel = diet === "vegetarian" ? "Vegetarian" : "Non-veg";
        return `${dietLabel} • ${course}`;
    }, [diet, course]);

    const onStart = () => {
        navigate("/intro");
        message.success("Welccome aboard! Starting your recipe journey...");
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* TOP NAV */}
            <Header
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    background: "#fff",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
            >
                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                    }}
                >
                    <Space align="center" size="middle">
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                display: "grid",
                                placeItems: "center",
                                background: "rgba(22,119,255,0.12)",
                            }}
                            aria-hidden
                        >
                            <RocketOutlined />
                        </div>
                        <div>
                            <Text strong style={{ fontSize: 16 }}>
                                Food Garden
                            </Text>

                        </div>
                    </Space>

                    <Menu
                        mode="horizontal"
                        selectable={false}
                        style={{ flex: 1, justifyContent: "center", borderBottom: "none" }}
                        items={[
                            { key: "features", label: <a href="#features">Features</a> },
                            { key: "how", label: <a href="#how">How it works</a> },
                            { key: "faq", label: <a href="#faq">FAQ</a> },
                        ]}
                    />

                    <Space>
                        <Button type="primary" icon={<ArrowRightOutlined />} onClick={onStart}>
                            Get Started
                        </Button>
                    </Space>
                </div>
            </Header>

            <Content>
                {/* HERO */}
                <section
                    style={{
                        padding: "64px 16px 32px",
                        background:
                            "linear-gradient(180deg, rgba(22,119,255,0.10), rgba(255,255,255,1) 70%)",
                    }}
                >
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                        <Row gutter={[24, 24]} align="middle">
                            <Col xs={24} md={12}>
                                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                                    <Space wrap>
                                        <Tag color="blue" icon={<CheckCircleOutlined />}>
                                            Ingredient-based search
                                        </Tag>
                                        <Tag color="processing">Smart filters</Tag>
                                        <Tag color="green">Clean UI</Tag>
                                    </Space>

                                    <Title style={{ margin: 0, fontSize: 44, lineHeight: 1.1 }}>
                                        Cooking made easy — from what you already have.
                                    </Title>

                                    <Paragraph style={{ margin: 0, fontSize: 16 }}>
                                        Type your ingredients and get the best matching recipes with
                                        diet labels, prep & cook time, and missing ingredient highlights.
                                    </Paragraph>

                                    <Card
                                        style={{ borderRadius: 16 }}
                                        bodyStyle={{ padding: 16 }}
                                    >
                                        <Row gutter={[12, 12]} align="middle">
                                            <Col xs={24} md={10}>
                                                <Select
                                                    value={diet}
                                                    onChange={setDiet}
                                                    style={{ width: "100%" }}
                                                    options={[
                                                        { label: "Vegetarian", value: "vegetarian" },
                                                        { label: "Non-veg", value: "non-vegetarian" },
                                                    ]}
                                                />
                                            </Col>
                                            <Col xs={24} md={10}>
                                                <Select
                                                    value={course}
                                                    onChange={setCourse}
                                                    style={{ width: "100%" }}
                                                    options={[
                                                        { label: "Main course", value: "Main course" },
                                                        { label: "Snack", value: "Snack" },
                                                        { label: "Dessert", value: "Dessert" },
                                                    ]}
                                                />
                                            </Col>
                                            <Col xs={24} md={4}>
                                                <Button
                                                    type="primary"
                                                    block
                                                    icon={<SearchOutlined />}
                                                    onClick={onStart}
                                                >
                                                    Go
                                                </Button>
                                            </Col>

                                            <Col span={24}>
                                                <Text type="secondary">
                                                    Preview: <Text strong>{highlight}</Text>
                                                </Text>
                                            </Col>
                                        </Row>
                                    </Card>

                                    <Space wrap>
                                        <Button size="large" type="primary" onClick={onStart}>
                                            Start finding recipes
                                        </Button>
                                        <Button size="large" href="#how">
                                            See how it works
                                        </Button>
                                    </Space>

                                    <Text type="secondary">
                                        No signup required to try. Works on mobile.
                                    </Text>
                                </Space>
                            </Col>

                            <Col xs={24} md={12}>
                                <Card style={{ borderRadius: 16 }} bodyStyle={{ padding: 16 }}>
                                    <Row gutter={[12, 12]}>
                                        <Col span={24}>
                                            <Title level={4} style={{ margin: 0 }}>
                                                What you’ll see
                                            </Title>
                                            <Text type="secondary">
                                                Available vs Missing ingredients + Quick YouTube link
                                            </Text>
                                        </Col>

                                        <Col span={24}>
                                            <Card bodyStyle={{ padding: 20 }}>
                                                <Flex gap={16} align="flex-start" wrap>
                                                    {/* Image */}
                                                    <DishImage name="Biryani" course="Main course" />

                                                    <div style={{ flex: 1, minWidth: 260 }}>
                                                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                                                            {/* Header */}
                                                            <Flex justify="space-between" align="center">
                                                                <Title level={4} style={{ margin: 0 }}>
                                                                    Biryani
                                                                </Title>

                                                                <Tag color="red">
                                                                    <span
                                                                        style={{
                                                                            display: "inline-block",
                                                                            width: 10,
                                                                            height: 10,
                                                                            borderRadius: "50%",
                                                                            backgroundColor: "#c62828",
                                                                            marginRight: 6,
                                                                        }}
                                                                    />
                                                                    Non-Vegetarian
                                                                </Tag>
                                                            </Flex>

                                                            {/* Meta */}
                                                            <Space wrap size="small">
                                                                <Tag color="blue">Main course</Tag>
                                                                <Tag color="purple">Tamil Nadu</Tag>
                                                                <Tag>Prep: 20 min</Tag>
                                                                <Tag>Cook: 30 min</Tag>
                                                            </Space>

                                                            {/* Ingredients legend */}
                                                            <Flex align="center" gap={8} wrap>
                                                                <Text strong>Ingredients:</Text>
                                                                <Tag color="green">Available</Tag>
                                                                <Tag color="volcano">Missing</Tag>
                                                            </Flex>

                                                            {/* Ingredients */}
                                                            <Space wrap size="small">
                                                                <Tag color="green">
                                                                    <Link
                                                                        href="https://www.google.com/search?q=what+is+rice"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{ color: "inherit" }}
                                                                    >
                                                                        Rice
                                                                    </Link>
                                                                </Tag>

                                                                <Tag color="green">
                                                                    <Link
                                                                        href="https://www.google.com/search?q=what+is+chicken"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{ color: "inherit" }}
                                                                    >
                                                                        Chicken
                                                                    </Link>
                                                                </Tag>

                                                                <Tag color="green">
                                                                    <Link
                                                                        href="https://www.google.com/search?q=what+is+onion"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{ color: "inherit" }}
                                                                    >
                                                                        Onion
                                                                    </Link>
                                                                </Tag>

                                                                <Tag color="volcano">
                                                                    <Link
                                                                        href="https://www.google.com/search?q=what+is+ghee"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{ color: "inherit" }}
                                                                    >
                                                                        Ghee
                                                                    </Link>
                                                                </Tag>

                                                                <Tag color="volcano">
                                                                    <Link
                                                                        href="https://www.google.com/search?q=what+is+curry+leaves"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{ color: "inherit" }}
                                                                    >
                                                                        Curry leaves
                                                                    </Link>
                                                                </Tag>
                                                            </Space>

                                                            {/* CTA */}
                                                            <Tooltip title="Watch on YouTube">
                                                                <Button
                                                                    type="primary"
                                                                    danger
                                                                    icon={<YoutubeOutlined style={{ color: "#fff" }} />}
                                                                    href="https://www.youtube.com/results?search_query=how+to+make+biryani"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
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
                                        </Col>


                                        <Col span={24}>
                                            <Text type="secondary">
                                                Tip: Missing ingredients are highlighted in red.
                                            </Text>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </section>

                {/* FEATURES */}
                <section id="features" style={{ padding: "24px 16px" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                        <Row gutter={[16, 16]} align="stretch">
                            {features.map((f) => (
                                <Col xs={24} md={8} key={f.title}>
                                    <Card style={{ height: "100%", borderRadius: 16 }}>
                                        <Space direction="vertical" size="small">
                                            <Space>
                                                <div
                                                    style={{
                                                        width: 38,
                                                        height: 38,
                                                        borderRadius: 12,
                                                        display: "grid",
                                                        placeItems: "center",
                                                        background: "rgba(22,119,255,0.12)",
                                                    }}
                                                    aria-hidden
                                                >
                                                    {f.icon}
                                                </div>
                                                <Tag>{f.tag}</Tag>
                                            </Space>
                                            <Title level={4} style={{ margin: 0 }}>
                                                {f.title}
                                            </Title>
                                            <Text type="secondary">{f.desc}</Text>
                                        </Space>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section
                    id="how"
                    style={{
                        padding: "56px 16px",
                        background:
                            "linear-gradient(180deg, rgba(22,119,255,0.06), rgba(255,255,255,1) 70%)",
                    }}
                >
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                        <Row gutter={[16, 16]} align="stretch">
                            {/* LEFT: Steps */}
                            <Col xs={24} lg={14}>
                                <Card
                                    style={{
                                        borderRadius: 22,
                                        height: "100%",
                                        boxShadow: "0 14px 40px rgba(0,0,0,0.08)",
                                        background:
                                            "linear-gradient(180deg, rgba(22,119,255,0.05), #ffffff 65%)",
                                    }}
                                    bodyStyle={{ padding: 32 }}
                                >
                                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                                        {/* TOP TAGS */}
                                        <Space wrap size="small">
                                            <Tag color="blue">How it works</Tag>
                                            <Tag color="processing">Ingredient-based matching</Tag>
                                            <Tag color="green">Instant YouTube access</Tag>
                                            <Tag color="gold">Smart ranking</Tag>
                                        </Space>

                                        {/* TITLE */}
                                        <Title level={2} style={{ margin: 0 }}>
                                            Find recipes in just 3 simple steps
                                        </Title>

                                        {/* SUBTITLE */}
                                        <Paragraph
                                            style={{
                                                margin: 0,
                                                fontSize: 16,
                                                maxWidth: 720,
                                            }}
                                        >
                                            Our system helps you cook smarter by using the ingredients you already
                                            have. It ranks recipes intelligently, highlights missing items, and
                                            provides instant video guidance.
                                        </Paragraph>

                                        <Divider style={{ margin: "18px 0" }} />

                                        {/* STEPS */}
                                        <Steps
                                            direction="vertical"
                                            size="default"
                                            current={3}
                                            items={[
                                                {
                                                    title: (
                                                        <Space align="center">
                                                            <EditOutlined style={{ fontSize: 18 }} />
                                                            <Text strong style={{ fontSize: 16 }}>
                                                                Enter ingredients you have
                                                            </Text>
                                                        </Space>
                                                    ),
                                                    description: (
                                                        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                                            Simply type the ingredients available in your kitchen, separated
                                                            by commas. Order does not matter — the system normalizes everything
                                                            automatically.
                                                        </Paragraph>
                                                    ),
                                                },
                                                {
                                                    title: (
                                                        <Space align="center">
                                                            <TrophyOutlined style={{ fontSize: 18 }} />
                                                            <Text strong style={{ fontSize: 16 }}>
                                                                Get intelligently ranked recipes
                                                            </Text>
                                                        </Space>
                                                    ),
                                                    description: (
                                                        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                                            Recipes are ranked based on ingredient match score. Available
                                                            ingredients are highlighted in green, while missing ones are shown
                                                            in red for clarity.
                                                        </Paragraph>
                                                    ),
                                                },
                                                {
                                                    title: (
                                                        <Space align="center">
                                                            <YoutubeOutlined style={{ fontSize: 18 }} />
                                                            <Text strong style={{ fontSize: 16 }}>
                                                                Watch cooking videos instantly
                                                            </Text>
                                                        </Space>
                                                    ),
                                                    description: (
                                                        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                                            With a single click, open a curated YouTube search to follow the
                                                            cooking process step-by-step — perfect for beginners and busy
                                                            cooks.
                                                        </Paragraph>
                                                    ),
                                                },
                                            ]}
                                        />

                                        {/* FOOTER NOTE */}
                                        <Divider style={{ margin: "20px 0 10px" }} />
                                        <div
                                            style={{
                                                width: "100%",
                                                aspectRatio: "16 / 9",
                                                overflow: "hidden",
                                                borderRadius: 12,
                                            }}
                                        >
                                            <Image
                                                src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHRxMG16MmI2d3MyMjh0cXkxMW0yb3BiYTBoeHNiZHl5dGJqdGNhNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/40FmiosxIu2MVJYVih/giphy.gif"
                                                alt="Enter ingredients demo"
                                                preview={false}
                                                style={{ width: "100%", height: "100%" }}
                                                imgStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        </div>

                                        <Text type="secondary" style={{ fontSize: 14 }}>
                                            💡 Tip: You don’t need all ingredients — recipes with fewer missing items
                                            are ranked higher to save time and money.
                                        </Text>
                                    </Space>
                                </Card>

                            </Col>

                            {/* RIGHT: Visuals */}
                            <Col xs={24} lg={10}>
                                <Card
                                    style={{
                                        borderRadius: 18,
                                        height: "100%",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                                    }}
                                    bodyStyle={{ padding: 22 }}
                                >
                                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                                        {/* Logo + tag */}
                                        <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                                            <Space align="center">
                                                <DishImage name="Fancy Food" />
                                                <Divider type="vertical" />
                                                <div style={{ lineHeight: 1.1 }}>
                                                    <Text strong style={{ fontSize: 16 }}>
                                                        Food Selector
                                                    </Text>
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            Quick demo
                                                        </Text>
                                                    </div>
                                                </div>
                                            </Space>

                                            <Tag color="geekblue">Live preview</Tag>
                                        </Space>



                                        {/* GIF 1 */}
                                        <Card size="small" style={{ borderRadius: 14 }} bodyStyle={{ padding: 12 }}>
                                            <Space direction="vertical" style={{ width: "100%" }} size={8}>
                                                <Space wrap>
                                                    <Tag color="blue">Step 1</Tag>
                                                    <Text strong>Enter ingredients</Text>
                                                </Space>

                                                <div
                                                    style={{
                                                        width: "100%",
                                                        aspectRatio: "16 / 9",
                                                        overflow: "hidden",
                                                        borderRadius: 12,
                                                    }}
                                                >
                                                    <Image
                                                        src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGxydG56cXozZHBpM2xxc2JvcGgwNzJncTE0bGJvcnZjM2F2eWFvbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Sm9AfJRiZofjlrkAAl/giphy.gif"
                                                        alt="Enter ingredients demo"
                                                        preview={false}
                                                        style={{ width: "100%", height: "100%" }}
                                                        imgStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                </div>
                                            </Space>
                                        </Card>


                                        <Card size="small" style={{ borderRadius: 14 }} bodyStyle={{ padding: 12 }}>
                                            <Space direction="vertical" style={{ width: "100%" }} size={8}>
                                                <Space wrap>
                                                    <Tag color="processing">Step 2</Tag>
                                                    <Text strong>See ranked recipes</Text>
                                                </Space>

                                                <div
                                                    style={{
                                                        width: "100%",
                                                        aspectRatio: "16 / 9",
                                                        overflow: "hidden",
                                                        borderRadius: 12,
                                                    }}
                                                >
                                                    <Image
                                                        src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmh6NmlrZDZ0OWQwNmsweTdpYmgxdjg3dHNudXdxYXd5NXB6eDA4biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XubBxPcizx7PVPBSP9/giphy.gif"
                                                        alt="Ranked recipes demo"
                                                        preview={false}
                                                        style={{ width: "100%", height: "100%" }}
                                                        imgStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                </div>
                                            </Space>
                                        </Card>


                                        <Card size="small" style={{ borderRadius: 14 }} bodyStyle={{ padding: 12 }}>
                                            <Space direction="vertical" style={{ width: "100%" }} size={8}>
                                                <Space wrap>
                                                    <Tag color="red">Step 3</Tag>
                                                    <Text strong>Watch on YouTube</Text>
                                                </Space>

                                                <div
                                                    style={{
                                                        width: "100%",
                                                        aspectRatio: "16 / 9",
                                                        overflow: "hidden",
                                                        borderRadius: 12,
                                                    }}
                                                >
                                                    <Image
                                                        src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmh0eHlibGJoazJ0ajFhYWUyMTUwdzFyYWQ0ZTY4enE5MGhjdzA5ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UrEQirmnMPxBwToULv/giphy.gif"
                                                        alt="YouTube demo"
                                                        preview={false}
                                                        style={{ width: "100%", height: "100%" }}
                                                        imgStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                </div>
                                            </Space>
                                        </Card>


                                    </Space>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </section>


                {/* FAQ */}
                <section id="faq" style={{ padding: "24px 16px 64px" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                        <Title level={3} style={{ marginTop: 0 }}>
                            FAQ
                        </Title>
                        <Collapse items={faqs} style={{ borderRadius: 16 }} />
                    </div>
                </section>

                {/* BACK TO TOP */}
                <CustomBackTop />
            </Content>

            <Footer style={{ textAlign: "center" }}>
                <Space direction="vertical" size={2}>
                    <Text strong>Food Selector</Text>
                    <Text type="secondary">© {new Date().getFullYear()} • Built with ❤️</Text>
                </Space>
            </Footer>
        </Layout>
    );
};

export default LandingPage;
