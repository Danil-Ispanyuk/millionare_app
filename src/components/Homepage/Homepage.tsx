'use client'

import Image from 'next/image'
import React, { useEffect } from 'react'
import { Button } from '@/elements'
import './styles.scss'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/useGameStore'
import useScreenSize from '@/hooks/useScreenSize'

export const Homepage = () => {
  const router = useRouter()
  const { currentQuestionId, createSession, fetchSession } = useGameStore()
  const { isMobile, isTablet } = useScreenSize()

  const handleStartGame = async () => {
    await createSession()
    await fetchSession()
  }

  useEffect(() => {
    if (currentQuestionId) {
      router.push(`/questions/${currentQuestionId}`)
    }
  }, [currentQuestionId])

  return (
    <div className="home-page__wrapper">
      <div className="orange-triangle" />

      <div className="home-page__container">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/big-hand.svg`}
          width={100}
          height={100}
          alt="Big Hand"
          className="home-page__big-hand"
        />
        <div className="home-page__content">
          <h1 className="home-page__title">Who wants to be a millionaire?</h1>
          {!isMobile && !isTablet ? (
            <Button
              className="home-page__button"
              onClick={() => handleStartGame()}
            >
              Start
            </Button>
          ) : null}
        </div>
      </div>
      {isMobile || isTablet ? (
        <Button className="home-page__button" onClick={() => handleStartGame()}>
          Start
        </Button>
      ) : null}
    </div>
  )
}
