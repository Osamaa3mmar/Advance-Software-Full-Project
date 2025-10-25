import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";

export default function OrganizationFilters({
  globalFilter,
  setGlobalFilter,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  sortField,
  sortOrder,
  onSortChange,
  organizationTypes,
  statusOptions,
  sortOptions,
  filteredCount,
  onAddClick,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              Organizations
            </h2>
            <p className="text-sm text-slate-600">
              Manage and monitor all organizations
              <Badge value={filteredCount} className="ml-2" severity="info" />
            </p>
          </div>
          <Button
            label="Add Organization"
            icon="pi pi-plus"
            onClick={onAddClick}
            className="shadow-md"
          />
        </div>

        {/* Search */}
       

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InputText
                
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full"
            />
          <Dropdown
            value={typeFilter}
            options={organizationTypes}
            onChange={(e) => setTypeFilter(e.value)}
            placeholder="Filter by Type"
            className="w-full"
            showClear
          />

        
        </div>
      </div>
    </div>
  );
}
