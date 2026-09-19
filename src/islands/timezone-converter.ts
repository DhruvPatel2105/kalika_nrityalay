/**
 * The timezone converter — brief section 7. Enhances server-rendered
 * IST schedule rows in place: no elements are added or removed, only
 * text content is swapped, so there's no layout shift on hydration.
 */

const IST_OFFSET_MINUTES = 5.5 * 60;
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const TIMEZONE_OPTIONS = [
  { value: "auto", label: "Detect automatically" },
  { value: "America/New_York", label: "Eastern (New York, Toronto)" },
  { value: "America/Chicago", label: "Central (Chicago)" },
  { value: "America/Denver", label: "Mountain (Denver)" },
  { value: "America/Los_Angeles", label: "Pacific (Los Angeles, Vancouver)" },
  { value: "Asia/Kolkata", label: "India Standard Time" },
];

/** Next real UTC instant for a given IST weekday + wall-clock time. */
function nextISTOccurrenceUTC(dayName: string, hh: number, mm: number): Date {
  const targetDow = DAY_NAMES.indexOf(dayName);
  const nowIstMs = Date.now() + IST_OFFSET_MINUTES * 60000;
  const nowIst = new Date(nowIstMs);

  const nowDow = nowIst.getUTCDay();
  const nowHH = nowIst.getUTCHours();
  const nowMM = nowIst.getUTCMinutes();

  let daysUntil = (targetDow - nowDow + 7) % 7;
  const isToday = daysUntil === 0;
  const targetAlreadyPassedToday =
    isToday && (nowHH > hh || (nowHH === hh && nowMM >= mm));
  if (isToday && targetAlreadyPassedToday) daysUntil = 7;

  const targetIstWallClock = new Date(nowIstMs);
  targetIstWallClock.setUTCDate(targetIstWallClock.getUTCDate() + daysUntil);
  targetIstWallClock.setUTCHours(hh, mm, 0, 0);

  return new Date(targetIstWallClock.getTime() - IST_OFFSET_MINUTES * 60000);
}

function formatLocal(date: Date, timeZone: string): { day: string; time: string } {
  const dayFmt = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "long" });
  const timeFmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  });
  return { day: dayFmt.format(date), time: timeFmt.format(date) };
}

export function detectTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "America/New_York";
  }
}

function convertRow(row: HTMLElement, timeZone: string) {
  const day = row.dataset.day;
  const startIST = row.dataset.startIst;
  const endIST = row.dataset.endIst;
  if (!day || !startIST || !endIST) return;

  const [startH, startM] = startIST.split(":").map(Number);
  const [endH, endM] = endIST.split(":").map(Number);

  const startLocal = formatLocal(nextISTOccurrenceUTC(day, startH, startM), timeZone);
  const endLocal = formatLocal(nextISTOccurrenceUTC(day, endH, endM), timeZone);

  const primary = row.querySelector<HTMLElement>("[data-primary-line]");
  const secondary = row.querySelector<HTMLElement>("[data-secondary-line]");
  if (!primary || !secondary) return;

  if (timeZone === "Asia/Kolkata") {
    primary.textContent = `${day}s, ${startLocal.time}–${endLocal.time} IST`;
    secondary.textContent = "";
    return;
  }

  const sameDay = startLocal.day === endLocal.day;
  primary.textContent = sameDay
    ? `${startLocal.day}s, ${startLocal.time}–${endLocal.time}`
    : `${startLocal.day} ${startLocal.time} – ${endLocal.day} ${endLocal.time}`;
  secondary.textContent = `${day} ${startIST.replace(/^0/, "")}–${endIST.replace(/^0/, "")} IST`;
}

export function initTimezoneConverter(root: ParentNode) {
  const select = root.querySelector<HTMLSelectElement>("[data-timezone-select]");
  const rows = Array.from(
    root.querySelectorAll<HTMLElement>("[data-schedule-row]"),
  );
  if (rows.length === 0) return;

  const runConversion = (tz: string) => {
    const resolved = tz === "auto" ? detectTimeZone() : tz;
    rows.forEach((row) => convertRow(row, resolved));
  };

  runConversion("auto");

  if (select) {
    const detected = detectTimeZone();
    const hasDetected = TIMEZONE_OPTIONS.some((o) => o.value === detected);
    if (hasDetected) {
      const autoOption = select.querySelector('option[value="auto"]');
      if (autoOption) {
        autoOption.textContent = `Detect automatically (${detected})`;
      }
    }
    select.addEventListener("change", () => runConversion(select.value));
  }
}
