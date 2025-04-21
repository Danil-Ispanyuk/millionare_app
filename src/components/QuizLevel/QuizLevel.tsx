"use client";

import React, { useEffect } from "react";
import "./styles.scss";
import { SideQuizPrize } from "../SideQuizPrize/SideQuizPrize";
import { AnswerOption } from "../AnswerOption/AnswerOption";
import { useGameStore } from "@/store/useGameStore";
import { useRouter } from "next/navigation";

interface AnswerOption {
  label: string;
  text: string;
}

interface QuizLevelProps {
  questionId: string;
}

export const QuizLevel = ({ questionId }: QuizLevelProps) => {
  const {
    currentQuestionId,
    currentQuestion,
    currentUserReward,
    nextQuestionId,
    isGameOver,
    rewards,
    fetchQuestion,
    fetchSession,
    updateSession,
    setAnswer,
  } = useGameStore();
  const router = useRouter();

  const handleChooseAnswer = async ({
    questionId,
    answerId,
  }: {
    questionId: string;
    answerId: string;
  }) => {
    await setAnswer({
      questionId,
      answerId,
    });
  };

  const updateUserSession = async () => {
    await updateSession({
      currentQuestionId: currentQuestion?.id || "",
      nextQuestionId,
      isGameOver,
      rewards,
      currentUserReward,
    });
  };

  useEffect(() => {
    if (questionId) {
      const fetchQuestionDetails = async () => {
        await fetchQuestion(questionId);
      };

      fetchQuestionDetails();
    }
  }, [questionId]);

  useEffect(() => {
    const fetchUserSession = async () => {
      await fetchSession();
    };

    fetchUserSession();
  }, []);

  useEffect(() => {
    if (isGameOver) {
      router.push("/game-over");
    }
  }, [isGameOver]);

  useEffect(() => {
    if (currentQuestionId && currentQuestionId !== questionId) {
      updateUserSession();

      router.push(`/questions/${currentQuestionId}`);
    }
  }, [currentQuestionId]);

  return (
    <div className="quiz-level__wrapper">
      <div className="quiz-level__container">
        <div className="quiz-level__question">{currentQuestion?.text}</div>
        <div className="quiz-level__options">
          {currentQuestion?.answers.map((option) => (
            <AnswerOption
              key={option.id}
              label={option.id}
              text={option.text}
              handleChooseAnswer={() =>
                handleChooseAnswer({
                  questionId: currentQuestion?.id || "",
                  answerId: option.id,
                })
              }
            />
          ))}
        </div>
      </div>
      <div className="quiz-level__price-content">
        <SideQuizPrize
          prizeLevels={rewards}
          currentQuestionId={currentQuestionId}
        />
      </div>
    </div>
  );
};
