/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useNetworkStatus } from "../../../Hooks/useNetworkStatus";
import style from "./Controls.module.css";

export default function Controls({ setCamera, cameraOn, setMic, micOn }) {
  const { type, downlink } = useNetworkStatus();

  useEffect(() => {
    if (type === "3g") {
      setCamera(false);
    } else if (type === "2g") {
      setCamera(false);
      setMic(false);
    }
  }, [type, setCamera, setMic]);
  return (
    <div className={style.container}>
      <div className={style.controles}>
        <button
          disabled={!(type === "4g")}
          onClick={() => {
            setCamera((prev) => !prev);
          }}
          className={`${style.controleButton} ${
            !cameraOn && style.controleButtonRed
          }`}
        >
          <i className={`pi pi-camera ${style.icons} `}></i>
        </button>
        <button
          disabled={!(type === "4g") && !(type === "3g")}
          onClick={() => {
            setMic((prev) => !prev);
          }}
          className={`${style.controleButton} ${
            !micOn && style.controleButtonRed
          }`}
        >
          <i className={`pi pi-microphone ${style.icons} `}></i>
        </button>
      </div>
      <div className={style.netStatus}>
        <p>{type}</p>
        <div className={style.bars}>
          <div
            className={`${style.bar} ${style.bar1} ${
              type === "4g"
                ? style.green
                : type === "3g"
                ? style.orange
                : type === "2g"
                ? style.red
                : null
            }`}
          ></div>
          <div
            className={`${style.bar} ${style.bar2} ${
              type === "4g"
                ? style.green
                : type === "3g"
                ? style.orange
                : type === "2g"
                ? style.red
                : null
            }`}
          ></div>
          <div
            className={`${style.bar} ${style.bar3} ${
              type === "4g" ? style.green : type === "3g" ? style.orange : null
            }`}
          ></div>
          <div
            className={`${style.bar} ${style.bar4} ${
              type === "4g" ? style.green : null
            }`}
          ></div>
        </div>
        <p>{downlink}</p>
      </div>
    </div>
  );
}
