/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import ToastContext from "../../Context/Toast";
import axios from "axios";

export default function AddOrganizationForm({ onSuccess, onCancel }) {
  const { toast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    pic: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const BASE_URL = "http://localhost:5555";

  const organizationTypes = [
    { label: "Hospital", value: "HOSPITAL" },
    { label: "Pharmacy", value: "PHARMACY" },
    { label: "Clinic", value: "CLINIC" },
    { label: "Laboratory", value: "LABORATORY" },
    { label: "Charity", value: "CHARITY" },
    { label: "Blood Bank", value: "BLOOD_BANK" },
    { label: "Other", value: "OTHER" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, pic: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClearImage = () => {
    setFormData((prev) => ({ ...prev, pic: null }));
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!formData.name || !formData.email || !formData.type) {
      toast.current.show({
        severity: "warn",
        summary: "Validation Error",
        detail: "Name, email, and type are required",
        life: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("type", formData.type);
      if (formData.pic) {
        data.append("org_image", formData.pic);
      }

      const response = await axios.post(
        `${BASE_URL}/api/organization/create-organization`,
        data,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Organization added successfully",
        life: 3000,
      });

      // Reset form
      setFormData({ name: "", email: "", type: "", pic: null });
      setPreviewUrl(null);
      setSubmitted(false);

      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Failed to add organization",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Organization Details */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
        <div className="flex items-center gap-2">
          <i className="pi pi-building text-slate-500" />
          <h3 className="text-slate-800 font-semibold">Organization Details</h3>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <FloatLabel>
              <InputText
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full ${
                  submitted && !formData.name ? "p-invalid" : ""
                }`}
                disabled={loading}
              />
              <label htmlFor="name">Organization Name *</label>
            </FloatLabel>
            {submitted && !formData.name && (
              <small className="text-red-500">Name is required.</small>
            )}
          </div>

          {/* Email */}
          <div>
            <FloatLabel>
              <InputText
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full ${
                  submitted && !formData.email ? "p-invalid" : ""
                }`}
                disabled={loading}
              />
              <label htmlFor="email">Email *</label>
            </FloatLabel>
            {submitted && !formData.email && (
              <small className="text-red-500">Email is required.</small>
            )}
            <small className="block text-slate-500 mt-1">
              We will use this for official communications.
            </small>
          </div>

          {/* Type */}
          <div>
            <FloatLabel>
              <Dropdown
                inputId="type"
                name="type"
                value={formData.type}
                options={organizationTypes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.value }))
                }
                className={`w-full ${
                  submitted && !formData.type ? "p-invalid" : ""
                }`}
                disabled={loading}
                showClear
              />
              <label htmlFor="type">Organization Type *</label>
            </FloatLabel>
            {submitted && !formData.type && (
              <small className="text-red-500">Type is required.</small>
            )}
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
        <div className="flex items-center gap-2">
          <i className="pi pi-image text-slate-500" />
          <h3 className="text-slate-800 font-semibold">Branding</h3>
        </div>

        <div className="flex items-start gap-4">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Preview"
              width="96"
              preview
              className="border rounded-lg"
            />
          ) : (
            <div className="w-24 h-24 border border-dashed rounded-lg flex items-center justify-center text-slate-400 text-xs">
              96×96
            </div>
          )}
          <div className="flex-1 space-y-2">
            <FileUpload
              mode="basic"
              name="pic"
              accept="image/*"
              maxFileSize={10000000}
              onSelect={handleFileSelect}
              auto={false}
              chooseLabel={previewUrl ? "Change Image" : "Choose Image"}
              className="w-full max-w-xs"
              disabled={loading}
            />
            {previewUrl && (
              <Button
                type="button"
                label="Remove"
                icon="pi pi-trash"
                severity="danger"
                outlined
                onClick={handleClearImage}
                disabled={loading}
              />
            )}
            <small className="block text-slate-500">
              PNG or JPG up to 5MB.
            </small>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button
          type="submit"
          label="Create"
          icon="pi pi-check"
          loading={loading}
          className="flex-1"
        />
        {onCancel && (
          <Button
            type="button"
            label="Cancel"
            icon="pi pi-times"
            outlined
            severity="secondary"
            onClick={onCancel}
            disabled={loading}
          />
        )}
      </div>
    </form>
  );
}
