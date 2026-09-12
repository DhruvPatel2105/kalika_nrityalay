/**
 * Batch times are stored in IST only and converted at render by the
 * timezone converter island. Never store local times — see BRIEF.md
 * section 7.
 *
 * TODO(client): the brief (section 7) gives one concrete batch as a
 * worked example ("Batch A"). Section 1 states capacity for 4–6 batches
 * total; the remaining batches' actual days/times/ages are not yet
 * confirmed, so they are not invented here. Add them as further entries
 * in this array once the client confirms the full roster.
 */

export interface Batch {
  id: string;
  name: string;
  ageRange: { min: number; max: number };
  /** Both days share the same IST start/end time in the current roster. */
  days: Array<"Saturday" | "Sunday">;
  startIST: string; // 24h "HH:MM"
  endIST: string; // 24h "HH:MM"
  capacity: number;
  seatsRemaining: number;
}

export const batches: Batch[] = [
  {
    id: "batch-a",
    name: "Batch A — Beginners",
    ageRange: { min: 6, max: 9 },
    days: ["Saturday", "Sunday"],
    startIST: "18:30",
    endIST: "19:30",
    capacity: 8,
    seatsRemaining: 3,
  },
];
