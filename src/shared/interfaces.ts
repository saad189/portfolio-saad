export interface Education {
  university: University;
  programName: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface University {
  name: string;
  link: string;
  iconUrl: string;
}

export interface Certificate {
  name: string;
  description?: string;
  url: string;
  iconUrl: string;
  completionDate: string;
  offeredOrg: string;
}

export interface Experience {
  roleName: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}
