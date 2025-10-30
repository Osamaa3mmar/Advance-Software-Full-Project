import { Button } from "primereact/button";

export default function ChatRoom({ setVisable }) {
  return (
    <div className=" h-full ">
      <div className="header flex justify-between items-center px-8 py-4">
        <div className=" flex items-center justify-between gap-2">
          <p className=" pi pi-inbox" style={{ fontSize: "22px" }}></p>
          <h3 className="text-2xl font-medium ">Chat Box</h3>
        </div>
        <Button icon={"pi pi-times"} rounded text onClick={()=>{setVisable(prev=>!prev)}} />
      </div>
    </div>
  );
}
