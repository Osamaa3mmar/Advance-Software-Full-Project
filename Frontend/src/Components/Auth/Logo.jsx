import logo from "../../assets/HpLogo.png"
export default function Logo() {
  return (
    <div className=' mb-8 gap-6 flex items-center justify-center'>
      <img className=' border-2 shadow-md border-[#06b6d4] rounded-xl w-[80px]  h-[80px]'  src={logo} alt="Logo" />
      <p  className='  text-[#06b6d4] text-6xl  font-semibold '>Health Pal</p>
    </div>
  )
}
