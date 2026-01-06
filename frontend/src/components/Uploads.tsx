import { motion } from "framer-motion";
import { FeedBackUpload } from "./FeedBackUpload";
import { Sparkles } from 'lucide-react'

export const Uploads = () => {
    return (
        <div className="w-full min-h-screen py-20 bg-gray-50">
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-200 border border-pink-600 text-pink-600 text-sm font-medium mb-6"
                >
                    <Sparkles className="w-4 h-4" />
                    AI-Powered Customer Insights
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold text-foreground mb-4"
                >
                    Turn feedback into
                    <span className="text-gradient"> actionable insights</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-muted-foreground max-w-xl mx-auto"
                >
                    Upload your customer feedback files and let AI extract themes,
                    analyze sentiment, and prioritize what to fix first.
                </motion.p>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full flex justify-center"
            >
                <FeedBackUpload />
            </motion.div>
        </div>
    );
};
