export interface Message {
    id: number;
    text: string;
    sender: string;
    timestamp?: Date;
  }
  
  export interface User {
    username: string;
    avatarSrc: string;
  }