'use client'

import React from 'react'
import PrizeLevel from './PrizeLevel/PrizeLevel'
import './styles.scss'
import { IQuestionListForUser } from '@/types'

interface ISideQuizPrizeProps {
  prizeLevels: IQuestionListForUser[]
  currentQuestionId: string | null
}

export const SideQuizPrize = ({
  prizeLevels,
  currentQuestionId,
}: ISideQuizPrizeProps) => {
  const currentQuestionIndex = prizeLevels?.findIndex(
    question => question.id === currentQuestionId
  )
  return (
    <div className="quiz-prize__list">
      {prizeLevels?.map((prize, index) => (
        <PrizeLevel
          key={index}
          prize={prize.reward}
          isCurrent={prize.id === currentQuestionId}
          isPast={index < currentQuestionIndex}
        />
      ))}
    </div>
  )
}
