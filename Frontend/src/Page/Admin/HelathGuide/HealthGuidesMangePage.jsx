import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import HealthGuidesCard from '../../../Components/HealthGuides/HealthGuidesCard';

export default function HealthGuidesMangePage() {
  const toast = useRef(null);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [layout, setLayout] = useState("grid");
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [createOpen, setCreateOpen] = useState(false);
  const [newGuide, setNewGuide] = useState({ title_en: "", title_ar: "", content_en: "", content_ar: "", category_en: "", category_ar: "" });
  // newFiles: [{ file: File, preview: objectUrl }]
  const [newFiles, setNewFiles] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editGuide, setEditGuide] = useState({ id: null, title_en: "", title_ar: "", content_en: "", content_ar: "", category_en: "", category_ar: "" });
  const [editFiles, setEditFiles] = useState([]);
  const [editLoading, setEditLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:5555/api/healthGuides/getGuides",
        { headers: { Authorization: token } }
      );
    
      setGuides(data?.data ?? []);
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load health guides.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredGuides = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return guides;
    return guides.filter((g) =>
      [
        g.title_en,
        g.title_ar,
        g.content_en,
        g.content_ar,
        g?.files?.map((f) => f.type).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(k)
    );
  }, [guides, keyword]);

  const itemTemplate = (g) => (
    <HealthGuidesCard
      guide={g}
      onView={() => {
        setSelectedGuide(g);
        setDetailsOpen(true);
      }}
      onEdit={() => {
        // prefill edit form
        setEditGuide({
          id: g.id,
          title_en: g.title_en || "",
          title_ar: g.title_ar || "",
          content_en: g.content_en || "",
          content_ar: g.content_ar || "",
          category_en: g.category_en || g.category || "",
          category_ar: g.category_ar || g.category || "",
        });
        setEditFiles([]);
        setEditOpen(true);
      }}
      onDelete={async () => {
        const ok = window.confirm("Delete this guide? This action cannot be undone.");
        if (!ok) return;
        try {
          await axios.delete(`http://localhost:5555/api/healthGuides/deleteGuide/${g.id}`, { headers: { Authorization: token } });
          toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Guide deleted', life: 3000 });
          fetchGuides();
        } catch (err) {
          console.error('Delete error', err);
          toast.current.show({ severity: 'error', summary: 'Error', detail: err?.response?.data?.message || err.message || 'Delete failed', life: 4000 });
        }
      }}
    />
  );

  return (
    <div className="space-y-6">
      <Toast ref={toast} />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            Health Guides
            <span className="text-sm text-slate-500 font-medium">Management</span>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              {Array.isArray(filteredGuides) ? filteredGuides.length : 0}
            </span>
          </h1>
          <p className="text-slate-500 text-sm">View, search and manage health guides.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="p-input-icon-left" style={{ minWidth: 260 }}>
            <i className="pi pi-search" />
            <InputText
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search (title/content)..."
              className="w-full"
            />
          </span>

          <Button
            icon="pi pi-refresh"
            className="p-button-outlined"
            tooltip="Refresh"
            onClick={fetchGuides}
          />

          <Button
            label="Create"
            icon="pi pi-plus"
            className="p-button-sm p-button-primary"
            onClick={() => setCreateOpen(true)}
          />

          <Button
            icon={layout === "grid" ? "pi pi-th-large" : "pi pi-list"}
            className="p-button-outlined"
            onClick={() => setLayout((l) => (l === "grid" ? "list" : "grid"))}
            tooltip="Toggle layout"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center" style={{ height: "60vh" }}>
          <ProgressSpinner />
        </div>
      ) : filteredGuides.length === 0 ? (
        <div className="text-center text-slate-500 py-16 border rounded-lg bg-white">
          No health guides found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <DataView
            value={Array.isArray(filteredGuides) ? filteredGuides : []}
            layout={layout}
            itemTemplate={itemTemplate}
            paginator
            rows={rowsPerPage}
            className="p-dataview-grid"
            emptyMessage="No guides to display"
          />
        </div>
      )}

      {/* Details Dialog */}
      <Dialog
        header={selectedGuide?.title_en || selectedGuide?.title_ar || "Details"}
        visible={detailsOpen}
        style={{ width: "700px", maxWidth: "95vw" }}
        onHide={() => setDetailsOpen(false)}
        breakpoints={{ "960px": "95vw" }}
      >
        {selectedGuide ? (
          <div className="space-y-4">
            {selectedGuide?.files?.length ? (
              <img
                src={
                  selectedGuide.files.find((f) => f.url)?.url ||
                  "https://via.placeholder.com/1200x600?text=Health+Guide"
                }
                alt="guide"
                style={{ width: "100%", borderRadius: 12 }}
              />
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border bg-slate-50">
                <div className="text-xs uppercase text-slate-500 mb-1">Title (EN)</div>
                <div className="font-semibold">{selectedGuide.title_en || "-"}</div>
                <div className="text-xs uppercase text-slate-500 mt-3 mb-1">Content (EN)</div>
                <div className="text-slate-700">{selectedGuide.content_en || "-"}</div>
              </div>
              <div className="p-3 rounded-lg border bg-slate-50">
                <div className="text-xs uppercase text-slate-500 mb-1">العنوان (AR)</div>
                <div className="font-semibold">{selectedGuide.title_ar || "-"}</div>
                <div className="text-xs uppercase text-slate-500 mt-3 mb-1">المحتوى (AR)</div>
                <div className="text-slate-700">{selectedGuide.content_ar || "-"}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>
                ID: <b>{selectedGuide.id}</b>
              </span>
              <span>
                Created:{" "}
                {selectedGuide.created_at
                  ? new Date(selectedGuide.created_at).toLocaleString()
                  : "-"}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-slate-500">No guide selected.</div>
        )}
      </Dialog>

      {/* Create Dialog (stub) */}
      <Dialog
        header="Create Health Guide"
        visible={createOpen}
        style={{ width: "700px", maxWidth: "95vw" }}
        onHide={() => setCreateOpen(false)}
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500">Title (EN)</label>
            <InputText
              value={newGuide.title_en}
              onChange={(e) => setNewGuide((s) => ({ ...s, title_en: e.target.value }))}
              className="w-full mt-1"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">Category (EN)</label>
              <InputText
                value={newGuide.category_en}
                onChange={(e) => setNewGuide((s) => ({ ...s, category_en: e.target.value }))}
                placeholder="e.g. Nutrition"
                className="w-full mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">الفئة (AR)</label>
              <InputText
                value={newGuide.category_ar}
                onChange={(e) => setNewGuide((s) => ({ ...s, category_ar: e.target.value }))}
                placeholder="مثال: التغذية"
                className="w-full mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500">Title (AR)</label>
            <InputText
              value={newGuide.title_ar}
              onChange={(e) => setNewGuide((s) => ({ ...s, title_ar: e.target.value }))}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Content (EN)</label>
            <textarea
              value={newGuide.content_en}
              onChange={(e) => setNewGuide((s) => ({ ...s, content_en: e.target.value }))}
              className="w-full mt-1 p-2 border rounded"
              rows={4}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Content (AR)</label>
            <textarea
              value={newGuide.content_ar}
              onChange={(e) => setNewGuide((s) => ({ ...s, content_ar: e.target.value }))}
              className="w-full mt-1 p-2 border rounded"
              rows={4}
            />
          </div>

          {/* File attachments */}
          <div>
            <label className="text-xs text-slate-500">Attach files</label>
            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length) {
                  const withPreview = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
                  setNewFiles((prev) => [...prev, ...withPreview]);
                }
                // clear input so same file can be reselected if needed
                e.target.value = null;
              }}
              className="w-full mt-2"
            />

            {newFiles.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-slate-500 mb-1">Selected files</div>
                <ul className="space-y-1">
                  {newFiles.map((fObj, idx) => {
                    const f = fObj.file;
                    return (
                      <li key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                        <div className="flex items-center gap-3">
                          {f.type?.startsWith("image/") ? (
                            <img src={fObj.preview} alt={f.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center bg-white border rounded text-xs">{f.name.split('.').pop() || 'file'}</div>
                          )}
                          <div>
                            <div className="font-medium text-sm">{f.name}</div>
                            <div className="text-xs text-slate-500">{Math.round(f.size/1024)} KB</div>
                          </div>
                        </div>
                        <div>
                          <Button
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => {
                              // revoke object URL
                              try { URL.revokeObjectURL(fObj.preview); } catch (e) {}
                              setNewFiles((prev) => prev.filter((_, i) => i !== idx));
                            }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setCreateOpen(false)} />
            <Button
              label={createLoading ? "Creating..." : "Create"}
              className="p-button-primary"
              disabled={createLoading}
              onClick={async () => {
                setCreateLoading(true);
                try {
                  const fd = new FormData();
                  // send translations as JSON string to match backend expectation
                  const translationsObj = {
                    title_en: newGuide.title_en,
                    title_ar: newGuide.title_ar,
                    content_en: newGuide.content_en,
                    content_ar: newGuide.content_ar,
                    category_en: newGuide.category_en,
                    category_ar: newGuide.category_ar,
                  };
                  fd.append('translations', JSON.stringify(translationsObj));
                  newFiles.forEach((fObj) => fd.append('files', fObj.file));

                  const res = await axios.post('http://localhost:5555/api/healthGuides/createGuide', fd, {
                    headers: {
                      Authorization: token,
                      // Let browser set Content-Type with boundary
                    },
                  });

                  toast.current.show({ severity: 'success', summary: 'Created', detail: res.data?.message || 'Guide created', life: 3000 });
                  // cleanup previews
                  newFiles.forEach((fObj) => { try { URL.revokeObjectURL(fObj.preview); } catch(e){} });
                  // reset form
                  setNewGuide({ title_en: '', title_ar: '', content_en: '', content_ar: '' });
                  setNewFiles([]);
                  setCreateOpen(false);
                  // refresh list
                  fetchGuides();
                } catch (err) {
                  console.error('Create guide error', err);
                  const msg = err?.response?.data?.message || err.message || 'Failed to create guide';
                  toast.current.show({ severity: 'error', summary: 'Error', detail: msg, life: 4000 });
                } finally {
                  setCreateLoading(false);
                }
              }}
            />
          </div>
        </div>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        header="Edit Health Guide"
        visible={editOpen}
        style={{ width: "700px", maxWidth: "95vw" }}
        onHide={() => setEditOpen(false)}
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500">Title (EN)</label>
            <InputText
              value={editGuide.title_en}
              onChange={(e) => setEditGuide((s) => ({ ...s, title_en: e.target.value }))}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Category</label>
            <InputText
              value={editGuide.category}
              onChange={(e) => setEditGuide((s) => ({ ...s, category: e.target.value }))}
              placeholder="e.g. Nutrition, Mental Health"
              className="w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Title (AR)</label>
            <InputText
              value={editGuide.title_ar}
              onChange={(e) => setEditGuide((s) => ({ ...s, title_ar: e.target.value }))}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Content (EN)</label>
            <textarea
              value={editGuide.content_en}
              onChange={(e) => setEditGuide((s) => ({ ...s, content_en: e.target.value }))}
              className="w-full mt-1 p-2 border rounded"
              rows={4}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Content (AR)</label>
            <textarea
              value={editGuide.content_ar}
              onChange={(e) => setEditGuide((s) => ({ ...s, content_ar: e.target.value }))}
              className="w-full mt-1 p-2 border rounded"
              rows={4}
            />
          </div>

          {/* File attachments (additive) */}
          <div>
            <label className="text-xs text-slate-500">Attach files (will be added)</label>
            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length) {
                  const withPreview = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
                  setEditFiles((prev) => [...prev, ...withPreview]);
                }
                e.target.value = null;
              }}
              className="w-full mt-2"
            />

            {editFiles.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-slate-500 mb-1">Selected files</div>
                <ul className="space-y-1">
                  {editFiles.map((fObj, idx) => {
                    const f = fObj.file;
                    return (
                      <li key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                        <div className="flex items-center gap-3">
                          {f.type?.startsWith("image/") ? (
                            <img src={fObj.preview} alt={f.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center bg-white border rounded text-xs">{f.name.split('.').pop() || 'file'}</div>
                          )}
                          <div>
                            <div className="font-medium text-sm">{f.name}</div>
                            <div className="text-xs text-slate-500">{Math.round(f.size/1024)} KB</div>
                          </div>
                        </div>
                        <div>
                          <Button
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => {
                              try { URL.revokeObjectURL(fObj.preview); } catch (e) {}
                              setEditFiles((prev) => prev.filter((_, i) => i !== idx));
                            }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button label="Cancel" className="p-button-text" onClick={() => setEditOpen(false)} />
            <Button
              label={editLoading ? "Updating..." : "Update"}
              className="p-button-warning"
              disabled={editLoading}
              onClick={async () => {
                setEditLoading(true);
                try {
                  const fd = new FormData();
                  const translationsObj = {
                    title_en: editGuide.title_en,
                    title_ar: editGuide.title_ar,
                    content_en: editGuide.content_en,
                    content_ar: editGuide.content_ar,
                    category_en: editGuide.category_en,
                    category_ar: editGuide.category_ar,
                  };
                  fd.append('translations', JSON.stringify(translationsObj));
                  editFiles.forEach((fObj) => fd.append('files', fObj.file));

                  const res = await axios.put(`http://localhost:5555/api/healthGuides/updateGuide/${editGuide.id}`, fd, {
                    headers: { Authorization: token },
                  });

                  toast.current.show({ severity: 'success', summary: 'Updated', detail: res.data?.message || 'Guide updated', life: 3000 });
                  // cleanup previews
                  editFiles.forEach((fObj) => { try { URL.revokeObjectURL(fObj.preview); } catch(e){} });
                  setEditFiles([]);
                  setEditOpen(false);
                  fetchGuides();
                } catch (err) {
                  console.error('Update error', err);
                  toast.current.show({ severity: 'error', summary: 'Error', detail: err?.response?.data?.message || err.message || 'Update failed', life: 4000 });
                } finally {
                  setEditLoading(false);
                }
              }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
