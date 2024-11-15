export interface Character {
  id: number;
  name: string;
  description: string;
  character: Character;
  heard: boolean; // Add this line
  characters: Character[];
  [key: string]: any;
}

export interface Episode {
  id: number;
  title: string;
  number: number;
  releaseDate: string;
  description: string;
  caseNumber: string;
  heard: boolean;
  season: number;
  characters: Character[];
  [key: string]: any;
}


export interface InfoType { 
  info: Character | Episode;
}

export interface EpisodeData {
  id: number;
  title: string;
  number: number;
  releaseDate: string;
  description: string;
  caseNumber: string;
  heard: boolean;
  season: number;
  characters?: Character[];
  characterIds: number[];
}

export interface CharacterData {
  name: string;
  description: string;
  episode?: Object;
}

export interface CharacterCardProps {
  character: Character;
}

export interface EpisodeCardProps {
  episode: Episode;
  refreshEpisodes: () => void;
}

export interface EpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  getEpisode: () => void;
  initialValue?: EpisodeData | null;
}

export interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValue?: CharacterData | null;
  id?: string;
  getEpisode?: () => void;
  charactersList: Character[];
}

export interface CharacterOrEpisode {
  id: number;
  title: string;
  number: number;
  releaseDate: string;
  description: string;
  caseNumber: string;
  heard: boolean;
  season: number;
  characters: Character[];
  name: string;
  character: Character;
  item?: any;
}
