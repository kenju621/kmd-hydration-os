export type QuestId = "AM_SPRINT" | "STREAK_STEP" | "FAMILY_COMBO" | "COLD_LOVE";

export type Quest = {
  id: QuestId;
  title: string;
  detail: string;
  reward: number; // points
  progress: number;
  target: number;
  done: boolean;
};

export function defaultDailyQuests(): Quest[] {
  return [
    {
      id: "AM_SPRINT",
      title: "Morning Sprint",
      detail: "Drink 2 glasses before noon.",
      reward: 10,
      progress: 0,
      target: 2,
      done: false,
    },
    {
      id: "COLD_LOVE",
      title: "Cold Love",
      detail: "Pour cold water 3 times.",
      reward: 8,
      progress: 0,
      target: 3,
      done: false,
    },
    {
      id: "FAMILY_COMBO",
      title: "Household Combo",
      detail: "Household hits 6 total glasses today.",
      reward: 12,
      progress: 0,
      target: 6,
      done: false,
    },
    {
      id: "STREAK_STEP",
      title: "Streak Step",
      detail: "Complete any 2 quests today.",
      reward: 15,
      progress: 0,
      target: 2,
      done: false,
    },
  ];
}
