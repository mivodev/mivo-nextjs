/**
 * Settings module — shared TypeScript types.
 */

export interface SettingEntry {
  key: string;
  value: string;
}

export interface SystemSettings {
  adminUsername: string;
  quickPrintMode: "0" | "1";
  [key: string]: string;
}

export interface VoucherTemplate {
  id: string;
  routerId: string | null;
  sessionName: string;
  name: string;
  content: string;
  description?: string;
  paperSize?: string;
  isSystem?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVoucherTemplateInput {
  routerId?: string;
  sessionName: string;
  name: string;
  content: string;
}

export interface LogoItem {
  id: string;
  name: string;
  path: string;
  type: string;
  formattedSize: string;
}

export interface CorsRule {
  id: string;
  origin: string;
  methods: string[];
  headers: string;
  maxAge: number;
}

export interface PluginItem {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  status: "active" | "inactive";
}
