import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import { useNetworkStatus } from "../../../Hooks/useNetworkStatus";

import LocalView from "../../../Components/Rooms/Room/LocalView";
import RemoteView from "../../../Components/Rooms/Room/RemoteView";
import ChatRoom from "../../../Components/Rooms/Room/ChatRoom";
import { Button } from "primereact/button";
import InvaliedRoomId from "../../../Components/Rooms/Room/InvaliedRoomId";
export default function Room() {
  
  const appId = "8932c4886f704fd98015d6f3a7c32317";
  const { id } = useParams();
  const [chatVisable,setChatVisable]=useState(true);
  const [activeConnection, setActiveConnection] = useState(true);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { online, type, downlink } = useNetworkStatus();
  
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

   useJoin(
    {
      appid: appId,
      channel: id,
      token: null,
    },
    activeConnection
  )
  usePublish([localMicrophoneTrack, localCameraTrack])
  const remoteUsers = useRemoteUsers()
  const { audioTracks } = useRemoteAudioTracks(remoteUsers)
  audioTracks.forEach((track) => track.play());
  
  return (
    <div className="flex items-center justify-between h-screen ">
      <div className="views relative w-[70%] grow bg-red-200 h-screen">
        {remoteUsers.map((user)=>{
          return <RemoteView key={user.uid} user={user} />

        })}
        <LocalView 
        audioTrack={localMicrophoneTrack}
          videoTrack={localCameraTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          playAudio={false}
          playVideo={cameraOn} />
      </div>
      {chatVisable ? (
        <div className="chat lg:w-[30%] h-screen">
          <ChatRoom setVisable={setChatVisable} />
          <div>
      <p>الاتصال: {online ? "متصل" : "غير متصل"}</p>
      <p>نوع الشبكة: {type}</p>
      <p>سرعة التحميل: {downlink} Mbps</p>
    </div>
        </div>
      ) : (
        <Button
          icon={"pi pi-inbox"}
          onClick={() => {
            setChatVisable(true);
          }}
          style={{ zIndex:100,position: "absolute", top: "18px", right: "18px" }}
        />
      )}
    </div>
  );
}
