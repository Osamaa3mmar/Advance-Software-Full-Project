import { useParams } from "react-router-dom";
import InvaliedRoomId from "../../../Components/Rooms/Room/InvaliedRoomId";
import ChatRoom from "../../../Components/Rooms/Room/ChatRoom";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import RemoteView from "../../../Components/Rooms/Room/RemoteView";
import LocalView from "../../../Components/Rooms/Room/LocalView";

export default function Room() {
    const {id}=useParams();
    const [chatVisable,setChatVisable]=useState(true);
    const [permitionStatus,setPermitionStatus]=useState(false);
    const [localMedia,setLocalMedia]=useState(null);


    const getPermitions=async()=>{
        try{    
            const stream =await navigator.mediaDevices.getUserMedia({
      video: true, 
      audio: true   
    })
    setLocalMedia(stream);
        }catch(error){
            console.log(error);
        }
    }

    const makeConnection=async()=>{
        if(localMedia==null) return;
        const pc=new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        localMedia.getTracks().forEach((track)=>{
            return pc.addTrack(track,localMedia);
        })

    }

 useEffect(()=>{
    getPermitions();
    },[])
useEffect(() => {
  if (localMedia) {
    makeConnection();
  }
}, [localMedia]);











    if(Number(id)<0){
        return( <div>
      <InvaliedRoomId/>
    </div>)
    }

   

  return (
    <div className="flex items-center justify-between h-screen ">
       <div className="views relative w-[70%] grow bg-red-200 h-screen">
        <RemoteView/>
        <LocalView media={localMedia}/>
        </div> 
       {chatVisable?
        <div className="chat lg:w-[30%] h-screen">
        <ChatRoom setVisable={setChatVisable}/>
        </div> 
       
       :<Button icon={"pi pi-inbox"} onClick={()=>{setChatVisable(true)}} style={{position:"absolute",top:"18px",right:"18px"}}/>}
    </div>
  )
}
