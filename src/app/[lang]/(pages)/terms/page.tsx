'use client'

import React, { useEffect, useState } from 'react';
import { Footer, Navbar } from '@/components/Navigation'
import { getDictionary } from '../../../../../get-dictionary'
import { Locale } from '../../../i18n-config'
import {
    Scale,
    FileText,
    Shield,
    Ban,
    UserCog,
    CreditCard,
    AlertTriangle,
    HelpCircle
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useParams, useRouter } from 'next/navigation';

interface Section {
    id: string;
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
}

const sections: Section[] = [
    {
        id: 'acceptance',
        title: 'Acceptance of Terms',
        icon: <FileText className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <p>By accessing or using FinanceTracker, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
                <p>We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the service following any changes indicates your acceptance of such changes.</p>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-400">Important Notice</h4>
                    <p className="text-yellow-700 dark:text-yellow-300 mt-2">These terms constitute a legally binding agreement between you and FinanceTracker.</p>
                </div>
            </div>
        ),
    },
    {
        id: 'account-terms',
        title: 'Account Terms',
        icon: <UserCog className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Account Requirements</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li>You must be at least 18 years old to use this service</li>
                    <li>You must provide accurate and complete registration information</li>
                    <li>You are responsible for maintaining the security of your account</li>
                    <li>You must notify us immediately of any unauthorized access</li>
                </ul>

                <h3 className="font-semibold text-gray-900 dark:text-white mt-6">Account Responsibilities</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li>You are responsible for all activity that occurs under your account</li>
                    <li>You may not share your account credentials with others</li>
                    <li>You must keep your contact information up to date</li>
                </ul>
            </div>
        ),
    },
    {
        id: 'payment-terms',
        title: 'Payment Terms',
        icon: <CreditCard className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <p>For paid services, the following terms apply:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Payments are processed securely through our payment providers</li>
                    <li>Subscription fees are billed in advance on a monthly or annual basis</li>
                    <li>You can cancel your subscription at any time</li>
                    <li>Refunds are provided in accordance with our refund policy</li>
                </ul>

                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-400">Premium Features</h4>
                    <p className="text-blue-700 dark:text-blue-300 mt-2">Premium features are only accessible while your subscription is active.</p>
                </div>
            </div>
        ),
    },
    {
        id: 'service-rules',
        title: 'Service Rules',
        icon: <Scale className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <p>When using our service, you agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe upon the rights of others</li>
                    <li>Use the service for any illegal activities</li>
                    <li>Attempt to gain unauthorized access to any part of the service</li>
                    <li>Use the service to transmit harmful code or conduct malicious activities</li>
                    <li>Interfere with the proper functioning of the service</li>
                </ul>
            </div>
        ),
    },
    {
        id: 'data-security',
        title: 'Data Security',
        icon: <Shield className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <p>We take data security seriously and implement the following measures:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption of sensitive financial data</li>
                    <li>Regular security audits and updates</li>
                    <li>Secure data transmission protocols</li>
                    <li>Industry-standard security practices</li>
                </ul>
                <p>While we implement security measures, you are responsible for:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>Ensuring secure access to your devices</li>
                    <li>Reporting any suspicious activity</li>
                </ul>
            </div>
        ),
    },
    {
        id: 'prohibited-uses',
        title: 'Prohibited Uses',
        icon: <Ban className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <p>The following activities are strictly prohibited:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Unauthorized access or use of other users' accounts</li>
                    <li>Spreading malware or harmful code</li>
                    <li>Attempting to disrupt or damage the service</li>
                    <li>Using the service for fraudulent purposes</li>
                    <li>Violating any applicable laws or regulations</li>
                </ul>
                <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold text-red-800 dark:text-red-400">Warning</h4>
                    <p className="text-red-700 dark:text-red-300 mt-2">Violation of these terms may result in immediate account termination.</p>
                </div>
            </div>
        ),
    },
    {
        id: 'disclaimers',
        title: 'Disclaimers & Limitations',
        icon: <AlertTriangle className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <p>Please be aware of the following disclaimers:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>The service is provided "as is" without warranties of any kind</li>
                    <li>We do not guarantee uninterrupted or error-free service</li>
                    <li>We are not responsible for financial decisions made based on the service</li>
                    <li>Our liability is limited to the extent permitted by law</li>
                </ul>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mt-4">
                    <p className="text-gray-700 dark:text-gray-300">Users are encouraged to maintain their own financial records and verify all calculations.</p>
                </div>
            </div>
        ),
    },
    {
        id: 'support',
        title: 'Support & Contact',
        icon: <HelpCircle className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <p>For questions about these terms:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Email: privacy@financetracker.com</li>
                    <li>Address: Vientiane, Laos</li>
                    <li>Phone: +8562052444479</li>
                </ul>
                <p>Support hours: Monday - Friday, 9:00 AM - 5:00 PM EST</p>
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
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
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

export default function TermsPage() {
    const router = useRouter();
    const { user, token, logout } = useAuthStore();
    const params = useParams();
    const lang = params.lang as Locale;
    const [dictionary, setDictionary] = useState<any>({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const initializePage = async () => {
            try {
                const dict = await getDictionary(lang);
                setDictionary(dict);

                
            } catch (error) {
                console.error('Page initialization failed:', error);
            }
        };

        initializePage();
    }, [lang, router]);
    
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

            <main className="flex-grow pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
                            Please read these terms carefully before using our services. By using FinanceTracker,
                            you agree to be bound by these terms and conditions.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-500 mt-4">
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
                                        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg text-blue-700 dark:text-blue-400">
                                                {section.icon}
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {section.title}
                                            </h2>
                                        </div>
                                        <div className="text-gray-700 dark:text-gray-300">
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