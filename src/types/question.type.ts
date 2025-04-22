export interface IQuestionAnswer {
  id: string
  text: string
}

export interface IQuestionAnswerFull extends Omit<IQuestionAnswer, 'text'> {
  isCorrect: boolean
}

export interface IQuestionRequest {
  questions: IQuestion[]
}

export interface IQuestion {
  id: string
  text: string
  answers: IQuestionAnswer[]
  reward: number
}

export interface IQuestionListForUser {
  id: string
  reward: number
}

export interface IQuestionAnswerRequest {
  questionId: string
  answerId: string
}

export interface IQuestionAnswerResponse {
  isCorrect: boolean
  nextQuestionId: string | null
  afterNextQuestionId: string | null
  currentUserReward: number
}

export interface IQuestionWithCorrectAnswer
  extends Omit<IQuestion, 'answers' | 'text' | 'reward'> {
  answers: IQuestionAnswerFull[]
  reward: number
}
