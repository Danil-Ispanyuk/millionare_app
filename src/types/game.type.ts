import { IQuestion, IQuestionListForUser } from "./question.type";

export interface IGameState {
  sessionId: string | null;
  currentQuestion: IQuestion | null | undefined;
  currentQuestionId: string | null;
  currentUserReward: number;
  nextQuestionId: string | null;
  isGameOver: boolean;
  rewards: IQuestionListForUser[];
  createSession: () => Promise<void>;
  fetchSession: () => Promise<void>;
  updateSession: (sessionData: ISessionData) => Promise<void>;
  removeSession: () => Promise<void>;
  fetchQuestion: (questionId: string) => Promise<void>;
  setAnswer: ({
    questionId,
    answerId,
  }: {
    questionId: string;
    answerId: string;
  }) => Promise<void>;
}

export interface ISessionData {
  currentQuestionId: string;
  nextQuestionId: string | null;
  isGameOver: boolean;
  rewards: IQuestionListForUser[];
  currentUserReward: number;
}
