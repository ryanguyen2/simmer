import { useEffect, useState } from "react";
import { subscribeToToasts } from "../lib/toast";

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsub = subscribeToToasts((t) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => setToasts((p) => p.filter(x => x.id !== t.id)), t.duration || 1800);
    });
    return () => unsub();
  }, []);

  return (
    <div style={{
      position: "fixed", right: 16, bottom: 16, display: "grid", gap: 10, zIndex: 50
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: "10px 14px", borderRadius: 12, border: "1px solid #ece6df",
          background: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,.08)", fontWeight: 800
        }}>
          {t.text}
        </div>
      ))}
    </div>
  );
}
