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
  createSession: () => Promise<void>
  fetchSession: () => Promise<void>
  updateSession: (sessionData: Partial<ISessionData>) => Promise<void>
  removeSession: () => Promise<void>
  fetchQuestion: (questionData: IQuestion) => Promise<void>
  handleQuestions: (result: IQuestionAnswerResponse) => Promise<void>
}

export interface ISessionData {
  currentQuestionId: string | null
  nextQuestionId: string | null
  isGameOver: boolean
  rewards: IQuestionListForUser[]
  currentUserReward: number
}
