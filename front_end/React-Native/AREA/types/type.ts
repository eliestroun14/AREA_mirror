export interface Service {
  id: string;
  serviceName: string;
  description: string;
  backgroundColor: string;
  applets: string[];
}

export interface AppletsCard {
  id: number;
  description: string;
  appName: string;
  backgroundColor: string;
  firstIconId: string;
  secondeIconId: string;
  littleIconId: string;
}
