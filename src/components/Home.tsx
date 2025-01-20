// import Link from 'next/link'
// import { ThemeToggle } from './layout/ThemeToggle'
// import LanguageSwitcher from './LanguageSwitcher'
// import { getDictionary } from '../../get-dictionary'
// import { Locale } from '../../i18n-config'


// export default async function Home({ lang }: { lang: Locale }) {
//     const dictionary = await getDictionary(lang)

//     return (
//         <div className="min-h-screen font-lao  flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
//             <div className="absolute top-4 right-4 flex items-center space-x-4">
//                 <LanguageSwitcher />
//                 <ThemeToggle />
//             </div>
//             <div className="text-center">
//                 <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
//                     {dictionary.appTitle}
//                 </h1>
//                 <p className="text-xl mb-6 text-gray-600 dark:text-gray-300">
//                     {dictionary.appDescription}
//                 </p>
//                 <div className="space-x-4">
//                     <Link
//                         href={`/${lang}/login`}
//                         className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
//                        dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
//                     >
//                         {dictionary.login}
//                     </Link>
//                     <Link
//                         href={`/${lang}/register`}
//                         className="px-6 py-2 border border-blue-500 text-blue-500 rounded 
//                        hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 
//                        dark:hover:bg-blue-900/20 transition-colors"
//                     >
//                         {dictionary.register}
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     )
// }