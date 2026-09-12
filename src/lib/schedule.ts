import { batches, type Batch } from "@/content/schedule";

export interface ScheduleRow {
  batchId: string;
  batchName: string;
  ageRange: Batch["ageRange"];
  day: Batch["days"][number];
  startIST: string;
  endIST: string;
  seatsRemaining: number;
}

/** Flattens batches into one row per meeting day — brief section 7's
 * worked example shows Saturday and Sunday as separate lines, each
 * with its own local-time conversion (they can differ once a
 * timezone's DST offset changes partway through the year). */
export function scheduleRows(): ScheduleRow[] {
  return batches.flatMap((batch) =>
    batch.days.map((day) => ({
      batchId: batch.id,
      batchName: batch.name,
      ageRange: batch.ageRange,
      day,
      startIST: batch.startIST,
      endIST: batch.endIST,
      seatsRemaining: batch.seatsRemaining,
    })),
  );
}
