import { useState, useEffect } from "react";

export function useNetworkStatus() {
  const [network, setNetwork] = useState({
    online: navigator.onLine,
    type: navigator.connection?.effectiveType || "unknown",
    downlink: navigator.connection?.downlink || 0,
  });

  useEffect(() => {
    const update = () => {
      setNetwork({
        online: navigator.onLine,
        type: navigator.connection?.effectiveType || "unknown",
        downlink: navigator.connection?.downlink || 0,
      });
    };

    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    navigator.connection?.addEventListener("change", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      navigator.connection?.removeEventListener("change", update);
    };
  }, []);

  return network;
}
