import {  LocalUser} from "agora-rtc-react"
export default function LocalView({playVideo,playAudio,micOn,cameraOn,videoTrack,audioTrack}) {

  return (
    <div className=" bg-amber-300 overflow-hidden shadow absolute top-4 left-3 hover:scale-[1.05] duration-300  w-60 h-40 rounded-2xl">
      <LocalUser
      playVideo={playVideo}
      playAudio={playAudio}
      micOn={micOn}
      cameraOn={cameraOn}
      videoTrack={videoTrack}
      audioTrack={audioTrack}
      />
    </div>
  );
}
