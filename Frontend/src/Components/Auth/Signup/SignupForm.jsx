import axios from "axios";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { Toast } from "primereact/toast";
import React, { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ToastContext from "../../../Context/Toast";

export default function SignupForm() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const options = ["PATIENT", "DONOR", "DOCTOR"];
  const [role, setRole] = useState(options[0]);
  const { toast } = useContext(ToastContext);
  const { t } = useTranslation();

  const signup = async (info) => {
    try {
      setLoading(true);
      await delay(1000);
      const { data } = await axios.post(
        "http://localhost:5555/api/auth/signup",
        {
          ...info,
          role,
        }
      );
      toast.current.show([
        {
          severity: "success",
          summary: t("auth.signup.success.summary"),
          detail: t("auth.signup.success.detail"),
          life: 3000,
        },
      ]);
      toast.current.show({
        severity: "info",
        summary: t("auth.signup.emailVerification.summary"),
        detail: t("auth.signup.emailVerification.detail"),
        life: 6000,
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: t("auth.signup.failed.summary"),
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
      onSubmit={handleSubmit(signup)}
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
                navigate("/");
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
          <div className="mt-6 flex flc  items-center justify-between password">
            <label className="text-lg font-normal" htmlFor="role">
              {t("auth.signup.role")}
            </label>
            <div className="card flex justify-content-center">
              <SelectButton
              dir="ltr"
                className="p-button-sm"
                value={role}
                onChange={(e) => setRole(e.value)}
                options={options}
                optionLabel={(option) => t(`auth.roles.${option}`)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="buttons  flex items-start justify-end mt-6">
        <Button
          loading={loading}
          className=" "
          icon="pi pi-sign-in"
          label={t("auth.signup.button")}
          type="submit"
        />
      </div>
      <Divider className="hidden md:flex">
        <b>{t("common.or")}</b>
      </Divider>
      <div className="signup flex justify-center mt-6">
        <p>
          {t("auth.signup.haveAccount")}{" "}
          <Link to="/login" className="text-[#06b6d4]">
            {t("auth.signup.loginLink")}
          </Link>
        </p>
      </div>
    </form>
  );
}
