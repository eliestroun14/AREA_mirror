export interface AboutJsonActionReactionDTO {
  name: string;
  description: string;
}

export interface AboutJsonServiceDTO {
  name: string;
  actions: AboutJsonActionReactionDTO[];
  reactions: AboutJsonActionReactionDTO[];
}

export interface AboutJsonResponseDTO {
  client: {
    host: string;
  };
  server: {
    current_time: number;
    services: AboutJsonServiceDTO[];
  };
}
