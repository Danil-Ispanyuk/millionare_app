import {
  IQuestion,
  IQuestionAnswerResponse,
  IQuestionListForUser,
} from './question.type'

export interface IGameState {
  currentQuestion: IQuestion | null | undefined
  currentQuestionId: string | null
  currentUserReward: number
  nextQuestionId: string | null
  isGameOver: boolean
  rewards: IQuestionListForUser[]
  isCorrectAnswer: boolean
  error: {
    message: string | null
  }
  fetchQuestion: (questionData: IQuestion) => Promise<void>
  handleQuestion: (result: IQuestionAnswerResponse) => Promise<void>
  setSessionData: (sessionData: Partial<ISessionData>) => void
}

export interface ISessionData {
  currentQuestionId: string | null
  nextQuestionId: string | null
  isGameOver: boolean
  rewards: IQuestionListForUser[]
  currentUserReward: number
}
