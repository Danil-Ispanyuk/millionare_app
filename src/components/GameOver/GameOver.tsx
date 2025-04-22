'use client'

import Image from 'next/image'
import React, { useEffect } from 'react'
import { Button } from '@/elements'
import './styles.scss'
import { useGameStore } from '@/store/useGameStore'
import { useRouter } from 'next/navigation'
import { convertToCurrency } from '@/helper/general'
import useScreenSize from '@/hooks/useScreenSize'

export const GameOver = () => {
  const router = useRouter()
  const { currentUserReward, fetchSession, removeSession } = useGameStore()
  const { isMobile, isTablet } = useScreenSize()

  const handleStart = async () => {
    await removeSession()
    router.push('/')
  }

  useEffect(() => {
    const fetchUserSession = async () => {
      await fetchSession()
    }

    fetchUserSession()
  }, [])

  return (
    <div className="game-over__wrapper">
      <div className="game-over__container">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/big-hand.svg`}
          width={100}
          height={100}
          alt="Big Hand"
          className="game-over__big-hand"
        />
        <div className="game-over__content">
          <div className="game-over__summary">
            <h1 className="game-over__title">Total score:</h1>
            <div className="game-over__score">
              {convertToCurrency(currentUserReward)} earned
            </div>
          </div>
          {!isMobile && !isTablet ? (
            <Button onClick={() => handleStart()}>Try again</Button>
          ) : null}
        </div>
      </div>
      {isMobile || isTablet ? (
        <Button onClick={() => handleStart()} className="game-over__button">
          Try again
        </Button>
      ) : null}
    </div>
  )
}
