import { useState, useCallback } from 'react'
import { ISessionData } from '@/types'
import { ApiEndpoints } from '@/constants/api'

interface SessionError {
  message: string
  code?: number
}

interface SessionState {
  isLoading: boolean
  error: SessionError | null
}

interface SessionActions {
  createSession: () => Promise<void>
  fetchSession: () => Promise<ISessionData | null>
  removeSession: () => Promise<void>
  updateSession: (sessionData: Partial<ISessionData>) => Promise<void>
}

type UseSessionReturn = SessionState & SessionActions

export const useSession = (): UseSessionReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<SessionError | null>(null)

  const createSession = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(ApiEndpoints.SESSION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.status}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError({
        message: errorMessage,
        code: err instanceof Error ? undefined : undefined,
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchSession = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(ApiEndpoints.SESSION, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch session: ${response.status}`)
      }
      return (await response.json()) as ISessionData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError({
        message: errorMessage,
        code: err instanceof Error ? undefined : undefined,
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const removeSession = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(ApiEndpoints.SESSION, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) {
        throw new Error(`Failed to remove session: ${response.status}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError({
        message: errorMessage,
        code: err instanceof Error ? undefined : undefined,
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateSession = useCallback(
    async (sessionData: Partial<ISessionData>) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(ApiEndpoints.SESSION, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData),
        })
        if (!response.ok) {
          throw new Error(`Failed to update session: ${response.status}`)
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error'
        setError({
          message: errorMessage,
          code: err instanceof Error ? undefined : undefined,
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    isLoading,
    error,
    createSession,
    fetchSession,
    removeSession,
    updateSession,
  }
}
