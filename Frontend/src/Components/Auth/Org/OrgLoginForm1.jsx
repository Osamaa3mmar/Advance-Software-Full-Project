import { useTranslation } from "react-i18next";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { useContext, useState } from "react";
import { ToggleButton } from "primereact/togglebutton";
import { InputOtp } from "primereact/inputotp";
import axios from "axios";
import ToastContext from "../../../Context/Toast";

export default function OrgLoginForm1() {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [token, setTokens] = useState('');
  const { register, handleSubmit,watch } = useForm();
  const email=watch("email");
  const sendEmail = async (data) => {
    console.log(data);
    if(checked){
      await firstLogin(data);
    }else{
      await login(data);
    }
  };
    const { toast } = useContext(ToastContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const login=async ()=>{

  }
  const firstLogin = async(data) => {
    try {
      setLoading(true);
      await axios.put("http://localhost:5555/api/organization/organization-setup",{
        email:data.email,
        password:data.password,
        code:token
      });
      toast.current.show({
        severity: "Success",
        summary: "Login Successful",
        life: 3000,
      });
      console.log(data);
    }catch(error){
      setError(error);
     toast.current.show({
            severity: "error",
            summary: "Error",
            detail: error.response?.data?.message || error.message,
            life: 3000,
          });
    }finally{
      setLoading(false);
    }



  }
  const reSend = async() => {
    if(email==undefined||email==""){
      toast.current.show({
        severity: "warn",
        summary: t("auth.warningTitle"),
        detail: t("auth.warningMessage"),
        life: 3000,
      });
      return;
    }
    
    try {
      setLoading(true);
      


    }catch(error){
      setError(error);
     toast.current.show({
            severity: "error",
            summary: "Error",
            detail: error.response?.data?.message || error.message,
            life: 3000,
          });
    }finally{
      setLoading(false);
    }



  }




  return (
    <form
      className=" w-[95%] md:w-[85%] lg:w-[40%] "
      action=""
      onSubmit={handleSubmit(sendEmail)}
    >
      <div className="inputs flex flex-col gap-6">
        <div className="input flex flex-col gap-1.5 ">
          <label className="text-lg font-normal" htmlFor="email">
            {t("auth.email")}
          </label>
          <InputText
            type="email"
            autoComplete="off"
            {...register("email")}
            id="email"
            placeholder={t("auth.emailPlaceholder")}
            required
          />
        </div>
        <div className="input flex flex-col gap-1.5 ">
          <label className="text-lg font-normal" htmlFor="password">
            {t("auth.password")}
          </label>
          <InputText
            type="password"
            autoComplete="off"
            {...register("password")}
            id="password"
            placeholder={t("auth.passwordPlaceholder")}
            required
          />
        </div>
        {
          checked&&
          <div className="input flex flex-col gap-1.5 ">
          <label className="text-lg font-normal" htmlFor="email">
            {t("auth.otpLabel")}
          </label>
          
          <div className="flex items-center justify-center">
          <InputOtp
            required
            className="mt-10"
            length={8}
            value={token}
            onChange={(e) => setTokens(e.value)}
          />
          </div>
          <Button
          text
          label={t("auth.resendOtp")}
          type="button"
          onClick={reSend}
          />
        </div>
        }
        
      </div>
      <div className="buttons  flex items-start justify-between mt-10">
        <Button
          loading={loading}
          className=" w-[140px]"
          icon="pi pi-sign-in"
          label={t("auth.login.button")}
          type="submit"
        />
        <ToggleButton
          onLabel={t("auth.firstLogin")}
          offLabel={t("auth.firstLogin")}
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={checked}
          onChange={(e) => setChecked(e.value)}
          className="p-0"
        />
      </div>
    </form>
  );
}
