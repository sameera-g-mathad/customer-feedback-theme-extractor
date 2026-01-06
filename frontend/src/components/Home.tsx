import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquareText, TrendingUp, Lightbulb, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Home: React.FC = () => {
    return <div className="w-full h-full ">
        <FirstSection />
        <SecondSection />
        <Footer />
    </div>;
};

const FirstSection: React.FC = () => {
    const navigate = useNavigate();
    return <div className="w-full h-screen flex flex-col ">
        <div className="relative overflow-hidden">

            <motion.div
                animate={{ x: [0, 100, 0] }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-20 left-1/4 w-96 h-96 bg-sky-200 blur-3xl"
            />

            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.5, 0.75, 0.5],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                className="absolute bottom-20 right-1/4 w-80 h-80 bg-emerald-200 blur-3xl"
            />

            <div className="relative  px-6 py-24 lg:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-200 border border-pink-600 text-pink-600 text-sm font-medium mb-8">
                        <Sparkles className="w-4 h-4" />
                        AI-Powered Feedback Analysis
                    </div>

                    <h1 className="text-xl md:text-6xl lg:text-8xl font-bold text-foreground mb-6 leading-tight">
                        Transform Customer Feedback
                        <br />
                        <motion.span
                            initial={{ clipPath: "inset(0 100% 0 0)" }}
                            animate={{ clipPath: "inset(0 0% 0 0)" }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                            className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-orange-500 to-emerald-500 inline-block"
                        >
                            Into Actionable Insights
                        </motion.span>


                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Upload your customer feedback and let AI extract themes, analyze sentiment,
                        and deliver prioritized recommendations in seconds.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button
                            // size="lg"
                            onClick={() => navigate("/upload")}
                            className="group flex items-center justify-center text-lg px-4 py-2 sm:w-64 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-glow"
                        >
                            Try Now
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    </div>
}

const SecondSection: React.FC = () => {
    const features = [
        {
            icon: MessageSquareText,
            title: "Theme Extraction",
            description: "AI identifies recurring themes and patterns in your feedback",
            borderColor: 'hover:border-rose-300',
            properties: 'group-hover:bg-rose-300',
            textColor: 'text-rose-600'
        },
        {
            icon: TrendingUp,
            title: "Sentiment Analysis",
            description: "Understand customer emotions at a glance",
            borderColor: 'hover:border-teal-300',
            properties: 'group-hover:bg-teal-300',
            textColor: 'text-teal-600'
        },
        {
            icon: Lightbulb,
            title: "Actionable Insights",
            description: "Get prioritized recommendations to improve",
            borderColor: 'hover:border-amber-300',
            properties: 'group-hover:bg-amber-300',
            textColor: 'text-amber-600'
        },
    ];
    return <div className="relative w-full h-screen">

        <div className="relative max-w-6xl mx-auto px-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    How It Works
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Three simple steps to unlock the value hidden in your customer feedback
                </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`group p-8 rounded-2xl bg-card border border-slate-200 transition-all duration-300 hover:shadow-card ${feature.borderColor}`}
                    >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors bg-slate-200 ${feature.properties}`}>
                            <feature.icon className={`w-7 h-7 ${feature.textColor}`} />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-3">
                            {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>

        </div>
    </div>
}

const Footer: React.FC = () => {
    return <footer className="py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-muted-foreground text-sm">
            © 2026 Feedback Theme Extractor. All rights reserved.
        </div>
    </footer>
}