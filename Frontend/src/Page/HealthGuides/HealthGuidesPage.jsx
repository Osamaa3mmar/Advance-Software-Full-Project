import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import HealthGuidesCard from "../../Components/HealthGuides/HealthGuidesCard";

export default function HealthGuidesPage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5555/api/healthGuides/getGuides", {
        headers: { Authorization: token },
      });
      setGuides(data?.data || []);
    } catch (err) {
      console.error("Failed to load guides", err?.response || err.message);
      setGuides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDetails = (g) => {
    setSelected(g);
    setOpen(true);
  };

  const renderFiles = (files = []) => {
    if (!files || !files.length) return <div className="text-sm text-slate-500">No attachments</div>;
    return (
      <div className="grid gap-4">
        {files.map((f, i) => {
          const url = f.url;
          if (!url) return null;
          const lower = url.toLowerCase();
          if (/\.(png|jpe?g|gif|webp|svg)$/.test(lower)) {
            return (
              <img key={i} src={url} alt={`file-${i}`} style={{ maxWidth: "100%", borderRadius: 8 }} />
            );
          }
          if (/\.(mp4|webm|ogg)$/.test(lower)) {
            return (
              <video key={i} src={url} controls style={{ width: "100%", borderRadius: 8 }} />
            );
          }
          if (/youtube.com|youtu.be/.test(lower)) {
            return (
              <iframe
                key={i}
                title={`yt-${i}`}
                src={url.replace("watch?v=", "embed/")}
                style={{ width: "100%", height: 360, border: 0, borderRadius: 8 }}
                allowFullScreen
              />
            );
          }
          // fallback: link
          return (
            <a key={i} href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              Open attachment
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Health Guides</h1>
          <p className="text-slate-500 text-sm">Short posts with supporting files (images, videos or links).</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            label="English"
            className={lang === "en" ? "p-button-primary" : "p-button-outlined"}
            onClick={() => setLang("en")}
          />
          <Button
            label="العربية"
            className={lang === "ar" ? "p-button-primary" : "p-button-outlined"}
            onClick={() => setLang("ar")}
          />
          <Button icon="pi pi-refresh" className="p-button-text" onClick={fetchGuides} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <ProgressSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(guides) && guides.length ? (
            guides.map((g) => (
              <div key={g.id}>
                <HealthGuidesCard guide={g} lang={lang} onView={() => openDetails(g)} />
              </div>
            ))
          ) : (
            <div className="text-slate-500">No health guides available.</div>
          )}
        </div>
      )}

      <Dialog header={selected ? (selected[`title_${lang}`] || selected.title_en) : ""} visible={open} style={{ width: "60rem" }} onHide={() => setOpen(false)} breakpoints={{ '960px': '100%' }}>
        {selected && (
          <div className="space-y-4">
            <div className="text-slate-700 font-semibold text-lg">{selected[`title_${lang}`] || selected.title_en}</div>
            <div className="text-slate-600">{selected[`content_${lang}`] || selected.content_en}</div>
            <div>{renderFiles(selected.files)}</div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
