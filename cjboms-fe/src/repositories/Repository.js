import OrganizationRepository from "./OrganizationRepository";

export default ($axios) => ({
  organization: OrganizationRepository($axios)
})
