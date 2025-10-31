
import {RemoteUser} from "agora-rtc-react";


export default function RemoteView({ user }) {

  return (
    <div className="bg-black w-full h-screen">
      <RemoteUser user={user} />
    </div>
  );
}
