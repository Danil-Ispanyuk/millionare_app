import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { useGameStore } from '@/store/useGameStore'
import { useSession } from '@/hooks/useSession'
import { correctAnswerDelay } from '@/constants/quizLevel'
import { IQuestion, IQuestionAnswerResponse, ISessionData } from '@/types'
import { Routes } from '@/constants/routes'

const fetchQuestionFetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok)
    throw new Error(`Failed to fetch question: ${response.status}`)
  return response.json() as Promise<IQuestion>
}

const submitAnswerFetcher = async (
  url: string,
  { arg }: { arg: { questionId: string; answerId: string } }
) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  if (!response.ok)
    throw new Error(`Failed to submit answer: ${response.status}`)
  return response.json() as Promise<IQuestionAnswerResponse>
}

export const useQuizLogic = (questionId: string) => {
  const {
    currentQuestion,
    currentQuestionId,
    currentUserReward,
    nextQuestionId,
    isGameOver,
    isCorrectAnswer,
    rewards,
    fetchQuestion,
    handleQuestion,
    setSessionData,
  } = useGameStore()
  const {
    fetchSession,
    updateSession,
    isLoading: isSessionLoading,
    error: sessionError,
  } = useSession()
  const router = useRouter()
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const {
    data: questionData,
    isLoading: isQuestionLoading,
    error: questionError,
  } = useSWR(`/api/game/question/${questionId}`, fetchQuestionFetcher)

  const { trigger, isMutating } = useSWRMutation(
    '/api/game/answer',
    submitAnswerFetcher
  )

  const handleChooseAnswer = async ({
    questionId,
    answerId,
  }: {
    questionId: string
    answerId: string
  }) => {
    setSelectedAnswer(answerId)

    try {
      const result: IQuestionAnswerResponse = await trigger({
        questionId,
        answerId,
      })

      if (!result.isCorrect) {
        useGameStore.setState(state => ({ ...state, isGameOver: true }))
        await updateSession({ currentUserReward, isGameOver: true })
        return
      }

      useGameStore.setState(state => ({
        ...state,
        isCorrectAnswer: result.isCorrect,
      }))
      await handleQuestion(result)

      const sessionData: Partial<ISessionData> = {
        currentQuestionId: result.nextQuestionId || '',
        rewards,
        isGameOver: result.isCorrect && !result.nextQuestionId,
        currentUserReward: result.currentUserReward,
        nextQuestionId: result.afterNextQuestionId,
      }

      if (result.isCorrect && !result.nextQuestionId) {
        useGameStore.setState(state => ({
          ...state,
          isGameOver: true,
          currentUserReward: result.currentUserReward,
        }))
      }

      setSessionData(sessionData)
      await updateSession(sessionData)

      if (result.nextQuestionId) {
        const timeoutId = setTimeout(() => {
          router.push(`/questions/${result.nextQuestionId}`)
        }, correctAnswerDelay)
        return () => clearTimeout(timeoutId)
      }
    } catch (err) {
      useGameStore.setState(state => ({
        ...state,
        error: { message: 'Failed to submit answer' },
        isGameOver: true,
      }))
      await updateSession({ isGameOver: true, currentUserReward })
    }
  }

  useEffect(() => {
    if (questionData) {
      fetchQuestion(questionData)
    }
  }, [questionData])

  useEffect(() => {
    if (isGameOver) {
      const timeoutId = setTimeout(() => {
        router.push(Routes.GAME_OVER)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [isGameOver])

  useEffect(() => {
    if (questionError || sessionError) {
      useGameStore.setState(state => ({
        currentUserReward: state.currentUserReward,
        isGameOver: true,
        error: {
          message:
            questionError?.message || sessionError?.message || 'Unknown error',
        },
      }))

      updateSession({
        isGameOver: true,
        currentUserReward: currentUserReward,
      })

      router.push(Routes.GAME_OVER)
    }
  }, [questionError, sessionError])

  useEffect(() => {
    const initializeSession = async () => {
      const sessionData = await fetchSession()
      if (sessionData) {
        setSessionData(sessionData)
      }
    }
    initializeSession()
  }, [])

  useEffect(() => {
    if (!selectedAnswer) {
      useGameStore.setState(state => ({
        ...state,
        isCorrectAnswer: false,
      }))
    }
  }, [selectedAnswer])

  return {
    currentQuestion,
    currentQuestionId,
    currentUserReward,
    nextQuestionId,
    isLoading: isQuestionLoading || isSessionLoading,
    isMutating,
    selectedAnswer,
    isCorrectAnswer,
    isGameOver,
    rewards,
    handleChooseAnswer,
  }
}
