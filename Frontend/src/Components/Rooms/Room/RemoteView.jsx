import { useEffect, useRef } from "react"

export default function RemoteView({media}) {

 const vidRef=useRef(null);

    useEffect(()=>{
        if (vidRef.current && media) {
      vidRef.current.srcObject = media;
    }
    },[media])
  return (
    <div className="bg-black w-full h-screen">
      <video muted autoPlay playsInline ref={vidRef}/>
      
    </div>
  )
}
