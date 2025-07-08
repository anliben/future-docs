export interface Customer {
  id: string;
  domain: string;
  cross: string;
  label: string;
}

export interface Categories {
  id: string;
  label: string;
  mode: string;
  customer: string;
  unreaded: number;
}

export type Documents = {
  id: string;
  name: string;
  type: string;
  webContentLink: string;
  data: any;
  created_at: Date;
  customer: string;
};