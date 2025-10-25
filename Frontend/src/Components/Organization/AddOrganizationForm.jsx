import { useState, useContext } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
import ToastContext from "../../Context/Toast";
import axios from "axios";

export default function AddOrganizationForm({ onSuccess, onCancel }) {
  const { t } = useTranslation();
  const { toast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    pic: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        "http://localhost:5555/api/organization/create-organization",
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-medium text-slate-700">
          Organization Name
        </label>
        <InputText
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter organization name"
          className="w-full"
          disabled={loading}
        />
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-medium text-slate-700">
          Email
        </label>
        <InputText
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter email address"
          className="w-full"
          disabled={loading}
        />
      </div>

      {/* Type Dropdown */}
      <div className="flex flex-col gap-2">
        <label htmlFor="type" className="font-medium text-slate-700">
          Organization Type
        </label>
        <Dropdown
          id="type"
          name="type"
          value={formData.type}
          options={organizationTypes}
          onChange={(e) => setFormData((prev) => ({ ...prev, type: e.value }))}
          placeholder="Select organization type"
          className="w-full"
          disabled={loading}
        />
      </div>

      {/* Image Upload */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-slate-700">Organization Logo</label>
        <FileUpload
          mode="basic"
          name="pic"
          accept="image/*"
          maxFileSize={5000000}
          onSelect={handleFileSelect}
          auto={false}
          chooseLabel="Choose Image"
          className="w-full"
          disabled={loading}
        />
        {previewUrl && (
          <div className="mt-2">
            <Image
              src={previewUrl}
              alt="Preview"
              width="150"
              preview
              className="border rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          label="Add Organization"
          icon="pi pi-check"
          loading={loading}
          className="flex-1"
        />
        {onCancel && (
          <Button
            type="button"
            label="Cancel"
            icon="pi pi-times"
            severity="secondary"
            onClick={onCancel}
            disabled={loading}
          />
        )}
      </div>
    </form>
  );
}
