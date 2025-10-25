import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";

export default function OrganizationLoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-2 border-slate-200">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Left Section - Image */}
              <div className="flex items-start gap-4 flex-shrink-0">
                <div className="relative">
                  <Skeleton
                    shape="square"
                    width="6rem"
                    height="6rem"
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Middle Section - Details */}
              <div className="flex-1 min-w-0">
                <div className="mb-4">
                  <Skeleton width="60%" height="2rem" className="mb-2" />
                  <Skeleton width="30%" height="1.5rem" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Email Skeleton */}
                  <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
                    <Skeleton shape="circle" size="2.5rem" />
                    <div className="flex-1 min-w-0">
                      <Skeleton width="40%" height="0.75rem" className="mb-1" />
                      <Skeleton width="80%" height="1rem" />
                    </div>
                  </div>

                  {/* Phone Skeleton */}
                  <div className="flex items-center gap-3 bg-green-50 rounded-lg p-3">
                    <Skeleton shape="circle" size="2.5rem" />
                    <div className="flex-1 min-w-0">
                      <Skeleton width="40%" height="0.75rem" className="mb-1" />
                      <Skeleton width="70%" height="1rem" />
                    </div>
                  </div>

                  {/* Location Skeleton */}
                  <div className="flex items-center gap-3 bg-red-50 rounded-lg p-3">
                    <Skeleton shape="circle" size="2.5rem" />
                    <div className="flex-1 min-w-0">
                      <Skeleton width="40%" height="0.75rem" className="mb-1" />
                      <Skeleton width="60%" height="1rem" />
                    </div>
                  </div>

                  {/* Created Skeleton */}
                  <div className="flex items-center gap-3 bg-orange-50 rounded-lg p-3">
                    <Skeleton shape="circle" size="2.5rem" />
                    <div className="flex-1 min-w-0">
                      <Skeleton width="40%" height="0.75rem" className="mb-1" />
                      <Skeleton width="50%" height="1rem" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Action Buttons */}
              <div className="flex lg:flex-col gap-3 w-full lg:w-auto">
                <Skeleton width="8rem" height="2.5rem" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
