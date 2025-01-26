'use client'

import React, { useState } from 'react';
import { Footer, Navbar } from '@/components/Navigation'
import { getDictionary } from '../../../../../get-dictionary'
import { Locale } from '../../../i18n-config'

import {
    Shield,
    Lock,
    Key,
    UserCheck,
    Server,
    AlertTriangle,
    HardDrive,
    Eye,
    Bell,
    Fingerprint
} from 'lucide-react';

interface SecurityFeature {
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string;
    details: string[];
}

const securityFeatures: SecurityFeature[] = [
    {
        id: 'encryption',
        title: 'End-to-End Encryption',
        icon: <Lock className="h-6 w-6" />,
        description: 'Your financial data is protected with industry-standard encryption.',
        details: [
            'AES-256 encryption for data at rest',
            'TLS 1.3 for data in transit',
            'Secure key management',
            'Regular encryption key rotation'
        ]
    },
    {
        id: 'authentication',
        title: 'Multi-Factor Authentication',
        icon: <Key className="h-6 w-6" />,
        description: 'Additional layers of security to protect your account.',
        details: [
            'Two-factor authentication (2FA)',
            'Biometric authentication support',
            'Security key compatibility',
            'Backup recovery codes'
        ]
    },
    {
        id: 'monitoring',
        title: '24/7 Security Monitoring',
        icon: <Eye className="h-6 w-6" />,
        description: 'Continuous monitoring of our systems for suspicious activity.',
        details: [
            'Real-time threat detection',
            'Automated security scanning',
            'Intrusion prevention systems',
            'Security incident response team'
        ]
    },
    {
        id: 'compliance',
        title: 'Regulatory Compliance',
        icon: <Shield className="h-6 w-6" />,
        description: 'We adhere to international security standards and regulations.',
        details: [
            'GDPR compliance',
            'PCI DSS certification',
            'Regular security audits',
            'Independent security assessments'
        ]
    }
];

interface SecurityTip {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const securityTips: SecurityTip[] = [
    {
        icon: <Fingerprint className="h-6 w-6" />,
        title: 'Use Strong Passwords',
        description: 'Create unique, complex passwords with a mix of letters, numbers, and symbols.'
    },
    {
        icon: <Bell className="h-6 w-6" />,
        title: 'Enable Notifications',
        description: 'Set up alerts for account activities to quickly detect unauthorized access.'
    },
    {
        icon: <UserCheck className="h-6 w-6" />,
        title: 'Regular Security Checks',
        description: 'Review your account activity and security settings periodically.'
    }
];

interface SecurityIncident {
    type: 'success' | 'warning' | 'error';
    message: string;
}

const SecurityCard = ({ feature }: { feature: SecurityFeature }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/50 rounded-lg text-blue-700 dark:text-blue-400">
                    {feature.icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                    </p>
                </div>
            </div>

            <div className={`mt-4 space-y-2 ${isExpanded ? 'block' : 'hidden'}`}>
                {feature.details.map((detail, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>{detail}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
            >
                {isExpanded ? 'Show less' : 'Learn more'}
            </button>
        </div>
    );
};

const SecurityTipCard = ({ tip }: { tip: SecurityTip }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/50 rounded-lg text-green-700 dark:text-green-400">
                {tip.icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tip.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {tip.description}
                </p>
            </div>
        </div>
    </div>
);

const IncidentReportForm = () => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Incident reported:', message);
        setMessage('');
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Report a Security Concern
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Description
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Describe the security issue you've encountered..."
                    />
                </div>
                <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    Submit Report
                </button>
            </form>
        </div>
    );
};

export default function SecurityPage({ lang }: { lang: Locale }) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navbar lang={lang} />

            <main className="flex-grow pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-full">
                                <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Security Center
                        </h1>
                        <p className="text-lg text-gray-700 dark:text-gray-400 max-w-3xl mx-auto">
                            Your financial security is our top priority. Learn about our security measures
                            and best practices to keep your account safe.
                        </p>
                    </div>

                    {/* Security Features */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                            Our Security Features
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            {securityFeatures.map((feature) => (
                                <SecurityCard key={feature.id} feature={feature} />
                            ))}
                        </div>
                    </section>

                    {/* Security Tips */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                            Security Best Practices
                        </h2>
                        <div className="grid gap-6 md:grid-cols-3">
                            {securityTips.map((tip, index) => (
                                <SecurityTipCard key={index} tip={tip} />
                            ))}
                        </div>
                    </section>

                    {/* Security Alert */}
                    <section className="mb-16">
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 rounded-lg">
                            <div className="flex items-center">
                                <AlertTriangle className="h-6 w-6 text-yellow-400" />
                                <p className="ml-3 text-yellow-700 dark:text-yellow-300">
                                    Always verify that you're on the official FinanceTracker website before entering your credentials.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Incident Reporting */}
                    <section className="max-w-2xl mx-auto">
                        <IncidentReportForm />
                    </section>
                </div>
            </main>

            <Footer lang={lang} />
        </div>
    );
}