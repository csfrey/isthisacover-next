export type Track = {
  spotifyID: string;
  spotifyLink?: string;
  name: string;
  album: string;
  artist: string;
  imageUrl: string;
};

export type Determination = {
  id: number;
  spotify_id: string;
  isCover: boolean;
  gptIsCover: boolean;
};
