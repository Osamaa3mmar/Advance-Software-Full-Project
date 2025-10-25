import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { motion } from "framer-motion";

export default function OrganizationGridItem({
  org,
  onViewDetails,
  onDelete,
  getTypeLabel,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-3"
    >
      <Card className="h-full bg-white border-2 border-slate-200 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 overflow-hidden group">
        <div className="flex flex-col items-center text-center relative">
          {/* Status Badge - Top Right */}
          <Tag
            value={org?.is_active ? "Active" : "Inactive"}
            severity={org?.is_active ? "success" : "danger"}
            className="absolute top-0 right-0 rounded-bl-lg"
            icon={org?.is_active ? "pi pi-check-circle" : "pi pi-times-circle"}
          />

          {/* Profile Image */}
          <div className="relative mt-4 mb-6">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-slate-200 group-hover:border-blue-500 transition-all shadow-lg">
              <img
                src={
                  org?.profile_image_url || "https://via.placeholder.com/120"
                }
                alt={org?.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            {/* Type Badge on Image */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <Badge
                value={getTypeLabel(org?.type)}
                severity="info"
                className="text-xs px-3 py-1 shadow-md"
              />
            </div>
          </div>

          {/* Organization Name */}
          <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 px-2">
            {org?.name}
          </h3>

          {/* Details Grid */}
          <div className="w-full space-y-3 mb-4 px-2">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg p-2">
              <i className="pi pi-envelope text-blue-500"></i>
              <span className="truncate font-medium">{org?.email}</span>
            </div>

            {org?.city && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg p-2">
                <i className="pi pi-map-marker text-red-500"></i>
                <span className="font-medium">{org?.city}</span>
              </div>
            )}

            {org?.phone_number && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg p-2">
                <i className="pi pi-phone text-green-500"></i>
                <span className="font-medium">{org?.phone_number}</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-200">
              <i className="pi pi-calendar text-orange-500"></i>
              <span>{new Date(org?.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full px-2">
            <Button
              icon="pi pi-eye"
              label="View"
              size="small"
              outlined
              className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
              onClick={() => onViewDetails(org)}
            />
            <Button
              icon="pi pi-trash"
              size="small"
              severity="danger"
              outlined
              className="border-red-500 text-red-600 hover:bg-red-50"
              onClick={() => onDelete(org?.id)}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
