"use client";

import React from "react";
import PrizeLevel from "./PrizeLevel/PrizeLevel";
import "./styles.scss";
import { IQuestionListForUser } from "@/types";

interface ISideQuizPrizeProps {
  prizeLevels: IQuestionListForUser[];
  currentQuestionId: string | null;
}

export const SideQuizPrize = ({
  prizeLevels,
  currentQuestionId,
}: ISideQuizPrizeProps) => {
  return (
    <div className="quiz-prize__list">
      {prizeLevels.map((prize, index) => (
        <PrizeLevel
          key={index}
          prize={prize.reward}
          isCurrent={prize.id === currentQuestionId}
        />
      ))}
    </div>
  );
};
