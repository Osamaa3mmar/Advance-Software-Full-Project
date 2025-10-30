import { useEffect, useRef } from "react"

export default function LocalView({media}) {
    const vidRef=useRef(null);

    useEffect(()=>{
        if (vidRef.current && media) {
      vidRef.current.srcObject = media;
    }
    },[media])

  return (
    <div className=" bg-amber-300 overflow-hidden shadow absolute top-4 left-3 hover:scale-[1.05] duration-300  w-60 h-40 rounded-2xl">
      <video muted autoPlay playsInline ref={vidRef}/>
    </div>
  )
}
