'use client'

import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Navbar, Footer } from '@/components/Navigation';
import { getDictionary } from '../../../../../get-dictionary'
import { Locale } from '../../../i18n-config'
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

// Plan features
const plans = {
    free: {
        name: 'Free',
        price: '0',
        billing: 'forever',
        description: 'Perfect for getting started with personal finance management',
        features: [
            { name: 'Basic expense tracking', included: true },
            { name: 'Up to 2 accounts', included: true },
            { name: 'Monthly budget planning', included: true },
            { name: 'Basic financial reports', included: true },
            { name: 'Mobile app access', included: true },
            { name: 'Email support', included: true },
            { name: 'Investment tracking', included: false },
            { name: 'Loan management', included: false },
            { name: 'Multi-currency support', included: false },
            { name: 'AI-powered insights', included: false },
            { name: 'Priority support', included: false },
            { name: 'Custom categories', included: false },
        ],
        buttonText: 'Get Started Free',
        buttonVariant: 'outline',
        mostPopular: false,
    },
    premium: {
        name: 'Premium',
        price: '4',
        billing: 'per month',
        description: 'Advanced features for comprehensive financial management',
        features: [
            { name: 'Basic expense tracking', included: true },
            { name: 'Unlimited accounts', included: true },
            { name: 'Monthly budget planning', included: true },
            { name: 'Advanced financial reports', included: true },
            { name: 'Mobile app access', included: true },
            { name: 'Priority email support', included: true },
            { name: 'Investment tracking', included: true },
            { name: 'Loan management', included: true },
            { name: 'Multi-currency support', included: true },
            { name: 'AI-powered insights', included: true },
            { name: 'Priority 24/7 support', included: true },
            { name: 'Custom categories', included: true },
        ],
        buttonText: 'Start Premium Trial',
        buttonVariant: 'solid',
        mostPopular: true,
    },
};

interface PricingCardProps {
    plan: typeof plans.free | typeof plans.premium;
}

const PricingCard = ({ plan }: PricingCardProps) => {
    return (
        <div className={`relative rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl
      ${plan.mostPopular
                ? 'border-2 border-blue-500 bg-white dark:bg-gray-800'
                : 'border border-gray-200 bg-white/50 dark:border-gray-700 dark:bg-gray-800/50'}`}>

            {plan.mostPopular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                </div>
            )}

            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                        ${plan.price}
                    </span>
                    <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                        /{plan.billing}
                    </span>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">{plan.description}</p>
            </div>

            <ul className="mt-8 space-y-4">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                        {feature.included ? (
                            <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                        ) : (
                            <X className="h-5 w-5 flex-shrink-0 text-gray-400" />
                        )}
                        <span className={
                            feature.included
                                ? 'text-gray-700 dark:text-gray-300'
                                : 'text-gray-500 dark:text-gray-400'
                        }>
                            {feature.name}
                        </span>
                    </li>
                ))}
            </ul>

            <div className="mt-8">
                <button
                    className={`w-full rounded-lg px-6 py-3 text-center text-sm font-semibold transition-colors
            ${plan.buttonVariant === 'solid'
                            ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                            : 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20'
                        }`}
                >
                    {plan.buttonText}
                </button>
            </div>
        </div>
    );
};

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "What's included in the free plan?",
        answer: "The free plan includes basic expense tracking, up to 2 accounts, monthly budgeting, basic reports, and mobile app access. It's perfect for individuals just starting with personal finance management."
    },
    {
        question: "Can I upgrade from Free to Premium later?",
        answer: "Yes! You can upgrade to Premium at any time. Your existing data will be automatically transferred to your Premium account."
    },
    {
        question: "Is there a trial period for Premium?",
        answer: "Yes, we offer a 14-day free trial of Premium features. You can cancel anytime during the trial period."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and selected local payment methods. All payments are securely processed."
    },
    {
        question: "Can I cancel my Premium subscription?",
        answer: "Yes, you can cancel your Premium subscription at any time. You'll continue to have access to Premium features until the end of your billing period."
    }
];

const FAQ = () => {
    return (
        <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
                Frequently Asked Questions
            </h2>
            <div className="mt-8 space-y-8">
                {faqs.map((faq, index) => (
                    <div key={index} className="rounded-lg bg-white/50 p-6 shadow-sm dark:bg-gray-800/50">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {faq.question}
                        </h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function PricingPage() {
    const router = useRouter();
    const params = useParams();
    const lang = params.lang as Locale;

    const { user, token, logout } = useAuthStore();
    const [dictionary, setDictionary] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDictionary = async () => {
            try {
                setIsLoading(true)
                const fetchedDictionary = await getDictionary(lang)
                setDictionary(fetchedDictionary)
            } catch (error) {
                console.error('Failed to fetch dictionary:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDictionary()
    }, [lang])

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navbar lang={lang} />

            <main className="flex-grow px-4 py-24">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Simple, Transparent Pricing
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Choose the perfect plan for your financial journey
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
                        <PricingCard plan={plans.free} />
                        <PricingCard plan={plans.premium} />
                    </div>

                    {/* Money Back Guarantee */}
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center justify-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                            <span className="text-sm font-medium">30-day money-back guarantee</span>
                        </div>
                    </div>

                    {/* Feature Comparison */}
                    <div className="mt-24 mb-16">
                        <FAQ />
                    </div>
                </div>
            </main>

            <Footer lang={lang} />
        </div>
    );
}