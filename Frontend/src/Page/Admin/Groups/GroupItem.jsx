import React from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

export default function GroupItem({ group, onEdit, onDelete, onRequests }) {
  return (
    <div className="p-5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-all duration-200 group">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left section with group info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-slate-800 truncate">
              {group.name}
            </h3>
            <Tag 
              value={group.isPrivate ? "Private" : "Public"} 
              severity={group.isPrivate ? "warning" : "success"}
              rounded
            />
          </div>
          
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {group.description || "No description provided"}
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <i className="pi pi-users text-slate-400" />
              <span className="text-sm font-medium text-slate-600">
                {group.memberCount || 0} Members
              </span>
            </div>
            {group.createdAt && (
              <div className="flex items-center gap-2">
                <i className="pi pi-calendar text-slate-400" />
                <span className="text-sm text-slate-500">
                  {new Date(group.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right section with actions */}
        <div className="flex md:flex-col gap-2 md:min-w-[120px] justify-end">
          <Button
            label="Manage"
            icon="pi pi-users"
            className="p-button-sm p-button-outlined w-full"
            onClick={() => onRequests && onRequests(group)}
          />
          <Button
            label="Edit"
            icon="pi pi-pencil"
            className="p-button-sm p-button-outlined p-button-warning w-full"
            onClick={() => onEdit && onEdit(group)}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-sm p-button-outlined p-button-danger w-full"
            onClick={() => onDelete && onDelete(group.id)}
          />
        </div>
      </div>
    </div>
  );
}
