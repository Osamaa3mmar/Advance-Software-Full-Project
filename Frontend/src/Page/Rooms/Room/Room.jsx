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
import Controls from "../../../Components/Rooms/Room/Controls";
import { ProgressSpinner } from "primereact/progressspinner";
export default function Room() {
  const appId = "8932c4886f704fd98015d6f3a7c32317";
  const { id } = useParams();
  const [chatVisable, setChatVisable] = useState(true);
  const [activeConnection, setActiveConnection] = useState(true);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  useJoin(
    {
      appid: appId,
      channel: id,
      token: null,
    },
    activeConnection
  );
  usePublish([localMicrophoneTrack, localCameraTrack]);
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  audioTracks.forEach((track) => track.play());

  return (
    <div className="flex items-center justify-between h-screen ">
      <div className="views relative w-[70%] grow  h-screen">
        {remoteUsers.length > 0 ? (
          remoteUsers.map((user) => {
            return <RemoteView key={user.uid} user={user} />;
          })
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center flex-col gap-10">
            <ProgressSpinner />
            <p className=" text-2xl text-white">
              Waiting For Osama To Join ...
            </p>
          </div>
        )}
        <LocalView
          audioTrack={localMicrophoneTrack}
          videoTrack={localCameraTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          playAudio={false}
          playVideo={cameraOn}
        />
        <Controls
          setCamera={setCamera}
          setMic={setMic}
          micOn={micOn}
          cameraOn={cameraOn}
        />
      </div>
      {/* {chatVisable ? ( */}
      <div className={`${!chatVisable && "hidden"} chat lg:w-[30%] h-screen`}>
        <ChatRoom setVisable={setChatVisable} />
      </div>
      {/* ) : ( */}
      {!chatVisable && (
        <Button
          icon={"pi pi-inbox"}
          onClick={() => {
            setChatVisable(true);
          }}
          style={{
            zIndex: 100,
            position: "absolute",
            top: "18px",
            right: "18px",
          }}
        />
      )}
      {/* )} */}
    </div>
  );
}
