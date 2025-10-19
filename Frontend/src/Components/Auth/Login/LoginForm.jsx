import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import {  Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useRef, useState } from "react";
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
        
export default function LoginForm() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading,setLoading]=useState(false);
  const [data,setData]=useState(null);
  const [error,setError]=useState(null);
  const [showPass,setShowPass]=useState(false);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const toast=useRef(null);
  const login = async (info) => {
    try{
        setLoading(true);
        await delay(1000);
        const {data}=await axios.post("http://localhost:5555/api/auth/login",{
            ...info
        });
        setData(data);
        setError(null);
        console.log(data);
        localStorage.setItem("token",data.token);
        toast.current.show({severity: 'success', summary: 'Login Success', detail:"Welcome back! " , life:2000 });
        navigate("/")
    }catch(error){
        setError(error.response.data);
        console.log(error.response.data);
        toast.current.show({severity: 'error', summary: 'Login Failed', detail: error.response.data.message, life:2000 });

        setData(null);
    }finally{
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
            Email
          </label>
          <InputText
          type="email"
          autoComplete="off"
            {...register("email")}
            id="email"
            placeholder="Ex: osama@gmail.com"
            required
          />
        </div>
        <div className="input flex flex-col gap-1.5 ">
          <div className=" flex items-center justify-between password">
            <label className="text-lg font-normal" htmlFor="password">
              Password
            </label>
            <Button
              type="button"
              onClick={() => {
                navigate("/");
              }}
              label="Forget Password?"
              text
              size="small"
            />
          </div>
          <div className=" flex gap-3 items-center password">
          <InputText
          className="grow"
          type={showPass?"text":"password"}
            {...register("password")}
            placeholder=""
            id="password"
            required
          />
          <Button raised icon={showPass?"pi pi-eye":"pi pi-eye-slash"} text type="button" onClick={()=>{setShowPass(prev=>!prev)}}/>
          </div>
        </div>
      </div>

      <div className="buttons  flex items-start justify-between mt-10">
        <Button type="button" severity="warning" size="small" label="Organization Login Page" outlined/>
        <Button
        loading={loading}
          className=" w-[140px]"
          icon="pi pi-sign-in"
          label="login"
          type="submit"
          
        />
      </div>
       <Divider  className="hidden md:flex">
                <b>OR</b>
            </Divider>
            <div className="signup flex justify-center mt-6">
                <p>Dont have an account? <Link to="/signup" className="text-[#06b6d4]">Sign Up</Link></p>
            </div>
      <Toast ref={toast}/>
    </form>
  );
}
