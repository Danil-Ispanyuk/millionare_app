import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  IGameState,
  IQuestion,
  IQuestionAnswerResponse,
  ISessionData,
} from '@/types'
import { correctAnswerDelay } from '@/constants/quizLevel'

const handleCorrectAnswer = (result: IQuestionAnswerResponse, set: any) => {
  if (!result.nextQuestionId) {
    set({ isGameOver: true })
    return () => {}
  }

  const timeoutId = setTimeout(() => {
    set({
      currentQuestionId: result.nextQuestionId,
      nextQuestionId: result.afterNextQuestionId,
    })
  }, correctAnswerDelay)

  return () => clearTimeout(timeoutId)
}

const handleIncorrectAnswer = (set: any) => {
  set({ isGameOver: true })
}

export const useGameStore = create<IGameState>()(
  devtools(set => ({
    currentQuestion: null,
    currentQuestionId: null,
    nextQuestionId: null,
    currentUserReward: 0,
    rewards: [],
    isGameOver: false,
    isCorrectAnswer: false,
    error: null,
    progress: { answered: 0, total: 0 },
    fetchQuestion: async (questionData: IQuestion) => {
      set({
        currentQuestion: questionData,
        currentUserReward: questionData.reward,
        error: {
          message: null,
        },
      })
    },
    handleQuestion: async (result: IQuestionAnswerResponse) => {
      try {
        set(state => ({
          isCorrectAnswer: result.isCorrect,
        }))
        return result.isCorrect
          ? handleCorrectAnswer(result, set)
          : handleIncorrectAnswer(set)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error'
        set({ error: { message: errorMessage } })
      }
    },
    setSessionData: (sessionData: Partial<ISessionData>) =>
      set({
        currentQuestionId: sessionData.currentQuestionId ?? null,
        nextQuestionId: sessionData.nextQuestionId ?? null,
        currentUserReward: sessionData.currentUserReward ?? 0,
        rewards: sessionData.rewards ?? [],
        isGameOver: sessionData.isGameOver ?? false,
      }),
  }))
)
