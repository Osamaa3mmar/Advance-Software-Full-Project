/* eslint-disable react/prop-types, no-unused-vars */
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { motion } from "framer-motion";
import { Image } from "primereact/image";

export default function OrganizationListItem({
  org,
  onViewDetails,
  onDelete,
  getTypeLabel,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4 bg-white border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex items-start gap-4 shrink-0">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-3 border-slate-300 shadow-md">
                <Image
                  preview
                  src={
                    org?.profile_image_url || "https://via.placeholder.com/100"
                  }
                  alt={org?.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <Tag
                value={org?.is_active ? "Active" : "Inactive"}
                severity={org?.is_active ? "success" : "danger"}
                className="absolute -top-2 -right-2 shadow-md"
                icon={
                  org?.is_active ? "pi pi-check-circle" : "pi pi-times-circle"
                }
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-slate-800 mb-2 hover:text-blue-600 transition-colors">
                {org?.name}
              </h3>
              <Badge
                value={getTypeLabel(org?.type)}
                severity="info"
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="pi pi-envelope text-blue-600"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-semibold mb-1">
                    Email
                  </p>
                  <p className="text-sm text-slate-700 font-medium truncate">
                    {org?.email}
                  </p>
                </div>
              </div>

              {org?.phone_number && (
                <div className="flex items-center gap-3 bg-green-50 rounded-lg p-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-phone text-green-600"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 font-semibold mb-1">
                      Phone
                    </p>
                    <p className="text-sm text-slate-700 font-medium">
                      {org?.phone_number}
                    </p>
                  </div>
                </div>
              )}

              {org?.city && (
                <div className="flex items-center gap-3 bg-red-50 rounded-lg p-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-map-marker text-red-600"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 font-semibold mb-1">
                      Location
                    </p>
                    <p className="text-sm text-slate-700 font-medium">
                      {org?.city}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 bg-orange-50 rounded-lg p-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <i className="pi pi-calendar text-orange-600"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-semibold mb-1">
                    Created
                  </p>
                  <p className="text-sm text-slate-700 font-medium">
                    {new Date(org?.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex lg:flex-col gap-3 w-full lg:w-auto">
            <Button
              label="Delete"
              icon="pi pi-trash"
              severity="danger"
              outlined
              className="flex-1 lg:flex-initial border-red-500 text-red-600 hover:bg-red-50"
              onClick={() => onDelete(org?.id)}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
