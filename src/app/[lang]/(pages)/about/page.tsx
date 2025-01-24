'use client'

import {
    Code,
    BookOpen,
    Globe,
    User,
    Server,
    Database,
    Braces,
    Shield,
    Target,
    Heart,
    Linkedin,
    Mail,
    Facebook,
    Github,
    Youtube,
    Link
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function AboutPage() {

    const [isLoading, setIsLoading] = useState(true)
    const [isMenuOpen, setIsMenuOpen] = useState(false)


    
    const technologies = [
        {
            icon: <Code className="w-6 h-6 text-blue-500" />,
            name: "Next.js",
            description: "Modern React framework for building performant web applications"
        },
        {
            icon: <Server className="w-6 h-6 text-green-500" />,
            name: "Node.js",
            description: "Powerful JavaScript runtime for building scalable backend services"
        },
        {
            icon: <Braces className="w-6 h-6 text-green-600" />,
            name: "TypeScript",
            description: "Strongly typed programming language that builds on JavaScript"
        },
        {
            icon: <Database className="w-6 h-6 text-purple-500" />,
            name: "Prisma & PostgreSQL",
            description: "Modern ORM with robust PostgreSQL database for reliable data management"
        },
        {
            icon: <Braces className="w-6 h-6 text-pink-500" />,
            name: "Tailwind CSS",
            description: "Utility-first CSS framework for rapid UI development"
        },
        {
            icon: <Shield className="w-6 h-6 text-red-500" />,
            name: "JWT Authentication",
            description: "Secure token-based authentication mechanism"
        }
    ]

    const systemFeatures = [
        {
            icon: <Target className="w-6 h-6 text-blue-500" />,
            title: "Comprehensive Financial Tracking",
            description: "Monitor income, expenses, savings, and investments in one platform"
        },
        {
            icon: <BookOpen className="w-6 h-6 text-green-500" />,
            title: "Detailed Reporting",
            description: "Gain insights through intuitive dashboards and visualizations"
        },
        {
            icon: <Globe className="w-6 h-6 text-purple-500" />,
            title: "Multi-Language Support",
            description: "Available in English, Lao, Thai, and Japanese"
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
                    <div className="px-6 py-8 sm:p-10">
                        <div className="text-center">
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                                Personal Finance Tracker
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                                Your Comprehensive Financial Management Solution
                            </p>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2">
                                About the System
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                Personal Finance Tracker is an innovative web application designed to help individuals
                                take control of their financial journey. By providing intuitive tools for tracking
                                income, expenses, savings, and investments, the system empowers users to make
                                informed financial decisions.
                            </p>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2">
                                Key Features
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {systemFeatures.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg text-center"
                                    >
                                        <div className="flex justify-center mb-4">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2">
                                Technologies Used
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {technologies.map((tech, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg text-center"
                                    >
                                        <div className="flex justify-center mb-4">
                                            {tech.icon}
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                            {tech.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {tech.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                                Developed By
                            </h2>
                            <div className="flex flex-col items-center">
                                <div className="mb-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white-500 shadow-lg mx-auto">
                                        <img src="https://avatars.githubusercontent.com/u/25051846?v=4" alt="Piti Phanthasombath" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Mr. Piti Phanthasombath
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Founder & Lead Developer
                                </p>
                                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 mb-4">
                                    <Heart className="w-4 h-4 text-red-500" />
                                    <span>Developed with assistance from Claude AI</span>
                                </div>

                                {/* Social and Contact Links */}
                                <div className="flex flex-wrap justify-center gap-4 mt-4">
                                    <a
                                        href="https://www.linkedin.com/in/piti-phanthasombath-ba2b87153/"
                                        target="_blank"
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center"
                                    >
                                        <Linkedin className="w-6 h-6 mr-2" />
                                        LinkedIn
                                    </a>
                                    <a
                                        href="mailto:pitidev.lao@gmail.com"
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center"
                                    >
                                        <Mail className="w-6 h-6 mr-2" />
                                        Email
                                    </a>
                                    <a
                                        href="https://www.facebook.com/piti.laos/"
                                        target="_blank"
                                        className="text-blue-700 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400 transition-colors flex items-center"
                                    >
                                        <Facebook className="w-6 h-6 mr-2" />
                                        Facebook
                                    </a>
                                    <a
                                        href="https://github.com/PitiDev"
                                        target="_blank"
                                        className="text-gray-800 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white transition-colors flex items-center"
                                    >
                                        <Github className="w-6 h-6 mr-2" />
                                        GitHub
                                    </a>
                                    <a
                                        href="https://www.youtube.com/@pitidevcode"
                                        target="_blank"
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center"
                                    >
                                        <Youtube className="w-6 h-6 mr-2" />
                                        YouTube
                                    </a>
                                </div>
                            </div>
                            <br />
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2">
                                Buy me a beer
                            </h2>
                            <a className="mt-4 block mx-auto" href="https://www.buymeacoffee.com/pitidev" target="_blank">
                                <img className="mx-auto" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width={217} height={60} />
                            </a>
                            <br />
                            <p className="text-gray-600 dark:text-gray-300">or</p>
                            <br />
                            <p className="text-gray-600 dark:text-gray-300">LAOQR PAYMENT</p>
                            <img className="mx-auto rounded-lg" src="https://iblaos.com/exchange/pro/piti_qr.jpg" alt="Buy Me A Coffee" width={300} height={60} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}