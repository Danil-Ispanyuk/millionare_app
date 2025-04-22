import { IQuestionWithCorrectAnswer, ISessionData } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import serverConfig from '@/server/questions_with_answers.json'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/crypto'
import { loadSessions } from '@/helper/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { questionId, answerId } = body
    const cookieStore = await cookies()

    const sessionId = cookieStore.get('sessionId')?.value

    if (!sessionId) {
      return NextResponse.json(
        { isCorrect: false, error: 'Session ID not found' },
        { status: 400 }
      )
    }

    const sessions = await loadSessions()
    const encryptedData = sessions[sessionId]
    const decryptedData = JSON.parse(decrypt(encryptedData)) as ISessionData

    if (!encryptedData) {
      return NextResponse.json(
        { isCorrect: false, error: 'Session not found' },
        { status: 404 }
      )
    }

    if (
      !questionId ||
      typeof questionId !== 'string' ||
      !answerId ||
      typeof answerId !== 'string'
    ) {
      return NextResponse.json(
        {
          isCorrect: false,
          error: 'Invalid request: questionId and answerId are required',
        },
        { status: 400 }
      )
    }

    const serverAnswers: { questions: IQuestionWithCorrectAnswer[] } =
      serverConfig

    const question = serverAnswers.questions.find(q => q.id === questionId)
    if (!question) {
      return NextResponse.json(
        { isCorrect: false, error: 'Question not found' },
        { status: 404 }
      )
    }

    const answer = question.answers.find(a => a.id === answerId)
    if (!answer) {
      return NextResponse.json(
        { isCorrect: false, error: 'Answer not found' },
        { status: 404 }
      )
    }

    if (!answer.isCorrect) {
      NextResponse.json(
        { isCorrect: false, error: 'Incorrect answer' },
        { status: 404 }
      )
    }

    const { nextQuestionId } = decryptedData

    if (!nextQuestionId) {
      return NextResponse.json({
        isCorrect: true,
        nextQuestionId: null,
        afterNextQuestionId: null,
        currentUserReward: question.reward,
      })
    }

    const indexOfTheNextQuestion = decryptedData.rewards.findIndex(question => {
      return question.id === nextQuestionId
    })
    const afterNextQuestionId =
      decryptedData.rewards[indexOfTheNextQuestion + 1]?.id

    return NextResponse.json({
      isCorrect: answer.isCorrect,
      nextQuestionId,
      afterNextQuestionId,
      currentUserReward: question.reward,
    })
  } catch (error) {
    return NextResponse.json(
      { isCorrect: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
