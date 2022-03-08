import timestring from 'timestring'

/**
 * Converts a relative time string to a number of seconds.
 *
 * @param time - Time string
 * @returns Amount of seconds for this time string
 */
export function convertToSeconds (time: string): number {
  return timestring(time)
}
