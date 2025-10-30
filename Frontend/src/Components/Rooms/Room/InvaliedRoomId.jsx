import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export default function InvaliedRoomId() {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  const handleGoHome = () => {
    setVisible(false);
    navigate("/");
  };

  const handleHide = () => {
    setVisible(false);
    navigate("/");
  };

  return (
    <Dialog
      header={
        <div className="flex items-center gap-2">
          <i className="pi pi-exclamation-triangle text-red-500"></i>
          <span className="text-lg font-semibold text-slate-800">
            Invalid Room ID
          </span>
        </div>
      }
      visible={visible}
      onHide={handleHide}
      modal
      closable={true}
      className="w-11/12 max-w-md"
      contentClassName="p-6"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <i className="pi pi-times-circle text-red-500 text-3xl"></i>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-800">
            Room Not Found
          </h3>
          <p className="text-slate-600">
            The room ID you&apos;re trying to access is either invalid or
            doesn&apos;t exist. Please check the room ID and try again.
          </p>
        </div>

        <div className="pt-4">
          <Button
            label="Go Back to Home"
            icon="pi pi-home"
            onClick={handleGoHome}
            className="w-full"
            severity="info"
          />
        </div>
      </div>
    </Dialog>
  );
}
