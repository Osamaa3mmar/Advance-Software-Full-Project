/* eslint-disable react/prop-types */
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { Divider } from "primereact/divider";

export default function OrganizationDetailsDialog({
  visible,
  onHide,
  organization,
  getTypeLabel,
}) {
  if (!organization) return null;

  return (
    <Dialog
      header={
        <div className="flex items-center gap-3">
          <i className="pi pi-building text-2xl text-blue-600"></i>
          <span className="text-2xl font-bold">Organization Details</span>
        </div>
      }
      visible={visible}
      style={{ width: "700px" }}
      onHide={onHide}
      modal
      className="organization-details-dialog"
    >
      <div className="space-y-6">
        {/* Header Section with Image and Status */}
        <div className="flex items-center gap-6 bg-linear-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
              <img
                src={
                  organization.profile_image_url ||
                  "https://via.placeholder.com/150"
                }
                alt={organization.name}
                className="w-full h-full object-cover"
              />
            </div>
            <Tag
              value={organization.is_active ? "Active" : "Inactive"}
              severity={organization.is_active ? "success" : "danger"}
              className="absolute -top-2 -right-2 shadow-md"
              icon={
                organization.is_active
                  ? "pi pi-check-circle"
                  : "pi pi-times-circle"
              }
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {organization.name}
            </h2>
            <Badge
              value={getTypeLabel(organization.type)}
              severity="info"
              className="text-base"
            />
          </div>
        </div>

        <Divider />

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="pi pi-phone text-blue-600"></i>
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <i className="pi pi-envelope text-blue-600"></i>
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Email Address
                </label>
                <p className="text-sm text-slate-800 font-medium break-all">
                  {organization.email}
                </p>
              </div>
            </div>

            {organization.phone_number && (
              <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <i className="pi pi-phone text-green-600"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                    Phone Number
                  </label>
                  <p className="text-sm text-slate-800 font-medium">
                    {organization.phone_number}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location Information */}
        {(organization.city || organization.street) && (
          <>
            <Divider />
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="pi pi-map-marker text-red-600"></i>
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organization.city && (
                  <div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                      <i className="pi pi-map-marker text-red-600"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                        City
                      </label>
                      <p className="text-sm text-slate-800 font-medium">
                        {organization.city}
                      </p>
                    </div>
                  </div>
                )}

                {organization.street && (
                  <div className="flex items-start gap-3 bg-orange-50 p-4 rounded-lg md:col-span-2">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                      <i className="pi pi-map text-orange-600"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                        Street Address
                      </label>
                      <p className="text-sm text-slate-800 font-medium">
                        {organization.street}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <Divider />

        {/* Additional Information */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="pi pi-info-circle text-purple-600"></i>
            Additional Information
          </h3>
          <div className="flex items-start gap-3 bg-purple-50 p-4 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
              <i className="pi pi-calendar text-purple-600"></i>
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Created Date
              </label>
              <p className="text-sm text-slate-800 font-medium">
                {new Date(organization.created_at).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
