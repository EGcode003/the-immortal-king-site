export interface Chapter {
  id: string;
  title: string;
  content: string;
  imagePrompt: string;
}

export const STORY_CHAPTERS: Chapter[] = [
  {
    id: "intro",
    title: "The Immortal King",
    content: "In a world where the sun had almost forgotten how to shine, there lived a 15-year-old boy named Kael. The world around him was called Noctara—a land of endless twilight. Tall black towers stretched into the sky, forests whispered in cold winds, and glowing blue rivers flowed through silent cities long abandoned by ordinary people. Most people believed hope had disappeared from this world. But they were wrong. Because Kael carried a secret no one fully understood. He could not die.",
    imagePrompt: "A 15-year-old boy named Kael standing in a twilight world called Noctara, tall black towers in the background, glowing blue rivers, cinematic lighting, dark fantasy style."
  },
  {
    id: "boy-who-would-not-fall",
    title: "The Boy Who Would Not Fall",
    content: "Kael had lived longer than anyone expected. When he was younger, he fell from cliffs, fought shadow creatures, and survived storms that destroyed entire villages. Every time something terrible happened, he would wake up again. Older. Stronger. Wiser. No one knew why. Some called him cursed. Others called him the Immortal One. But deep inside, Kael didn’t feel like a legend. He just felt like a kid trying to survive in a broken world.",
    imagePrompt: "Kael surviving a storm in a ruined village, glowing aura around him, resilience, dark atmospheric fantasy."
  },
  {
    id: "dark-throne",
    title: "The Dark Throne",
    content: "At the center of Noctara stood the Obsidian Citadel, the tallest structure in the world. Inside it sat the ancient Dark Throne, said to belong to the ruler of all shadows. For centuries the throne had been empty. Until the night Kael touched it. The moment his hand brushed the cold black stone, the entire castle trembled. Blue flames lit the halls, ancient symbols glowed on the walls, and a deep voice echoed through the chamber. “The Immortal King has returned.” Kael stepped back in shock. “King…? Me?” But the throne had already chosen him.",
    imagePrompt: "Kael touching a massive obsidian throne, blue flames erupting, ancient glowing symbols on the walls, epic cinematic shot."
  },
  {
    id: "power-of-crown",
    title: "The Power of the Crown",
    content: "When Kael sat on the throne, something changed. He could feel the entire world. The wind across the empty plains. The quiet steps of travelers in ruined cities. The movement of mysterious shadow creatures deep underground. He realized something important. The darkness of Noctara wasn’t just evil—it was lost. And now, somehow, he was responsible for it.",
    imagePrompt: "Kael sitting on the Dark Throne, eyes glowing blue, spiritual connection to the world of Noctara, ethereal atmosphere."
  },
  {
    id: "different-king",
    title: "A Different Kind of King",
    content: "Most kings ruled with armies. Kael ruled with something different: determination. At only fifteen years old, he made a promise to himself: He would rebuild the broken world. He would protect the lost people hiding in ruins. And he would discover why he was immortal. Because somewhere in the darkness of Noctara, there were secrets older than the throne itself. And some of them were waking up.",
    imagePrompt: "Kael standing on a balcony of the Obsidian Citadel, looking over a dark landscape with determination, hope in the darkness."
  },
  {
    id: "legend-beginning",
    title: "The Beginning of a Legend",
    content: "Far beyond the citadel, deep in the frozen mountains, glowing red eyes opened in the shadows. A voice whispered: “So… the Immortal King has risen.”",
    imagePrompt: "Glowing red eyes in a dark frozen mountain cave, mysterious and threatening, foreshadowing a great conflict."
  }
];

export const LORE_ENTRIES = [
  {
    title: "The Obsidian Citadel",
    icon: "Citadel",
    desc: "The tallest structure in the world, carved from a single piece of dark stone. It is the heart of Noctara and the seat of the Immortal King."
  },
  {
    title: "The Endless Twilight",
    icon: "Twilight",
    desc: "A phenomenon where the sun remains just below the horizon, bathing the world in a perpetual blue glow and cold winds."
  },
  {
    title: "Shadow Creatures",
    icon: "Creatures",
    desc: "Mysterious entities that roam the ruins, neither living nor dead, waiting for the King to return to guide them."
  },
  {
    title: "The Blue Rivers",
    icon: "Rivers",
    desc: "Glowing veins of energy that flow through the abandoned cities, providing the only source of light and power in Noctara."
  },
  {
    title: "The Silver City",
    icon: "City",
    desc: "The birthplace of Kael, now a silent ruin of marble and glass, where the first whispers of his immortality began."
  },
  {
    title: "The Frozen Mountains",
    icon: "Mountains",
    desc: "A treacherous range far beyond the citadel where ancient evils are said to sleep, now awakening as the King rises."
  }
];
