export type Track = {
  spotifyid: string;
  spotifylink?: string;
  name: string;
  album: string;
  artist: string;
  imageUrl: string;
};

export type Determination = {
  spotifyid: string;
  iscover: boolean;
  gptiscover: boolean;
};

export type Vote = {
  spotifyid: string;
  iscover: boolean;
  iscorrection: boolean;
};
