'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useAuthStore } from '@/store/authStore'
import {
    Loader2,
    LayoutDashboard,
    LogOut,
    DollarSign,
    TrendingUp,
    TrendingDown,
    LineChart as LineChartIcon,
    PiggyBank,
    Target,
    Banknote
} from 'lucide-react'
import { getDictionary } from '../../../../../get-dictionary'
import { Locale } from '../../../i18n-config'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
    Pie,
    PieChart
} from 'recharts'

// Utility function for number formatting
const formatAmount = (amount: string | number): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(num);
};

interface DashboardData {
    income_expense_summary: {
        type: string;
        total_amount: string;
        transaction_count: number;
    }[];
    top_spending_categories: {
        category_name: string;
        total_spent: string;
        percentage: string;
    }[];
    budget_overview: {
        total_budgets: number;
        total_budgeted: string;
        avg_budget_utilization: string;
    };
    investment_summary: {
        total_invested: string;
        current_total_value: string;
        total_return_percentage: string;
    };
    monthly_trend: {
        month: number;
        total_income: string;
        total_expense: string;
    }[];
    savings_goal_summary: {
        total_goals: number;
        total_saved: string;
        total_target: string;
        overall_progress: string;
    };
}

const useDashboardData = (token: string) => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/dashboard/report', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                const result = await response.json();
                setData(result.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchDashboardData();
        }
    }, [token]);

    return { data, error, isLoading };
};

// Custom colors for pie chart
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6']

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
            <div className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="text-gray-900 dark:text-white font-medium">{data.name}</p>
                <p className="text-gray-600 dark:text-gray-300">${data.value.toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-300">{data.percentage}%</p>
            </div>
        )
    }
    return null
}

// Custom Legend content
const CustomLegend = (props: any) => {
    const { payload } = props
    return (
        <ul className="flex flex-col gap-2">
            {payload.map((entry: any, index: number) => (
                <li
                    key={`item-${index}`}
                    className="flex items-center gap-2 text-sm"
                >
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-gray-600 dark:text-gray-300">
                        {entry.value} ({entry.payload.percentage}%)
                    </span>
                </li>
            ))}
        </ul>
    )
}

