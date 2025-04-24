'use client'

import Image from 'next/image'
import React, { useEffect, useCallback } from 'react'
import { Button } from '@/elements'
import './styles.scss'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/useGameStore'
import { useSession } from '@/hooks/useSession'
import useScreenSize from '@/hooks/useScreenSize'
import { Routes } from '@/constants/routes'
import { toast } from 'react-toastify'

export const Homepage = () => {
  const router = useRouter()
  const { currentQuestionId, setSessionData } = useGameStore()
  const {
    createSession,
    fetchSession,
    isLoading,
    error: sessionError,
  } = useSession()
  const { isMobile, isTablet } = useScreenSize()

  const handleStartGame = useCallback(async () => {
    try {
      await createSession()
      const sessionData = await fetchSession()
      if (sessionData) {
        setSessionData(sessionData)
      }
    } catch (err) {
      toast.error('Failed to start game. Please try again.')
    }
  }, [])

  useEffect(() => {
    if (sessionError) {
      toast.error(sessionError.message)
    }
  }, [sessionError])

  useEffect(() => {
    if (currentQuestionId) {
      router.push(`${Routes.QUESTIONS}/${currentQuestionId}`)
    }
  }, [currentQuestionId])

  const isSmallScreen = isMobile || isTablet

  return (
    <div className="home-page__wrapper">
      <div className="orange-triangle" />
      <div className="home-page__container">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/big-hand.svg`}
          width={100}
          height={100}
          alt="Decorative hand illustration"
          className="home-page__big-hand"
        />
        <div className="home-page__content">
          <h1 className="home-page__title">Who wants to be a millionaire?</h1>
          {!isSmallScreen && (
            <Button
              isLoading={isLoading}
              isDisabled={isLoading}
              className="home-page__button"
              onClick={handleStartGame}
              aria-label="Start the game"
            >
              Start
            </Button>
          )}
        </div>
      </div>
      {isSmallScreen && (
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          className="home-page__button"
          onClick={handleStartGame}
          aria-label="Start the game"
        >
          Start
        </Button>
      )}
    </div>
  )
}
