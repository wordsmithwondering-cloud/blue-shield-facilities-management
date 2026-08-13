export const LOCATIONS: Record<string, string> = {
  "GF-FT": "Ground Floor, Front Tower",
  "GF-RT": "Ground Floor, Rear Tower",
  "1F-FT": "1st Floor, Front Tower",
  "1F-RT": "1st Floor, Rear Tower",
  "2F-FT": "2nd Floor, Front Tower",
  "2F-RT": "2nd Floor, Rear Tower",
  "3F-FT": "3rd Floor, Front Tower",
  "3F-RT": "3rd Floor, Rear Tower",
  "4F-FT": "4th Floor, Front Tower",
  "4F-RT": "4th Floor, Rear Tower",
  "5F-FT": "5th Floor, Front Tower",
  "5F-RT": "5th Floor, Rear Tower",
  "6F-FT": "6th Floor, Front Tower",
  "6F-RT": "6th Floor, Rear Tower",
  "7F-FT": "7th Floor, Front Tower",
  "7F-RT": "7th Floor, Rear Tower",
  "8F-FT": "8th Floor, Front Tower",
  "8F-RT": "8th Floor, Rear Tower",
  "9F-FT": "9th Floor, Front Tower",
  "9F-RT": "9th Floor, Rear Tower",
  "10F-FT": "10th Floor, Front Tower",
  "10F-RT": "10th Floor, Rear Tower",
  "PH": "Penthouse",
  "B1": "Basement / Parking"
};

export function locationName(code: string | null) {
  return (code && LOCATIONS[code]) || "Blue Shield Towers";
}
