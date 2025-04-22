'use client'

import React, { useEffect, useMemo, useState } from 'react'
import './styles.scss'
import { SideQuizPrize } from '../SideQuizPrize/SideQuizPrize'
import { AnswerOption } from '../AnswerOption/AnswerOption'
import { useGameStore } from '@/store/useGameStore'
import { useRouter } from 'next/navigation'
import useScreenSize from '@/hooks/useScreenSize'
import Image from 'next/image'
import { MenuWithPrizes } from '../MenuWithPrizes/MenuWithPrizes'
import { useHandleMenu } from '@/store/useHandleMenu'
import useSWR from 'swr'
import { IQuestion, IQuestionAnswerResponse } from '@/types'
import useSWRMutation from 'swr/mutation'
import { correctAnswerDelay } from '@/constants/quizLevel'

interface QuizLevelProps {
  questionId: string
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
  if (!response.ok) {
    throw new Error(`Failed to submit answer: ${response.status}`)
  }
  return response.json() as Promise<IQuestionAnswerResponse>
}

const fetchQuestionFetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch question: ${response.status}`)
  }
  return response.json() as Promise<IQuestion>
}

export const QuizLevel = ({ questionId }: QuizLevelProps) => {
  const {
    currentQuestionId,
    currentQuestion,
    currentUserReward,
    nextQuestionId,
    isGameOver,
    rewards,
    fetchQuestion,
    fetchSession,
    updateSession,
    handleQuestions,
  } = useGameStore()
  const router = useRouter()
  const { isPrizeMenuOpen, togglePrizeMenu } = useHandleMenu()
  const { isMobile } = useScreenSize()
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const { data: questionData, isLoading: isQuestionLoading } = useSWR(
    `/api/game/question/${questionId}`,
    fetchQuestionFetcher
  )

  const { trigger, isMutating } = useSWRMutation(
    '/api/game/answer',
    submitAnswerFetcher
  )

  const isCorrectQuestion = useMemo(() => {
    return currentQuestionId === questionId
  }, [currentQuestionId, questionId])

  const handleChooseAnswer = async ({
    questionId,
    answerId,
  }: {
    questionId: string
    answerId: string
  }) => {
    setSelectedAnswer(answerId)
    const result: IQuestionAnswerResponse = await trigger({
      questionId,
      answerId,
    })
    if (!result.isCorrect) {
      return useGameStore.setState({ isGameOver: true })
    }

    await handleQuestions(result)
    if (result.isCorrect && !result.nextQuestionId) {
      useGameStore.setState({
        isGameOver: true,
        currentUserReward: result.currentUserReward,
      })
      return updateSession({
        currentQuestionId: result.nextQuestionId || '',
        rewards,
        isGameOver: true,
        currentUserReward: result.currentUserReward,
        nextQuestionId: result.afterNextQuestionId,
      })
    }
    await updateSession({
      currentQuestionId: result.nextQuestionId || '',
      rewards,
      isGameOver,
      currentUserReward: result.currentUserReward,
      nextQuestionId: result.afterNextQuestionId,
    })

    const timeoutId = setTimeout(() => {
      router.push(`/questions/${result.nextQuestionId}`)
    }, correctAnswerDelay)

    return () => clearTimeout(timeoutId)
  }

  const updateUserSession = async () => {
    await updateSession({
      currentQuestionId: currentQuestionId || '',
      nextQuestionId,
      isGameOver,
      rewards,
      currentUserReward,
    })
  }

  useEffect(() => {
    if (questionData) {
      const fetchQuestionDetails = async () => {
        await fetchQuestion(questionData)
      }

      fetchQuestionDetails()
    }
  }, [questionData])

  useEffect(() => {
    if (isGameOver) {
      const timeoutId = setTimeout(() => {
        updateUserSession()
        router.push('/game-over')
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [isGameOver])

  useEffect(() => {
    const fetchUserSession = async () => {
      await fetchSession()
    }

    fetchUserSession()
  }, [])

  if (isQuestionLoading) {
    return <div className="quiz-level__loading">Loading...</div>
  }

  return (
    <div className="quiz-level__wrapper">
      <div className="quiz-level__container">
        {isMobile ? (
          <div className="quiz-level__header">
            <Image
              src="/icons/menu-burger.svg"
              alt="menu"
              width={24}
              height={24}
              className="quiz-level__burger"
              onClick={togglePrizeMenu}
            />
          </div>
        ) : null}
        <div className="quiz-level__question">{currentQuestion?.text}</div>
        <div className="quiz-level__options">
          {currentQuestion?.answers.map(option => (
            <AnswerOption
              key={option.id}
              label={option.id}
              isSelected={isMutating && selectedAnswer === option.id}
              isCorrect={
                selectedAnswer === option.id &&
                !isGameOver &&
                !isMutating &&
                isCorrectQuestion
              }
              isWrong={
                selectedAnswer === option.id &&
                isGameOver &&
                !currentQuestionId &&
                !isMutating
              }
              text={option.text}
              handleChooseAnswer={() =>
                handleChooseAnswer({
                  questionId: currentQuestion?.id || '',
                  answerId: option.id,
                })
              }
            />
          ))}
        </div>
      </div>
      {isMobile ? null : (
        <div className="quiz-level__price-content">
          <SideQuizPrize
            prizeLevels={rewards}
            currentQuestionId={currentQuestionId}
          />
        </div>
      )}
      {isMobile && isPrizeMenuOpen ? (
        <MenuWithPrizes
          rewards={rewards}
          currentQuestionId={currentQuestionId}
        />
      ) : null}
    </div>
  )
}
