/** Formats a 24h "HH:MM" IST string as e.g. "6:30 PM". */
export function formatISTTime(time: string): string {
  const [hoursStr, minutesStr] = time.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const minutesLabel = minutes === 0 ? "" : `:${minutesStr}`;
  return `${hour12}${minutesLabel} ${period}`;
}
