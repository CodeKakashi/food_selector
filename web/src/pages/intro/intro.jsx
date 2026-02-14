// LandingPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./intro.css";
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
    Grid
} from "antd";
import CustomBackTop from "../../components/customTop";
import ThemeToggle from "../../components/ThemeToggle.jsx";
import logo from "../../logo.svg";
import basilSvg from "../../assets/ingredients/basil.svg";
import lemonSvg from "../../assets/ingredients/lemon.svg";
import pepperSvg from "../../assets/ingredients/pepper.svg";

import {
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
const { Title, Text, Paragraph } = Typography;

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
    const rootRef = useRef(null);
    const [diet, setDiet] = useState("vegetarian");
    const [course, setCourse] = useState("Main course");
    const [pulseKind, setPulseKind] = useState("");
    const navigate = useNavigate();
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.sm;


    const highlight = useMemo(() => {
        const dietLabel = diet === "vegetarian" ? "Vegetarian" : "Non-veg";
        return `${dietLabel} • ${course}`;
    }, [diet, course]);

    // Parallax: smooth, inertia-like motion for background + floating ingredients.
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
            mx = (e.clientX / w - 0.5) * 2; // -1..1
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

    // Scroll-trigger reveals (staggered).
    useEffect(() => {
        const root = rootRef.current;
        if (!root || typeof window === "undefined") return;

        const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
        if (reduceMotion) return;

        const els = Array.from(root.querySelectorAll("[data-reveal]"));
        if (els.length === 0) return;

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-in");
                    io.unobserve(entry.target);
                });
            },
            { threshold: 0.18 }
        );

        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    const onNavTo = (e, id) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const onStart = () => {
        navigate("/intro");
        message.success("Welcome aboard! Starting your recipe journey...");
    };

    const pulseAttr = pulseKind || undefined;

    const showcase = useMemo(
        () => [
            {
                key: "basil",
                name: "Basil Pesto Pasta",
                course: "Main course",
                state: "Italy",
                diet: "Vegetarian",
                pulse: "basil",
                reveal: "from-left",
            },
            {
                key: "lemon",
                name: "Lemon Rice",
                course: "Main course",
                state: "Tamil Nadu",
                diet: "Vegetarian",
                pulse: "lemon",
                reveal: "from-right",
            },
            {
                key: "pepper",
                name: "Pepper Chicken",
                course: "Main course",
                state: "Kerala",
                diet: "Non-Vegetarian",
                pulse: "pepper",
                reveal: "from-left",
            },
        ],
        []
    );

    return (
        <div className="lp-root" ref={rootRef} data-pulse={pulseAttr}>
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

            <Layout style={{ minHeight: "100vh" }}>
                {/* TOP NAV */}
                <Header className="lp-header">
                    <div className="lp-container">
                        <Row align="middle" gutter={[12, 12]}>
                            <Col xs={24} md={8}>
                                <div className="lp-brand">
                                    <Image
                                        src={logo}
                                        alt="Thenu's Cook Book logo"
                                        preview={false}
                                        style={{
                                            width: isMobile ? 46 : 54,
                                            height: isMobile ? 64 : 72,
                                            display: "block",
                                            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.35))",
                                        }}
                                    />
                                    <Text className="lp-brand-name">Thenu's Cook Book</Text>
                                </div>
                            </Col>

                            <Col xs={0} md={10}>
                                <Menu
                                    className="lp-menu"
                                    mode="horizontal"
                                    selectable={false}
                                    items={[
                                        {
                                            key: "features",
                                            label: (
                                                <a href="#features" onClick={(e) => onNavTo(e, "features")}>
                                                    Features
                                                </a>
                                            ),
                                        },
                                        {
                                            key: "how",
                                            label: (
                                                <a href="#how" onClick={(e) => onNavTo(e, "how")}>
                                                    How it works
                                                </a>
                                            ),
                                        },
                                        {
                                            key: "faq",
                                            label: (
                                                <a href="#faq" onClick={(e) => onNavTo(e, "faq")}>
                                                    FAQ
                                                </a>
                                            ),
                                        },
                                    ]}
                                />
                            </Col>

                            <Col xs={24} md={6}>
                                <Space
                                    direction={isMobile ? "vertical" : "horizontal"}
                                    align="center"
                                    style={{ width: "100%", justifyContent: isMobile ? "stretch" : "flex-end" }}
                                >
                                    <Button
                                        type="primary"
                                        icon={<ArrowRightOutlined />}
                                        onClick={onStart}
                                        block={isMobile}
                                        className="lp-primary"
                                    >
                                        Get Started
                                    </Button>
                                    <ThemeToggle placement="inline" />
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </Header>

                <Content>
                    {/* HERO */}
                    <section className="lp-hero">
                        <div className="lp-container">
                            <Row gutter={[24, 24]} align="top">
                                <Col xs={24} md={12}>
                                    <div className="lp-hero-sticky">
                                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                                            <Space wrap data-reveal style={{ "--reveal-delay": "0ms" }}>
                                                <Tag className="lp-pill" icon={<CheckCircleOutlined />}>
                                                    Ingredient-based search
                                                </Tag>
                                                <Tag className="lp-pill">Smart filters</Tag>
                                                <Tag className="lp-pill">Missing highlights</Tag>
                                            </Space>

                                            <Title
                                                className="lp-hero-title"
                                                data-reveal
                                                style={{ "--reveal-delay": "90ms" }}
                                            >
                                                A restaurant-style recipe picker, built for your kitchen.
                                            </Title>

                                            <Paragraph
                                                className="lp-hero-sub"
                                                data-reveal
                                                style={{ "--reveal-delay": "170ms" }}
                                            >
                                                Start with what you have. We'll rank recipes, flag missing ingredients,
                                                and send you straight to a YouTube walkthrough.
                                            </Paragraph>

                                            <Card
                                                className="lp-glass-card"
                                                data-reveal
                                                style={{ "--reveal-delay": "260ms" }}
                                                onMouseEnter={() => setPulseKind(diet === "vegetarian" ? "basil" : "pepper")}
                                                onMouseLeave={() => setPulseKind("")}
                                            >
                                                <Row gutter={[12, 12]} align="middle">
                                                    <Col xs={24} md={10}>
                                                        <Space direction="vertical" size={6} style={{ width: "100%" }}>
                                                            <Text type="secondary">Diet</Text>
                                                            <Select
                                                                value={diet}
                                                                onChange={setDiet}
                                                                style={{ width: "100%" }}
                                                                options={[
                                                                    { label: "Vegetarian", value: "vegetarian" },
                                                                    { label: "Non-veg", value: "non-vegetarian" },
                                                                ]}
                                                            />
                                                        </Space>
                                                    </Col>
                                                    <Col xs={24} md={10}>
                                                        <Space direction="vertical" size={6} style={{ width: "100%" }}>
                                                            <Text type="secondary">Course</Text>
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
                                                        </Space>
                                                    </Col>
                                                    <Col xs={24} md={4}>
                                                        <Button
                                                            type="primary"
                                                            block
                                                            icon={<SearchOutlined />}
                                                            onClick={onStart}
                                                            className="lp-primary"
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

                                            <Space wrap data-reveal style={{ "--reveal-delay": "340ms" }}>
                                                <Button
                                                    size="large"
                                                    type="primary"
                                                    className="lp-primary"
                                                    onClick={onStart}
                                                    icon={<ArrowRightOutlined />}
                                                >
                                                    Start finding recipes
                                                </Button>
                                                <Button
                                                    size="large"
                                                    className="lp-secondary"
                                                    href="#how"
                                                    onClick={(e) => onNavTo(e, "how")}
                                                >
                                                    See how it works
                                                </Button>
                                            </Space>

                                            <Text className="lp-fineprint" data-reveal style={{ "--reveal-delay": "410ms" }}>
                                                No signup. Works on mobile. Install to your home screen for an app-like feel.
                                            </Text>
                                        </Space>
                                    </div>
                                </Col>

                                <Col xs={24} md={12}>
                                    <div className="lp-showcase">
                                        {showcase.map((item, idx) => (
                                            <Card
                                                key={item.key}
                                                className={`lp-glass-card lp-showcase-card ${item.reveal}`}
                                                data-reveal
                                                style={{ "--reveal-delay": `${160 + idx * 120}ms` }}
                                                onMouseEnter={() => setPulseKind(item.pulse)}
                                                onMouseLeave={() => setPulseKind("")}
                                            >
                                                <Flex gap={16} align="center" wrap>
                                                    <DishImage
                                                        name={item.name}
                                                        course={item.course}
                                                        size={isMobile ? 110 : 140}
                                                    />

                                                    <Space direction="vertical" size={6} style={{ flex: 1, minWidth: 220 }}>
                                                        <Title level={4} className="lp-showcase-title">
                                                            {item.name}
                                                        </Title>

                                                        <Space wrap size="small">
                                                            <Tag className="lp-pill">{item.diet}</Tag>
                                                            <Tag className="lp-pill">{item.course}</Tag>
                                                            <Tag className="lp-pill">{item.state}</Tag>
                                                        </Space>

                                                        <Text type="secondary" className="lp-fineprint">
                                                            Hover to glow the matching ingredients in the background.
                                                        </Text>
                                                    </Space>
                                                </Flex>
                                            </Card>
                                        ))}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </section>

                    {/* FEATURES */}
                    <section id="features" className="lp-section">
                        <div className="lp-container">
                            <Title
                                level={2}
                                className="lp-section-title"
                                data-reveal
                                style={{ "--reveal-delay": "0ms" }}
                            >
                                Features
                            </Title>
                            <Row gutter={[16, 16]} align="stretch">
                                {features.map((f, idx) => (
                                    <Col xs={24} md={8} key={f.title}>
                                        <Card
                                            className="lp-glass-card"
                                            style={{ height: "100%", "--reveal-delay": `${90 + idx * 90}ms` }}
                                            data-reveal
                                        >
                                            <Space direction="vertical" size="small">
                                                <Space>
                                                    <div
                                                        style={{
                                                            width: 42,
                                                            height: 42,
                                                            borderRadius: 14,
                                                            display: "grid",
                                                            placeItems: "center",
                                                            background: "rgba(255,255,255,0.06)",
                                                            border: "1px solid rgba(255,255,255,0.10)",
                                                            color: "rgba(255,255,255,0.90)",
                                                        }}
                                                        aria-hidden
                                                    >
                                                        {f.icon}
                                                    </div>
                                                    <Tag className="lp-pill">{f.tag}</Tag>
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
                    <section id="how" className="lp-section">
                        <div className="lp-container">
                            <Row gutter={[16, 16]} align="stretch">
                                {/* LEFT: Steps */}
                                <Col xs={24} lg={14}>
                                    <Card
                                        className="lp-glass-card"
                                        data-reveal
                                        style={{ height: "100%", "--reveal-delay": "0ms" }}
                                        bodyStyle={{ padding: isMobile ? 20 : 32 }}
                                    >
                                        <Space direction="vertical" size="large" style={{ width: "100%" }}>
                                            {/* TOP TAGS */}
                                            <Space wrap size="small">
                                                <Tag className="lp-pill">How it works</Tag>
                                                <Tag className="lp-pill">Ingredient-based matching</Tag>
                                                <Tag className="lp-pill">Instant YouTube access</Tag>
                                                <Tag className="lp-pill">Smart ranking</Tag>
                                            </Space>

                                            {/* TITLE */}
                                            <Title level={2} className="lp-section-title" style={{ margin: 0 }}>
                                                Find recipes in just 3 simple steps
                                            </Title>

                                            {/* SUBTITLE */}
                                            <Paragraph
                                                className="lp-hero-sub"
                                                style={{
                                                    margin: 0,
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
                                                Tip: You don’t need all ingredients — recipes with fewer missing items are
                                                ranked higher to save time and money.
                                            </Text>
                                        </Space>
                                    </Card>

                                </Col>

                                {/* RIGHT: Visuals */}
                                <Col xs={24} lg={10}>
                                    <Card
                                        className="lp-glass-card"
                                        data-reveal
                                        style={{ height: "100%", "--reveal-delay": "120ms" }}
                                        bodyStyle={{ padding: isMobile ? 18 : 22 }}
                                    >
                                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                                            {/* Logo + tag */}
                                            <Space align="center" style={{ justifyContent: "space-between", width: "100%" }}>
                                                <Space align="center">
                                                    <DishImage name="Fancy Food" />
                                                    <Divider type="vertical" />
                                                    <div style={{ lineHeight: 1.1 }}>
                                                        <Text strong style={{ fontSize: 16 }}>
                                                            Thenu's Cook Book
                                                        </Text>
                                                        <div>
                                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                                Quick demo
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </Space>

                                                <Tag className="lp-pill">Live preview</Tag>
                                            </Space>



                                            {/* GIF 1 */}
                                            <Card
                                                size="small"
                                                className="lp-glass-card"
                                                data-reveal
                                                style={{ borderRadius: 14, boxShadow: "none", "--reveal-delay": "240ms" }}
                                                bodyStyle={{ padding: 12 }}
                                            >
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


                                            <Card
                                                size="small"
                                                className="lp-glass-card"
                                                data-reveal
                                                style={{ borderRadius: 14, boxShadow: "none", "--reveal-delay": "320ms" }}
                                                bodyStyle={{ padding: 12 }}
                                            >
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


                                            <Card
                                                size="small"
                                                className="lp-glass-card"
                                                data-reveal
                                                style={{ borderRadius: 14, boxShadow: "none", "--reveal-delay": "400ms" }}
                                                bodyStyle={{ padding: 12 }}
                                            >
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
                    <section id="faq" className="lp-section">
                        <div className="lp-container">
                            <Title
                                level={2}
                                className="lp-section-title"
                                data-reveal
                                style={{ "--reveal-delay": "0ms" }}
                            >
                                FAQ
                            </Title>
                            <Card
                                className="lp-glass-card"
                                data-reveal
                                style={{ "--reveal-delay": "120ms" }}
                            >
                                <Collapse items={faqs} ghost />
                            </Card>
                        </div>
                    </section>

                    <CustomBackTop />
                    {/* BACK TO TOP */}
                </Content>

                <Footer className="lp-footer">
                    <Space direction="vertical" size={2}>
                        <Text strong>Thenu's Cook Book</Text>
                        <Text type="secondary">
                            © {new Date().getFullYear()} • Built with love
                        </Text>
                    </Space>
                </Footer>
            </Layout>
        </div>
    );
};

export default LandingPage;
