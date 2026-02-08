import type { Genre } from "../types";

const TICKETMASTER_GENRE_MAP: Record<string, Genre> = {
  Rock: "rock",
  Pop: "pop",
  "Hip-Hop/Rap": "hip-hop",
  "R&B": "rnb",
  Electronic: "electronic",
  "Dance/Electronic": "electronic",
  Dance: "electronic",
  Metal: "metal",
  "Hard Rock": "metal",
  Jazz: "jazz",
  Classical: "classical",
  Reggae: "reggae",
  Folk: "folk",
  Country: "folk",
  World: "world",
  Alternative: "indie",
  "Indie Pop": "indie",
  "Indie Rock": "indie",
  Punk: "punk",
  Blues: "blues",
  Latin: "latin",
  Soul: "rnb",
  Funk: "rnb",
  Chanson: "pop",
  Variete: "pop",
};

const DATA_CULTURE_GENRE_MAP: Record<string, Genre> = {
  "Musiques actuelles": "rock",
  "Musiques amplifiees ou electro": "electronic",
  "Musiques electroniques": "electronic",
  Electro: "electronic",
  "Musiques du monde": "world",
  Jazz: "jazz",
  "Musique classique": "classical",
  "Musique contemporaine": "classical",
  Chanson: "pop",
  "Chanson francaise": "pop",
  "Hip-hop": "hip-hop",
  Rap: "hip-hop",
  Reggae: "reggae",
  Rock: "rock",
  Metal: "metal",
  Pop: "pop",
  Blues: "blues",
  Folk: "folk",
};

export function mapTicketmasterGenre(genreName: string): Genre {
  return TICKETMASTER_GENRE_MAP[genreName] ?? "other";
}

export function mapDataCultureGenre(genreName: string): Genre {
  // Try exact match first
  if (DATA_CULTURE_GENRE_MAP[genreName]) {
    return DATA_CULTURE_GENRE_MAP[genreName];
  }

  // Try partial match
  const lower = genreName.toLowerCase();
  for (const [key, value] of Object.entries(DATA_CULTURE_GENRE_MAP)) {
    if (lower.includes(key.toLowerCase())) {
      return value;
    }
  }

  return "other";
}

export function inferGenreFromText(text: string): Genre[] {
  const lower = text.toLowerCase();
  const genres: Genre[] = [];

  const patterns: [RegExp, Genre][] = [
    [/electro|techno|house|edm|dj|trance|drum.?n.?bass/i, "electronic"],
    [/rock|guitar/i, "rock"],
    [/pop(?!ular)/i, "pop"],
    [/hip.?hop|rap|trap/i, "hip-hop"],
    [/metal|heavy|death|doom|hardcore/i, "metal"],
    [/jazz|swing|bebop/i, "jazz"],
    [/classiq|classical|symphon|orchestra/i, "classical"],
    [/reggae|ska|dub(?!step)/i, "reggae"],
    [/folk|acoustic|trad/i, "folk"],
    [/world|african|latin|bossa/i, "world"],
    [/indie|alternat/i, "indie"],
    [/punk/i, "punk"],
    [/blues/i, "blues"],
    [/r&b|rnb|soul|funk/i, "rnb"],
  ];

  for (const [pattern, genre] of patterns) {
    if (pattern.test(lower) && !genres.includes(genre)) {
      genres.push(genre);
    }
  }

  return genres.length > 0 ? genres : ["other"];
}
