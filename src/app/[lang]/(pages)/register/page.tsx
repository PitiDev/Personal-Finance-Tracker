// src/app/[lang]/(pages)/register/page.tsx
import { getDictionary } from '../../../../../get-dictionary'
import { Locale } from '../../../i18n-config'
import RegisterForm from './RegisterForm'

// interface PageProps {
//     params: Promise<{
//         lang: Locale
//     }>
// }

export default async function RegisterPage({
    params
}: {
    params: { lang: Locale }
}) {
    // Ensure params are awaited
    const { lang } = await Promise.resolve(params)
    const dictionary = await getDictionary(lang)

    return <RegisterForm dictionary={dictionary} lang={lang} />
}