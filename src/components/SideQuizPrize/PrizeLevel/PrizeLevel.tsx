'use client'

import React from 'react'
import './styles.scss'
import { convertToCurrency } from '@/helper/general'
import classNames from 'classnames'

interface PrizeLevelProps {
  prize: number
  isCurrent?: boolean
  isPast: boolean
}

const PrizeLevel: React.FC<PrizeLevelProps> = ({
  prize,
  isCurrent = false,
  isPast = false,
}) => {
  return (
    <div className="prize-level__wrapper">
      <p
        className={classNames('prize-level__line', {
          active: isCurrent,
        })}
      />
      <div
        className={classNames('prize-level__container', {
          past: isPast,
          current: isCurrent,
        })}
      >
        {convertToCurrency(prize)}
      </div>
      <p
        className={classNames('prize-level__line', {
          active: isCurrent,
        })}
      />
    </div>
  )
}

export default PrizeLevel
