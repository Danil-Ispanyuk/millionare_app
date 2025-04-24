'use client'

import React from 'react'
import './styles.scss'
import { SideQuizPrize } from '../SideQuizPrize/SideQuizPrize'
import { AnswerOption } from '../AnswerOption/AnswerOption'
import { useQuizLogic } from '@/hooks/useQuizLogic'
import useScreenSize from '@/hooks/useScreenSize'
import Image from 'next/image'
import { MenuWithPrizes } from '../MenuWithPrizes/MenuWithPrizes'
import { useHandleMenu } from '@/store/useHandleMenu'
import { Loader } from '@/elements'

interface QuizLevelProps {
  questionId: string
}

export const QuizLevel = ({ questionId }: QuizLevelProps) => {
  const { isMobile } = useScreenSize()
  const { isPrizeMenuOpen, togglePrizeMenu } = useHandleMenu()
  const {
    currentQuestion,
    currentQuestionId,
    isMutating,
    selectedAnswer,
    nextQuestionId,
    isCorrectAnswer,
    isGameOver,
    rewards,
    handleChooseAnswer,
  } = useQuizLogic(questionId)

  const handleIsCorrectAnswer = (optionId: string) => {
    if (selectedAnswer === optionId && isCorrectAnswer && !nextQuestionId) {
      return true
    }
    if (selectedAnswer === optionId && isCorrectAnswer) {
      return true
    }

    return false
  }

  const handleIsWrongAnswer = (optionId: string) => {
    return selectedAnswer === optionId && !isCorrectAnswer && isGameOver
  }

  return (
    <div className="quiz-level__wrapper">
      <div className="quiz-level__container">
        {isMobile && (
          <div className="quiz-level__header">
            <Image
              src="/icons/menu-burger.svg"
              alt="Open prize menu"
              width={24}
              height={24}
              className="quiz-level__burger"
              onClick={togglePrizeMenu}
              role="button"
              aria-label="Toggle prize menu"
            />
          </div>
        )}
        <div className="quiz-level__question">{currentQuestion?.text}</div>
        <div className="quiz-level__options">
          {currentQuestion?.answers.map(option => (
            <AnswerOption
              key={option.id}
              label={option.id}
              text={option.text}
              isCorrect={handleIsCorrectAnswer(option.id)}
              isDisabled={!!selectedAnswer || isMutating}
              isSelected={
                selectedAnswer === option.id && !isCorrectAnswer && !isGameOver
              }
              isWrong={handleIsWrongAnswer(option.id)}
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
      {!isMobile && (
        <div className="quiz-level__price-content">
          <SideQuizPrize
            prizeLevels={rewards}
            currentQuestionId={currentQuestionId}
          />
        </div>
      )}
      {isMobile && isPrizeMenuOpen && (
        <MenuWithPrizes
          rewards={rewards}
          currentQuestionId={currentQuestionId}
        />
      )}
    </div>
  )
}
