import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import ToastContext from "../../../Context/Toast";
import axios from "axios";

import { InputOtp } from 'primereact/inputotp';
import { Link, useNavigate } from "react-router-dom";
        
export default function PasswordResetForm() {
  const { toast } = useContext(ToastContext);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
    const [token, setTokens] = useState('');
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const navigate=useNavigate();
  const { register, handleSubmit } = useForm();
  const requestReset = async (info) => {
    try {
        setLoading(true);
        await delay(1000);
      const { data } = await axios.post(
        "http://localhost:5555/api/auth/request-reset-password",
        {
          email: info.email,
        }
      );
      toast.current.show({
        severity: "info",
        summary: "Email Sent",
        detail:"Email sent successfully. Please check your inbox.",
        life: 3000,
      });
      setData(data);
    } catch (error) {
        setError(error);
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: error.response?.data?.message || error.message,
            life: 3000,
          });
    }finally {
        setLoading(false);
    }
  };

  const changePass = async (info) => {
    try {
        console.log(info);
        setLoading(true);
        await delay(1000);
        console.log(token)
        const { data } = await axios.post("http://localhost:5555/api/auth/reset-password",{
            email: info.email,
            newPassword: info.password,
            code: token
        });
        toast.current.show({
            severity: "success",
            summary: "Password Changed",
            detail:"Your password has been changed successfully.",
            life: 3000,
          });
          navigate("/login");
    } catch (error) {
        setError(error);
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: error.response?.data?.message || error.message,
            life: 3000,
          });
    }finally {
        setLoading(false);
    }



  }



  return (
    <>
    <form
      className=" w-[95%] md:w-[85%] lg:w-[40%] "
      onSubmit={handleSubmit(requestReset)}
    >
      <div className="flex items-center gap-2 mb-4 mt-4">
        <IconField className="grow" iconPosition="left">
          <InputIcon className="pi pi-envelope"> </InputIcon>
          <InputText
          required
            {...register("email")}
            placeholder={t("auth.emailPlaceholder")}
            className="w-full"
            type="email"
            disabled={data !== null}
          />
        </IconField>
        <Button
          label={t("auth.sendEmail")}
            loading={loading}
          icon="pi pi-send"
          type="submit"
          iconPos="right"
          disabled={data !== null}
        />
      </div>
      
    </form>
    {data &&(
        <form className=" w-[95%] md:w-[85%] lg:w-[40%] mt-4   " onSubmit={handleSubmit(changePass)}>
            <div className="code w-[100%] flex flex-col gap-2 items-center ">
            <InputText
          required
            {...register("password")}
            placeholder={t("auth.passwordPlaceholder")}
            className="w-full"
            type="password"
          />
          <div className="code mt-8 w-[100%] flex flex-col gap-2 items-center ">
            <label htmlFor="code ">{t("auth.otpLabel")}</label>
            <InputOtp required className="mt-10" length={8} value={token} onChange={(e) => setTokens(e.value)}/>
            </div>
            </div>
            <div className="butto w-full mt-8 flex items-center justify-center">
            <Button
            className="m-auto"
          label={t("auth.changePassword")}
          type="submit"
          icon="pi pi-check"
          iconPos="right"  
          loading={loading}
          />
          </div>
        </form>
      )}
      <p className="mt-6">{t("auth.backTo")} <Link className="text-[#06b6d4]" to="/login">{t("auth.login.button")}</Link></p>
      </>
  );
}
