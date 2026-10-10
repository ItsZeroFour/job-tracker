export const STATUSES = [
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
] as const;

export const page_size: number = 10;

export type Status = (typeof STATUSES)[number];

export type Application = {
  id: string;
  company: string;
  position: string;
  status: Status;
  salary?: number;
  link?: string;
  notes?: string;
  createdAt: string;
};

export type Filters = { search: string; status: Status | ""; page: number };
export type ApplicationsPage = { items: Application[]; total: number };
