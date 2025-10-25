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
  static getAllOrganizations = async () => {
    return await OrganizationRepository.getAllOrganizations(false);
  }
  static deleteOrganization = async (id) => {
    try {
      const organization = await OrganizationRepository.getOrganizationById(id);
      if (!organization) {
        return { success: false, message: "Organization not found" };
      }
      await OrganizationRepository.deleteOrganizationById(id);
      return { success: true, message: "Organization deleted successfully" };
    } catch (error) {
      return { success: false, message: "Server Error", error };
    }
  };
}

export default AdminInfoServices;
