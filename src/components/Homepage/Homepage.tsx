"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import BigHand from "@/assets/images/big-hand.svg";
import { Button } from "@/elements";
import "./styles.scss";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";

export const Homepage = () => {
  const router = useRouter();
  const { currentQuestionId, createSession, fetchSession } = useGameStore();

  const handleStartGame = async () => {
    await createSession();
    await fetchSession();
  };

  useEffect(() => {
    if (currentQuestionId) {
      router.push(`/questions/${currentQuestionId}`);
    }
  }, [currentQuestionId]);

  return (
    <div className="home-page__wrapper">
      <div className="orange-triangle" />

      <div className="home-page__container">
        <Image src={BigHand} alt="Big Hand" className="home-page__big-hand" />
        <div className="home-page__content">
          <h1 className="home-page__title">Who wants to be a millionaire?</h1>
          <Button onClick={() => handleStartGame()}>Start</Button>
        </div>
      </div>
    </div>
  );
};
