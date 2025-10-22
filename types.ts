
export interface Source {
  title: string;
  uri: string;
}

export enum LoadingStep {
  IDLE = "Ready to generate",
  FETCHING_SOURCES = "Gathering intelligence...",
  GENERATING_SCRIPT = "Writing podcast script...",
  GENERATING_AUDIO = "Recording podcast...",
}