const SpendingPieChart = ({ data }: { data: any[] }) => {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 shadow-lg rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Top Spending Categories</h2>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({
                                cx,
                                cy,
                                midAngle,
                                innerRadius,
                                outerRadius,
                                percentage,
                            }) => {
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180)
                                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180)
                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        fill="#fff"
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        className="text-xs"
                                    >
                                        {`${percentage.toFixed(1)}%`}
                                    </text>
                                )
                            }}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            content={<CustomLegend />}
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Additional percentage details below the chart */}
            <div className="mt-4 grid grid-cols-2 gap-4">
                {data.map((category, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {category.name}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {category.percentage}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const router = useRouter();
    const params = useParams();
    const lang = params.lang as Locale;

    const { user, token, logout } = useAuthStore();
    const [dictionary, setDictionary] = useState<any>({});
    const { data, error, isLoading: dataLoading } = useDashboardData(token || '');
    const [isLoading, setIsLoading] = useState(true);

    // Transform categories data for pie chart
    const pieChartData = data?.top_spending_categories.map(category => ({
        name: category.category_name,
        value: parseFloat(category.total_spent),
        percentage: parseFloat(category.percentage)
    })) || []

    useEffect(() => {
        const initializeDashboard = async () => {
            try {
                const dict = await getDictionary(lang);
                setDictionary(dict);

                await new Promise(resolve => setTimeout(resolve, 100));
                const { user, token } = useAuthStore.getState();
                if (!user || !token) {
                    router.push(`/${lang}/login`);
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Dashboard initialization failed:', error);
            }
        };

        initializeDashboard();
    }, [lang, router]);

    const handleLogout = () => {
        logout();
        router.push(`/${lang}/login`);
    };

    const calculateProgressPercentages = () => {
        const income = parseFloat(data?.income_expense_summary.find(item => item.type === 'income')?.total_amount || '0');
        const expense = parseFloat(data?.income_expense_summary.find(item => item.type === 'expense')?.total_amount || '0');
        const savedAmount = parseFloat(data?.savings_goal_summary.total_saved || '0');

        const netBalance = savedAmount + (income - expense);
        const total = income + expense + Math.abs(netBalance);

        return {
            incomePercent: total > 0 ? (income / total) * 100 : 0,
            expensePercent: total > 0 ? (expense / total) * 100 : 0,
            balancePercent: total > 0 ? (Math.abs(netBalance) / total) * 100 : 0,
            netBalance: netBalance
        };
    };

    if (isLoading || !dictionary.dashboard || dataLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
                <div className="text-red-500 text-center">
                    <h2 className="text-2xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const income = data?.income_expense_summary.find(item => item.type === 'income');
    const expense = data?.income_expense_summary.find(item => item.type === 'expense');

    // Format data for the line chart
    const formattedMonthlyTrend = data?.monthly_trend.map(item => ({
        ...item,
        total_income: parseFloat(item.total_income),
        total_expense: parseFloat(item.total_expense)
    }));

    const { incomePercent, expensePercent, balancePercent, netBalance } = calculateProgressPercentages();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-2">
                        <LayoutDashboard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {dictionary.dashboard.title}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <span className="text-gray-600 dark:text-gray-300 transition-colors">
                            {dictionary.dashboard.welcome}, {user?.username}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            {dictionary.dashboard.logout}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* <DashboardWidget
                        title={dictionary.dashboard.totalSavings}
                        value={`${formatAmount(data?.savings_goal_summary.total_saved || '0')}`}
                        color="green"
                        icon={<PiggyBank className="w-6 h-6" />}
                    /> */}
                    <DashboardWidget
                        title={dictionary.dashboard.monthlyIncome}
                        value={`${formatAmount(income?.total_amount || '0')}`}
                        color="blue"
                        icon={<TrendingUp className="w-6 h-6" />}
                    />
                    <DashboardWidget
                        title={dictionary.dashboard.netBalance}
                        value={`${formatAmount(
                            parseFloat(data?.savings_goal_summary.total_saved || '0') +
                            (parseFloat(income?.total_amount || '0') - parseFloat(expense?.total_amount || '0'))
                        )}`}
                        color="green"
                        icon={<Banknote className="w-6 h-6" />}
                    />
                    <DashboardWidget
                        title={dictionary.dashboard.monthlyExpenses}
                        value={`${formatAmount(expense?.total_amount || '0')}`}
                        color="red"
                        icon={<TrendingDown className="w-6 h-6" />}
                    />
                </div>


                <div className="mb-6">
                    <div className="bg-white/80 dark:bg-gray-800/80 shadow-lg rounded-lg p-6 backdrop-blur-sm">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            {dictionary.dashboard.financialBreakdown}
                        </h2>
                        <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                            {(() => {
                                return (
                                    <>
                                        <div
                                            className="bg-blue-500 h-full"
                                            style={{ width: `${incomePercent}%` }}
                                            title={`Income: ${incomePercent.toFixed(2)}%`}
                                        />
                                        <div
                                            className={`h-full ${netBalance >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                            style={{ width: `${balancePercent}%` }}
                                            title={`Net Balance: ${balancePercent.toFixed(2)}%`}
                                        />
                                        <div
                                            className="bg-red-500 h-full"
                                            style={{ width: `${expensePercent}%` }}
                                            title={`Expenses: ${expensePercent.toFixed(2)}%`}
                                        />
                                    </>
                                );
                            })()}
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center">
                                <span className="inline-block w-3 h-3 mr-2 bg-blue-500 rounded-full" />
                                {dictionary.dashboard.income}
                            </div>
                            <div className="flex items-center">
                                <span className={`inline-block w-3 h-3 mr-2 rounded-full ${netBalance >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                                {dictionary.dashboard.netBalance}
                            </div>
                            <div className="flex items-center">
                                <span className="inline-block w-3 h-3 mr-2 bg-red-500 rounded-full" />
                                {dictionary.dashboard.expense}
                            </div>
                        </div>

                        {/* <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                            <div>
                                <p className="text-blue-600 dark:text-blue-400 font-bold">
                                    ${formatAmount(data?.income_expense_summary.find(item => item.type === 'income')?.total_amount || '0')}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {dictionary.dashboard.totalIncome}
                                </p>
                            </div>
                            <div>
                                <p className={`font-bold ${netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    ${formatAmount(Math.abs(netBalance))}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {netBalance >= 0 ? 'Net Surplus' : 'Net Deficit'}
                                </p>
                            </div>
                            <div>
                                <p className="text-red-600 dark:text-red-400 font-bold">
                                    ${formatAmount(data?.income_expense_summary.find(item => item.type === 'expense')?.total_amount || '0')}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {dictionary.dashboard.totalExpenses}
                                </p>
                            </div>
                        </div> */}

                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/80 dark:bg-gray-800/80 shadow-lg rounded-lg p-6 backdrop-blur-sm">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Monthly Trend</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={formattedMonthlyTrend || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        tickFormatter={(value) => {
                                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                            return months[value - 1];
                                        }}
                                    />
                                    <YAxis
                                        tickFormatter={(value) => `$${formatAmount(value)}`}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [`$${formatAmount(value)}`, '']}
                                        labelFormatter={(label) => {
                                            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                                            return months[label - 1];
                                        }}
                                    />
                                    <Line type="monotone" dataKey="total_income" stroke="#3B82F6" name="Income" />
                                    <Line type="monotone" dataKey="total_expense" stroke="#EF4444" name="Expense" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <SpendingPieChart data={pieChartData} />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DashboardWidget
                        title="Budget Overview"
                        value={`${formatAmount(data?.budget_overview.total_budgeted || '0')}`}
                        color="blue"
                        icon={<LineChartIcon className="w-6 h-6" />}
                    />
                    <DashboardWidget
                        title="Savings Progress"
                        value={`${formatAmount(data?.savings_goal_summary.overall_progress || '0')}%`}
                        color="green"
                        icon={<PiggyBank className="w-6 h-6" />}
                    />
                    <DashboardWidget
                        title="Investment Returns"
                        value={`${formatAmount(data?.investment_summary.total_return_percentage || '0')}%`}
                        color="blue"
                        icon={<Target className="w-6 h-6" />}
                    />
                </div>
            </div>
        </div>
    );
}

type WidgetColor = 'green' | 'blue' | 'red';

interface DashboardWidgetProps {
    title: string;
    value: string;
    color: WidgetColor;
    icon: React.ReactNode;
}

function DashboardWidget({ title, value, color, icon }: DashboardWidgetProps) {
    const colorClasses: Record<WidgetColor, string> = {
        green: 'text-green-600 dark:text-green-400',
        blue: 'text-blue-600 dark:text-blue-400',
        red: 'text-red-600 dark:text-red-400',
    };

    return (
        <div className="bg-white/80 dark:bg-gray-800/80 shadow-lg rounded-lg p-6 backdrop-blur-sm transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    {title}
                </h3>
                <div className={colorClasses[color]}>
                    {icon}
                </div>
            </div>
            <p className={`text-2xl font-bold ${colorClasses[color]} transition-colors`}>
                {value}
            </p>
        </div>
    );
}