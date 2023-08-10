export type IResponse = {
  roomId: number;
  roomName: string;
  remainingTime: number;
  login: string;
  participantsNum: number;
};

export type IContext = {
  context?: boolean;
  ddukddak?: boolean;
  roomInfo?: IResponse | null;
};
