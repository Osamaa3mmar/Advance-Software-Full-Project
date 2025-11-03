import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export default function InvaliedRoomId() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <div className="text-center space-y-6 p-8 bg-white rounded-lg shadow-lg max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <i className="pi pi-exclamation-triangle text-red-500 text-4xl"></i>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            Invalid Room ID
          </h1>
          <p className="text-slate-600">
            The room you&apos;re trying to access doesn&apos;t exist or has been
            removed.
          </p>
        </div>

        <Button
          label="Go Back to Home"
          icon="pi pi-home"
          onClick={() => navigate("/")}
          className="w-full"
        />
      </div>
    </div>
  );
}
