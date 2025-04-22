import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { encrypt, decrypt } from '@/lib/crypto'
import { cookies } from 'next/headers'
import {
  IQuestion,
  IQuestionListForUser,
  IQuestionRequest,
  ISessionData,
} from '@/types'
import { loadSessions, saveSessions } from '@/helper/api'

export async function POST() {
  const sessionId = randomUUID()

  const data: IQuestionRequest = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/questions.json`
  ).then(res => res.json())

  const formattedQuestions = data.questions.map(
    (question: IQuestion): IQuestionListForUser => {
      return {
        id: question.id,
        reward: question.reward,
      }
    }
  )

  const initialData: ISessionData = {
    currentQuestionId: formattedQuestions[0].id,
    nextQuestionId: formattedQuestions[1].id,
    isGameOver: false,
    rewards: formattedQuestions,
    currentUserReward: 0,
  }

  const encryptedData = encrypt(JSON.stringify(initialData))
  const sessions = await loadSessions()
  sessions[sessionId] = encryptedData
  await saveSessions(sessions)
  const cookiesObj = await cookies()

  cookiesObj.set('sessionId', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })

  return NextResponse.json({ sessionId })
}

export async function GET() {
  const cookiesObj = await cookies()
  const sessionId = cookiesObj.get('sessionId')?.value

  const sessions = await loadSessions()
  if (!sessionId || !sessions[sessionId]) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const encryptedData = sessions[sessionId]
  const decryptedData = JSON.parse(decrypt(encryptedData)) as ISessionData

  return NextResponse.json(decryptedData)
}

export async function PATCH(request: Request) {
  const cookiesObj = await cookies()
  const sessionId = cookiesObj.get('sessionId')?.value

  const {
    currentQuestionId,
    nextQuestionId,
    isGameOver,
    rewards,
    currentUserReward,
  } = await request.json()

  const updatedData: ISessionData = {
    currentQuestionId,
    nextQuestionId,
    isGameOver,
    rewards,
    currentUserReward,
  }

  console.log('updatedData :>> ', updatedData)

  const sessions = await loadSessions()
  if (!sessionId || !sessions[sessionId]) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const encryptedData = encrypt(JSON.stringify(updatedData))
  sessions[sessionId] = encryptedData
  await saveSessions(sessions)

  return NextResponse.json({ message: 'Session updated' })
}

export async function DELETE() {
  const cookiesObj = await cookies()
  const sessionId = cookiesObj.get('sessionId')?.value

  const sessions = await loadSessions()
  if (!sessionId || !sessions[sessionId]) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  cookiesObj.delete('sessionId')
  return NextResponse.json({ message: 'Session deleted' })
}
