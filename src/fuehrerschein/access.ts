/** Ab diesem Schuljahr (ca. 18 Jahre) erscheint die Führerschein-Theorie automatisch; Eltern können sie früher freischalten. */
export const DRIVING_MIN_YEAR = 13;
export const drivingAvailable = (year: number, unlocked?: boolean) => year >= DRIVING_MIN_YEAR || !!unlocked;
