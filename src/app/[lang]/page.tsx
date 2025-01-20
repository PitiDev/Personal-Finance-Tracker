import { Locale } from '../../../i18n-config'
import Home from '../page'

interface PageProps {
    params: Promise<{ lang: Locale }>
}


export default async function Page({ params }: PageProps) {
    const { lang } = await params
    console.log("lang xxxx: ", lang)

    return <Home lang={lang} />
}