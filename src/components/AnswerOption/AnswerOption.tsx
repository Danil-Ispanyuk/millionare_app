import React from 'react'
import QuizOption from '@/assets/images/quiz-option.svg'
import './styles.scss'
import classNames from 'classnames'

interface IAnswerOption {
  label: string
  text: string
  handleChooseAnswer: () => void

  isCorrect?: boolean
  isWrong?: boolean
  isSelected?: boolean
  isDisabled?: boolean
}

export const AnswerOption = ({
  label,
  text,
  handleChooseAnswer,
  isCorrect,
  isWrong,
  isSelected,
  isDisabled,
}: IAnswerOption) => {
  return (
    <div
      className={classNames('answer-option__wrapper', {
        correct: isCorrect,
        wrong: isWrong,
        selected: isSelected,
      })}
    >
      <p className="answer-option__line" />
      <div
        className="answer-option__container"
        onClick={() => {
          if (isDisabled) return
          handleChooseAnswer()
        }}
      >
        <QuizOption className="answer-option__icon" />
        <div className="answer-option__label">{label}</div>
        <div className="answer-option__text">{text}</div>
      </div>
      <p className="answer-option__line" />
    </div>
  )
}
