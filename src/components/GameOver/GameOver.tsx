'use client'

import Image from 'next/image'
import React, { useEffect, useCallback } from 'react'
import { Button, Loader } from '@/elements'
import './styles.scss'
import { useGameStore } from '@/store/useGameStore'
import { useSession } from '@/hooks/useSession'
import { useRouter } from 'next/navigation'
import { convertToCurrency } from '@/helper/general'
import useScreenSize from '@/hooks/useScreenSize'
import { toast } from 'react-toastify'

export const GameOver = () => {
  const router = useRouter()
  const { currentUserReward, setSessionData } = useGameStore()
  const {
    fetchSession,
    removeSession,
    isLoading,
    error: sessionError,
  } = useSession()
  const { isMobile, isTablet } = useScreenSize()

  const handleStart = async () => {
    await removeSession()
    router.push('/')
  }

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const sessionData = await fetchSession()
        if (sessionData) {
          setSessionData(sessionData)
        }
      } catch (err) {
        toast.error('Failed to load session data.')
      }
    }

    fetchUserSession()
  }, [])

  useEffect(() => {
    if (sessionError) {
      toast.error(sessionError.message)
      router.push('/')
    }
  }, [sessionError])

  if (isLoading) {
    return <Loader />
  }

  const isSmallScreen = isMobile || isTablet

  return (
    <div className="game-over__wrapper">
      <div className="game-over__container">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/big-hand.svg`}
          width={100}
          height={100}
          alt="Decorative hand illustration"
          className="game-over__big-hand"
        />
        <div className="game-over__content">
          <div className="game-over__summary">
            <h1 className="game-over__title">Total score:</h1>
            <div className="game-over__score">
              {convertToCurrency(currentUserReward)} earned
            </div>
          </div>
          {!isSmallScreen && (
            <Button
              onClick={handleStart}
              className="game-over__button"
              aria-label="Try again"
            >
              Try again
            </Button>
          )}
        </div>
      </div>
      {isSmallScreen && (
        <Button
          onClick={handleStart}
          className="game-over__button"
          aria-label="Try again"
        >
          Try again
        </Button>
      )}
    </div>
  )
}
