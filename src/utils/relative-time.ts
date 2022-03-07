import timestring from 'timestring'

export function convertToSeconds (time: string): number {
  return timestring(time)
}
