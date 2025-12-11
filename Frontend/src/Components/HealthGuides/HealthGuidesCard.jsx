import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

const isVideo = (url) => {
  if (!url) return false;
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url) || /youtube.com|youtu.be/i.test(url);
};

const isImage = (url) => {
  if (!url) return false;
  return /\.(png|jpe?g|gif|svg|webp)(\?|$)/i.test(url);
};

export default function HealthGuidesCard({ guide, onView, onEdit, onDelete, lang = "en" }) {
  const g = guide;

  if (!g) return null;

  const firstFile = g?.files?.length ? g.files[0] : null;
  const imgPlaceholder = "https://via.placeholder.com/800x450?text=Health+Guide";
  const created = g.created_at ? new Date(g.created_at).toLocaleString() : "-";

  const header = (
    <div className="relative">
      {firstFile && isVideo(firstFile.url) ? (
        // embed youtube or video if direct link
        isVideo(firstFile.url) && /youtube.com|youtu.be/i.test(firstFile.url) ? (
          <div style={{ width: "100%", height: 180, overflow: "hidden" }}>
            <iframe
              title={`video-${g.id}`}
              src={firstFile.url.replace("watch?v=", "embed/")}
              style={{ width: "100%", height: 180, border: 0 }}
              allowFullScreen
            />
          </div>
        ) : (
          <video
            src={firstFile.url}
            style={{ width: "100%", height: 180, objectFit: "cover" }}
            controls
          />
        )
      ) : (
        <img
          src={(firstFile && isImage(firstFile.url) && firstFile.url) || imgPlaceholder}
          alt={g[`title_${lang}`] || g.title_en || "Health Guide"}
          style={{ width: "100%", height: 180, objectFit: "cover" }}
        />
      )}

      <Tag
        value="HEALTH_GUIDE"
        className="absolute"
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          background: "rgba(25,118,210,0.9)",
          color: "white",
          borderRadius: 8,
          fontSize: 12,
        }}
      />
    </div>
  );

  const footer = (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">Created: {created}</span>
      <div className="flex gap-2">
        {onView && (
          <Button
            label="View"
            icon="pi pi-eye"
            className="p-button-sm p-button-rounded p-button-text"
            onClick={onView}
          />
        )}
        {onEdit && (
          <Button
            label="Edit"
            icon="pi pi-pencil"
            className="p-button-sm p-button-rounded p-button-text p-button-warning"
            onClick={onEdit}
          />
        )}
        {onDelete && (
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-sm p-button-rounded p-button-text p-button-danger"
            onClick={onDelete}
          />
        )}
      </div>
    </div>
  );

  return (
    <Card
      key={g.id}
      header={header}
      footer={footer}
      className="shadow-sm border"
      style={{ borderRadius: 14, overflow: "hidden" }}
    >
      <div className="space-y-1">
        <div className="font-semibold text-slate-800">
          {g[`title_${lang}`] || g.title_en || g.title_ar || "Untitled"}
        </div>
        <div className="text-slate-600 text-sm line-clamp-2">
          {g[`content_${lang}`] || g.content_en || g.content_ar || "No content provided."}
        </div>
      </div>
    </Card>
  );
}
