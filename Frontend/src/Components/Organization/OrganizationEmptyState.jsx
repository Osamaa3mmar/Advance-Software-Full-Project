import { Button } from "primereact/button";

/* eslint-disable react/prop-types */
export default function OrganizationEmptyState({ onAddClick }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
      <div className="text-center max-w-md mx-auto">
        <div className="w-32 h-32 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="pi pi-building text-6xl text-blue-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-3">
          No Organizations Found
        </h3>
        <p className="text-slate-600 mb-6">
          Get started by adding your first organization to the system. You can
          add hospitals, pharmacies, clinics, and more.
        </p>
        <Button
          label="Add First Organization"
          icon="pi pi-plus"
          onClick={onAddClick}
          severity="success"
          size="large"
          className="shadow-lg"
          raised
        />
      </div>
    </div>
  );
}
