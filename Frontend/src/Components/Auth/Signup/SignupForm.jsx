import axios from 'axios';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { Toast } from 'primereact/toast';
import React, { useContext, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import ToastContext from '../../../Context/Toast';

export default function SignupForm() {
    const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading,setLoading]=useState(false);
  const [data,setData]=useState(null);
  const [error,setError]=useState(null);
  const [showPass,setShowPass]=useState(false);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    // const toast=useRef(null);
    const options=["DOCTOR","PATIENT","DONOR"];
    const [role,setRole]=useState(options[0]);
      const { toast } = useContext(ToastContext);

    
    
    const signup=async(info)=>{
        try{
            setLoading(true);
            await delay(1000);
            const {data}=await axios.post("http://localhost:5555/api/auth/signup",{
                ...info,
                role
            });
            setData(data);
            setError(null);
            toast.current.show([{severity: 'success', summary: 'Signup Success', detail:"Account created successfully! " , life:3000 }]);
            toast.current.show({severity: 'info', summary: 'Check your email', detail:"Please verify your email address to activate your account." , life:6000 });
            navigate("/login");
        }catch(error){
            console.log(error);
            setError(error.response.data.message);
            toast.current.show({severity: 'error', summary: 'Signup Failed', detail: error.response.data.message, life:2000 });

            setData(null);
        }
        finally{
            setLoading(false);
        }
    }



  return (
      <form
      className=" w-[95%] md:w-[85%] lg:w-[40%] "
      onSubmit={handleSubmit(signup)}
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
          <div className="mt-6 flex flc  items-center justify-between password">
            <label className="text-lg font-normal" htmlFor="role">
              Role
            </label>
             <div className="card flex justify-content-center">
            <SelectButton size={1} value={role} onChange={(e) => setRole(e.value)} options={options} />
        </div>
          </div>
        </div>
      </div>

      <div className="buttons  flex items-start justify-end mt-10">
        <Button
        loading={loading}
          className=" "
          icon="pi pi-sign-in"
          label="Create Account"
          type="submit"
        />
      </div>
       <Divider className="hidden md:flex">
                <b>OR</b>
            </Divider>
            <div className="signup flex justify-center mt-6">
                <p>Already have an account? <Link to="/login" className="text-[#06b6d4]">Login</Link></p>
            </div>
    </form>
  )
}
