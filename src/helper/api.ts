import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const SESSIONS_FILE = join('/tmp', 'sessions.json')

export function loadSessions(): Record<string, string> {
  try {
    const data = readFileSync(SESSIONS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return {}
  }
}

// Save sessions to file
export function saveSessions(sessions: Record<string, string>) {
  writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2))
}
