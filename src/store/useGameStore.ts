import { create } from "zustand";
import {
  IQuestion,
  IQuestionAnswerResponse,
  IGameState,
  ISessionData,
} from "@/types";
import { devtools } from "zustand/middleware";

export const useGameStore = create<IGameState>()(
  devtools((set) => ({
    sessionId: null,
    currentQuestion: null,
    currentQuestionId: null,
    nextQuestionId: null,
    currentUserReward: 0,
    rewards: [],
    isGameOver: false,
    createSession: async () => {
      try {
        const response = await fetch("/api/game/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`Failed to create session: ${response.status}`);
        }
        const data = await response.json();
        set({
          sessionId: data.sessionId,
        });
      } catch (error) {
        set({ isGameOver: true });
      }
    },
    fetchSession: async () => {
      try {
        const response = await fetch("/api/game/session");
        if (!response.ok) {
          throw new Error(`Failed to fetch session: ${response.status}`);
        }
        const data: ISessionData = await response.json();
        set({
          currentQuestionId: data.currentQuestionId,
          currentUserReward: data.currentUserReward,
          nextQuestionId: data.nextQuestionId,
          isGameOver: data.isGameOver,
          rewards: data.rewards,
        });
      } catch (error) {
        set({ isGameOver: true });
      }
    },
    removeSession: async () => {
      try {
        const response = await fetch("/api/game/session", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`Failed to remove session: ${response.status}`);
        }
        set({
          sessionId: null,
          currentQuestionId: null,
          currentUserReward: 0,
          isGameOver: true,
          rewards: [],
        });
      } catch (error) {
        set({ isGameOver: true });
      }
    },
    updateSession: async (sessionData: ISessionData) => {
      try {
        const response = await fetch("/api/game/session", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sessionData),
        });
        if (!response.ok) {
          throw new Error(`Failed to update session: ${response.status}`);
        }
      } catch (error) {
        set({ isGameOver: true });
      }
    },
    fetchQuestion: async (questionId: string) => {
      try {
        const response = await fetch(`/api/game/question/${questionId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch question: ${response.status}`);
        }
        const question: IQuestion = await response.json();
        set({
          currentQuestion: question,
        });
      } catch (error) {
        set({ isGameOver: true });
      }
    },
    setAnswer: async ({
      questionId,
      answerId,
    }: {
      questionId: string;
      answerId: string;
    }) => {
      try {
        const response = await fetch("/api/game/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId, answerId }),
        });
        if (!response.ok) {
          set(() => ({
            isGameOver: true,
          }));
          throw new Error(`Failed to submit answer: ${response.status}`);
        }
        
        const result: IQuestionAnswerResponse = await response.json();

        if (result.isCorrect) {
          if (!result.nextQuestionId) {
            set(() => ({
              isGameOver: true,
            }));
            return;
          }

          const nextResponse = await fetch(
            `/api/game/question/${result.nextQuestionId}`
          );
          if (!nextResponse.ok) {
            throw new Error("Failed to fetch next question");
          }
          const nextQuestion: IQuestion = await nextResponse.json();
          set(() => ({
            currentQuestion: nextQuestion,
            currentQuestionId: result.nextQuestionId,
            nextQuestionId: result.afterNextQuestionId,
            currentUserReward: nextQuestion.reward,
          }));
        } else {
          set(() => ({
            isGameOver: true,
          }));
        }
      } catch (error) {
        set({ isGameOver: true });
      }
    },
  }))
);
