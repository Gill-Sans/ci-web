export interface UserProfile {
    id: string;
    keycloakId: string;
    firstName: string;
    lastName: string;
    email: string;
    companyBranch?: string;
}
