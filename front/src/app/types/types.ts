export interface Character {
  id: number;
  name: string;
  description: string;
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
}

export interface EpisodeData {
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
