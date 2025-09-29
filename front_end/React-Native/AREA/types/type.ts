export interface Service {
  id: string;
  serviceName: string;
  backgroundColor: string;
  applets: string[];
  appDescription: string;
  serviceDescription: string;
  triggers: Trigger[];
}

export interface AppletsCard {
  id: number;
  description: string;
  appName: string;
  backgroundColor: string;
  firstIconId: string;
  secondeIconId: string;
  littleIconId: string;
  howItWorks: string;
}

export interface Trigger {
  id: string;
  name: string;
  description: string;
  service: string;
}
