'use client'

import React, { useState } from 'react';
import { Footer, Navbar } from '@/components/Navigation'
import { getDictionary } from '../../../../../get-dictionary'
import { Locale } from '../../../i18n-config'
import { Shield, Eye, Lock, HardDrive, Share2, Bell, UserCheck, Mail } from 'lucide-react';

interface Section {
    id: string;
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
}

const sections: Section[] = [
    {
        id: 'information-collection',
        title: 'Information We Collect',
        icon: <Eye className="w-6 h-6" />,
        content: (
            <div className="space-y-4 ">
                <p>We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Personal identification information (name, email address, phone number)</li>
                    <li>Financial information (account numbers, transaction history)</li>
                    <li>Profile information (preferences, settings)</li>
                    <li>Communication data (messages, feedback)</li>
                </ul>
                <p>We also automatically collect certain information when you use our service:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (features accessed, time spent)</li>
                    <li>Location information (with your consent)</li>
                </ul>
            </div>
        ),
    },
    {
        id: 'data-usage',
        title: 'How We Use Your Data',
        icon: <HardDrive className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <p>We use the collected information for various purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Providing and maintaining our services</li>
                    <li>Personalizing your experience</li>
                    <li>Processing your transactions</li>
                    <li>Sending notifications about your account</li>
                    <li>Improving our services</li>
                    <li>Complying with legal obligations</li>
                </ul>
            </div>
        ),
    },
    {
        id: 'data-sharing',
        title: 'Information Sharing',
        icon: <Share2 className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <p>We do not sell your personal information. We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Service providers who assist in operating our platform</li>
                    <li>Financial institutions to process transactions</li>
                    <li>Law enforcement when required by law</li>
                </ul>
                <p>All third parties are contractually required to protect your information.</p>
            </div>
        ),
    },
    {
        id: 'data-security',
        title: 'Data Security',
        icon: <Shield className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <p>We implement strong security measures to protect your data:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>End-to-end encryption for sensitive data</li>
                    <li>Regular security audits and updates</li>
                    <li>Secure data storage and transmission</li>
                    <li>Employee access controls and training</li>
                </ul>
            </div>
        ),
    },
    {
        id: 'user-rights',
        title: 'Your Rights',
        icon: <UserCheck className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <p>You have the following rights regarding your data:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Data portability</li>
                </ul>
            </div>
        ),
    },
    {
        id: 'cookies',
        title: 'Cookies Policy',
        icon: <Lock className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Remember your preferences</li>
                    <li>Analyze website traffic</li>
                    <li>Enhance site security</li>
                    <li>Provide personalized content</li>
                </ul>
                <p>You can control cookie settings through your browser preferences.</p>
            </div>
        ),
    },
    {
        id: 'notifications',
        title: 'Communications',
        icon: <Bell className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <p>We may send you notifications regarding:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Account updates and security alerts</li>
                    <li>Service-related announcements</li>
                    <li>Marketing communications (with consent)</li>
                    <li>Legal and privacy policy updates</li>
                </ul>
            </div>
        ),
    },
    {
        id: 'contact',
        title: 'Contact Us',
        icon: <Mail className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <p>If you have questions about this privacy policy, please contact us:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Email: privacy@financetracker.com</li>
                    <li>Address: Vientiane, Laos</li>
                    <li>Phone: +8562052444479</li>
                </ul>
                <p>We aim to respond to all inquiries within 48 hours.</p>
            </div>
        ),
    },
];

const TableOfContents = ({ activeSection, onSectionClick }: {
    activeSection: string;
    onSectionClick: (id: string) => void;
}) => {
    return (
        <nav className="hidden lg:block sticky top-24 self-start">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Contents
                </h2>
                <ul className="space-y-2">
                    {sections.map((section) => (
                        <li key={section.id}>
                            <button
                                onClick={() => onSectionClick(section.id)}
                                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeSection === section.id
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                {section.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default function PrivacyPage({ lang }: { lang: Locale }) {
    const [activeSection, setActiveSection] = useState(sections[0].id);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navbar lang={lang} />

            <main className="flex-grow pt-24 pb-16 text-gray-900 dark:text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Your privacy is important to us. This policy outlines how we collect, use,
                            and protect your personal information when you use our services.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                            Last updated: January 26, 2025
                        </p>
                    </div>

                    <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                        <TableOfContents
                            activeSection={activeSection}
                            onSectionClick={scrollToSection}
                        />

                        <div className="lg:col-span-3">
                            <div className="space-y-12">
                                {sections.map((section) => (
                                    <section
                                        key={section.id}
                                        id={section.id}
                                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                                                {section.icon}
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {section.title}
                                            </h2>
                                        </div>
                                        <div className="prose prose-blue dark:prose-invert max-w-none">
                                            {section.content}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer lang={lang} />
        </div>
    );
}