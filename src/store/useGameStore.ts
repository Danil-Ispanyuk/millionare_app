import { create } from 'zustand'
import { IGameState, ISessionData } from '@/types'
import { devtools } from 'zustand/middleware'
import { correctAnswerDelay } from '@/constants/quizLevel'

export const useGameStore = create<IGameState>()(
  devtools(set => ({
    currentQuestion: null,
    currentQuestionId: null,
    nextQuestionId: null,
    currentUserReward: 0,
    rewards: [],
    isGameOver: false,
    createSession: async () => {
      try {
        const response = await fetch('/api/game/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        if (!response.ok) {
          throw new Error(`Failed to create session: ${response.status}`)
        }
      } catch (_) {
        set({ isGameOver: true })
      }
    },
    fetchSession: async () => {
      try {
        const response = await fetch('/api/game/session')
        if (!response.ok) {
          throw new Error(`Failed to fetch session: ${response.status}`)
        }
        const data: ISessionData = await response.json()
        set({
          currentQuestionId: data.currentQuestionId,
          currentUserReward: data.currentUserReward,
          nextQuestionId: data.nextQuestionId,
          isGameOver: data.isGameOver,
          rewards: data.rewards,
        })
      } catch (_) {
        set({ isGameOver: true })
      }
    },
    removeSession: async () => {
      try {
        const response = await fetch('/api/game/session', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
        if (!response.ok) {
          throw new Error(`Failed to remove session: ${response.status}`)
        }
        set({
          currentQuestionId: null,
          currentUserReward: 0,
          isGameOver: true,
          rewards: [],
        })
      } catch (_) {
        set({ isGameOver: true })
      }
    },
    updateSession: async sessionData => {
      try {
        const response = await fetch('/api/game/session', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData),
        })
        if (!response.ok) {
          throw new Error(`Failed to update session: ${response.status}`)
        }
      } catch (error) {
        set({ isGameOver: true })
      }
    },
    fetchQuestion: async questionData => {
      set({
        currentQuestion: questionData,
        currentUserReward: questionData.reward,
      })
    },
    handleQuestions: async result => {
      try {
        if (result.isCorrect) {
          if (!result.nextQuestionId) {
            set(() => ({
              isGameOver: true,
            }))
            return
          }

          const timeoutId = setTimeout(() => {
            set(() => ({
              currentQuestionId: result.nextQuestionId,
              nextQuestionId: result.afterNextQuestionId,
            }))
          }, correctAnswerDelay)

          return () => clearTimeout(timeoutId)
        } else {
          set(() => ({
            isGameOver: true,
          }))
        }
      } catch (_) {
        set({ isGameOver: true })
      }
    },
  }))
)
