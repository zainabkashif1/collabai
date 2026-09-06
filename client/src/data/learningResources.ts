export type LearningKind = "Video" | "Documentary";

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  language: string;
  topic: string;
  kind: LearningKind;
  duration: string;
  videoId?: string;
  searchQuery?: string;
  accent: "signal" | "ember" | "mint";
}

export const learningResources: LearningResource[] = [
  {
    id: "python-foundations",
    title: "Python for Beginners",
    description: "Build a strong foundation with variables, loops, functions, and projects.",
    language: "English",
    topic: "Python",
    kind: "Video",
    duration: "4h 26m",
    videoId: "rfscVS0vtbw",
    accent: "signal",
  },
  {
    id: "javascript-foundations",
    title: "JavaScript Algorithms",
    description: "Practice the language fundamentals that power modern web applications.",
    language: "English",
    topic: "JavaScript",
    kind: "Video",
    duration: "3h 46m",
    videoId: "PkZNo7MFNFg",
    accent: "ember",
  },
  {
    id: "sql-foundations",
    title: "SQL Full Course",
    description: "Learn how to query, shape, and reason about relational data.",
    language: "English",
    topic: "SQL",
    kind: "Video",
    duration: "4h 20m",
    videoId: "HXV3zeQKqGY",
    accent: "mint",
  },
  {
    id: "python-documentary",
    title: "Python: The Documentary",
    description: "Discover the people, decisions, and community behind Python's story.",
    language: "English",
    topic: "Python",
    kind: "Documentary",
    duration: "1h 10m",
    searchQuery: "Python The Documentary official",
    accent: "signal",
  },
  {
    id: "javascript-documentary",
    title: "The Story of JavaScript",
    description: "Explore how a small browser language became a global platform.",
    language: "English",
    topic: "JavaScript",
    kind: "Documentary",
    duration: "52m",
    searchQuery: "The Story of JavaScript documentary",
    accent: "ember",
  },
  {
    id: "tech-hindi",
    title: "Programming Stories in Hindi",
    description: "Find approachable developer documentaries and career stories in Hindi.",
    language: "Hindi",
    topic: "Developer Life",
    kind: "Documentary",
    duration: "Playlist",
    searchQuery: "programming documentary Hindi developer story",
    accent: "mint",
  },
  {
    id: "tech-spanish",
    title: "Historias de la tecnología",
    description: "Documentales y conversaciones sobre código, innovación y cultura digital.",
    language: "Spanish",
    topic: "Technology",
    kind: "Documentary",
    duration: "Playlist",
    searchQuery: "documentales programación tecnología español",
    accent: "ember",
  },
  {
    id: "tech-french",
    title: "Le monde du code",
    description: "Explore programming, digital culture, and the people building the web.",
    language: "French",
    topic: "Technology",
    kind: "Documentary",
    duration: "Playlist",
    searchQuery: "documentaire programmation technologie français",
    accent: "signal",
  },
];