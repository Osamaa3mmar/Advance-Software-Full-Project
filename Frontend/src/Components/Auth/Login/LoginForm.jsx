import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import ToastContext from "../../../Context/Toast";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const { toast } = useContext(ToastContext);
  const { t } = useTranslation();

  const login = async (info) => {
    try {
      setLoading(true);
      await delay(1000);
      const { data } = await axios.post(
        "http://localhost:5555/api/auth/login",
        {
          ...info,
        }
      );
      console.log(data);
      localStorage.setItem("token", data.token);
      toast.current.show({
        severity: "success",
        summary: t("auth.login.success.summary"),
        detail: t("auth.login.success.detail"),
        life: 2000,
      });
      navigate("/main/home");
    } catch (error) {
      console.log(error.response.data);
      toast.current.show({
        severity: "error",
        summary: t("auth.login.failed.summary"),
        detail: error.response.data.message,
        life: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className=" w-[95%] md:w-[85%] lg:w-[40%] "
      onSubmit={handleSubmit(login)}
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
          <div className=" flex items-center justify-between password">
            <label className="text-lg font-normal" htmlFor="password">
              {t("auth.password")}
            </label>
            <Button
              type="button"
              onClick={() => {
                navigate("/reset-password");
              }}
              label={t("auth.forgetPassword")}
              text
              size="small"
            />
          </div>
          <div className=" flex gap-3 items-center password">
            <InputText
              className="grow"
              type={showPass ? "text" : "password"}
              {...register("password")}
              placeholder=""
              id="password"
              required
            />
            <Button
              raised
              icon={showPass ? "pi pi-eye" : "pi pi-eye-slash"}
              text
              type="button"
              onClick={() => {
                setShowPass((prev) => !prev);
              }}
            />
          </div>
        </div>
      </div>

      <div className="buttons  flex items-start justify-between mt-10">
        <Button
          type="button"
          severity="warning"
          size="small"
          label={t("auth.login.organizationButton")}
          outlined
        />
        <Button
          loading={loading}
          className=" w-[140px]"
          icon="pi pi-sign-in"
          label={t("auth.login.button")}
          type="submit"
        />
      </div>
      <Divider className="hidden md:flex">
        <b>{t("common.or")}</b>
      </Divider>
      <div className="signup flex justify-center mt-6">
        <p>
          {t("auth.login.noAccount")}{" "}
          <Link to="/signup" className="text-[#06b6d4]">
            {t("auth.login.signupLink")}
          </Link>
        </p>
      </div>
    </form>
  );
}
