import { AlertRepository } from "../Repositories/AlertRepository.js";
import { HealthGuidesRepository } from "../Repositories/HealthGuidesRepository.js";
import { OrganizationRepository } from "../Repositories/OrganizationRepository.js";
import { UsersRepository } from "../Repositories/UsersRepository.js";

class AdminInfoServices {
  static getSummary = async () => {
    try {
      const userCount = await UsersRepository.getAllUsersCount();
      const organizationCount =
        await OrganizationRepository.getAllOrganizationsCount();
      const healthGuideCount =
        await HealthGuidesRepository.getTotalGuidesCount();
      const alertsCount = await AlertRepository.getTotalAlertsCount();
      return {
        success: true,
        message: "Summary fetched successfully",
        data: {
          userCount,
          organizationCount,
          healthGuideCount,
          alertsCount,
        },
      };
    } catch (error) {
      return { success: false, message: "Server Error", error };
    }
  };
}

export default AdminInfoServices;
