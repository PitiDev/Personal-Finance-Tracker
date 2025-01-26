'use client'

import React, { useEffect, useState } from 'react';
import { getDictionary } from '../../../../../get-dictionary'
import { Locale } from '../../../i18n-config'
import {
  LayoutDashboard,
  Users,
  FolderTree,
  Receipt,
  PiggyBank,
  Wallet,
  ArrowRightLeft,
  UserCircle,
  BanknoteIcon
} from 'lucide-react';

import { Footer, Navbar } from '@/components/Navigation'
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const features: FeatureCardProps[] = [
  {
    title: 'Dashboard',
    description: 'Get a comprehensive overview of your finances with visual analytics, spending trends, and key financial metrics all in one place.',
    icon: <LayoutDashboard className="w-6 h-6" />,
    color: 'blue'
  },
  {
    title: 'Account Manager',
    description: 'Manage multiple accounts in one place. Track balances, monitor transactions, and organize your financial accounts efficiently.',
    icon: <Users className="w-6 h-6" />,
    color: 'purple'
  },
  {
    title: 'Categories',
    description: 'Organize your transactions with custom categories. Track spending patterns and identify areas for potential savings.',
    icon: <FolderTree className="w-6 h-6" />,
    color: 'green'
  },
  {
    title: 'Transactions',
    description: 'Record and track all your financial transactions. Split, categorize, and add notes to keep your finances organized.',
    icon: <Receipt className="w-6 h-6" />,
    color: 'yellow'
  },
  {
    title: 'Budgets',
    description: 'Set and manage budgets for different categories. Stay on track with spending limits and receive alerts when nearing limits.',
    icon: <BanknoteIcon className="w-6 h-6" />,
    color: 'pink'
  },
  {
    title: 'Savings',
    description: 'Set savings goals and track your progress. Create multiple savings targets and watch your wealth grow over time.',
    icon: <PiggyBank className="w-6 h-6" />,
    color: 'indigo'
  },
  {
    title: 'Loan Manager',
    description: 'Track loans, calculate interest, and manage repayment schedules. Stay on top of your borrowing and lending.',
    icon: <Wallet className="w-6 h-6" />,
    color: 'red'
  },
  {
    title: 'Transfer Amount',
    description: 'Easily transfer money between accounts. Record and track all your fund movements in one place.',
    icon: <ArrowRightLeft className="w-6 h-6" />,
    color: 'cyan'
  },
  {
    title: 'Profile',
    description: 'Manage your personal information, preferences, and notification settings. Keep your account secure and up to date.',
    icon: <UserCircle className="w-6 h-6" />,
    color: 'orange'
  }
];

const colorVariants = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  pink: 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400',
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: keyof typeof colorVariants;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, color }) => (
  <div className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800/90 hover:scale-105">
    <div className={`mb-4 inline-block rounded-lg p-3 ${colorVariants[color]}`}>
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">
      {description}
    </p>
    <div className="absolute inset-0 rounded-lg border-2 border-transparent transition-all duration-300 group-hover:border-blue-500/20 dark:group-hover:border-blue-400/20" />
  </div>
);

export default function FeaturesPage() {

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
    <div>
      {/* Navigation */}
      <Navbar lang={lang} />
      <br />
      <br />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              Our Features
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Discover all the powerful tools and features designed to help you manage your finances effectively and achieve your financial goals.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Ready to take control of your finances?
            </p>
            <button onClick={() => router.push(`/${lang}/register`)} className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              Get Started Now
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <br />

      {/* Footer */}
      <Footer lang={lang} />

    </div>

  );
}