"use client";

import { Button } from "antd";
import { ArrowRightOutlined, CodeOutlined } from "@ant-design/icons";
import React from "react";
import { useStyles } from "./style/styles";

/** Hero section with badge, headline, subheading, and CTA buttons. */
const HeroSection: React.FC = () => {
    const { styles } = useStyles();

    return (
        <section className={styles.hero}>
            <div className={styles.badge}>
                <span className={styles.badgeDot} />
                v2.0 Engine Now Live
            </div>
            <h1 className={styles.heading}>
                Stop guessing why your
                <br />
                <span className={styles.headingGradient}>queries are slow.</span>
            </h1>
            <p className={styles.subheading}>
                AI-powered SQL analysis that understands your schema, detects intent, and rewrites queries
                for maximum performance. Built for production databases.
            </p>
            <div className={styles.ctaRow}>
                <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    iconPosition="end"
                    className={styles.primaryButton}
                >
                    Start Optimising Free
                </Button>
                <Button
                    size="large"
                    icon={<CodeOutlined />}
                    className={styles.secondaryButton}
                >
                    View Documentation
                </Button>
            </div>
        </section>
    );
};

export default HeroSection;
