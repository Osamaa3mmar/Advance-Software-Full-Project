import React from 'react'
import { useTranslation } from 'react-i18next';
import Logo from '../../Components/Auth/Logo';
import PasswordResetForm from '../../Components/Auth/ResetPassword/PasswordResetForm';

export default function ResetPassword() {
  const { t } = useTranslation();
  return (
     <div className="flex flex-col min-h-screen items-center justify-center">
            <Logo/>
            <p className="text-lg font-normal">{t("auth.resetPassword")}</p>
            <PasswordResetForm/>
        </div>
  )
}
