export interface Service {
  id: string;
  serviceName: string;
  description: string;
  pathLogoApp: string;
  backgroundColor: string;
  applets: string[];
}

export interface AppletCard {
  id: number;
  description: string;
  appName: string;
  backgroundColor: string;
  firstIconPath: string;
  secondeIconPath: string;
  littleIconPath: string;
}
