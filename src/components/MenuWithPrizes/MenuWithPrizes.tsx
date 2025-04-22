import React from 'react'
import './styles.scss'
import { createPortal } from 'react-dom'
import { SideQuizPrize } from '../SideQuizPrize/SideQuizPrize'
import { IQuestionListForUser } from '@/types'
import Image from 'next/image'
import { useHandleMenu } from '@/store/useHandleMenu'

interface IMenuWithPrizesProps {
  rewards: IQuestionListForUser[]
  currentQuestionId: string | null
}

export const MenuWithPrizes = ({
  rewards,
  currentQuestionId,
}: IMenuWithPrizesProps) => {
  const { togglePrizeMenu } = useHandleMenu()

  return createPortal(
    <div className="prizes-menu__wrapper">
      <div className="prizes-menu__header">
        <Image
          width={24}
          height={24}
          src="/icons/cross.svg"
          alt="cross"
          className="prizes-menu__cross"
          onClick={togglePrizeMenu}
        />
      </div>
      <div className="prizes-menu__content">
        <SideQuizPrize
          prizeLevels={rewards}
          currentQuestionId={currentQuestionId}
        />
      </div>
    </div>,
    document.body
  )
}
