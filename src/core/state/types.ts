export type DispenserMode = "IDLE" | "POURING" | "POST_POUR" | "GAME" | "HOUSEHOLD";

export type TempMode = "COLD" | "COOL" | "HOT";
export type VolumeMode = "AUTO" | "8OZ" | "12OZ" | "16OZ";

export type HouseholdMember = { name: string; glasses: number };

export type HydrationState = {
  mode: DispenserMode;

  goalMl: number;
  todayMl: number;
  streakDays: number;

  sessionMl: number;
  tempMode: TempMode;
  volumeMode: VolumeMode;

  household: HouseholdMember[];

  // placeholders for “appliance complexity”
  filterPercent: number; // 0–100
  wifiConnected: boolean;
  iceEnabled: boolean;
};
