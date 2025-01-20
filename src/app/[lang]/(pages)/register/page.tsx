import { getDictionary } from '../../../../../get-dictionary'
import { Locale } from '../../../i18n-config'
import RegisterForm from './RegisterForm'

type Dictionary = {
  appTitle: string
  appDescription: string
  createAccount: string
  username: string
  email: string
  password: string
  registering: string
  login: string
  register: string
  alreadyHaveAccount: string
  allFieldsRequired: string
  passwordMinLength: string
  registrationFailed: string
}

export default async function RegisterPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = (await getDictionary(lang)) as Dictionary & { registering: string }

  return <RegisterForm dictionary={dictionary} lang={lang} />
}