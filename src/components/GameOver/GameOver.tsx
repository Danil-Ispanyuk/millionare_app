"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import BigHand from "@/assets/images/big-hand.svg";
import { Button } from "@/elements";
import "./styles.scss";
import { useGameStore } from "@/store/useGameStore";
import { useRouter } from "next/navigation";

export const GameOver = () => {
  const router = useRouter();
  const { currentUserReward, fetchSession, removeSession } = useGameStore();

  const handleStart = async () => {
    await removeSession();
    router.push("/");
  };

  useEffect(() => {
    const fetchUserSession = async () => {
      await fetchSession();
    };

    fetchUserSession();
  }, []);

  return (
    <div className="game-over__wrapper">
      <div className="game-over__container">
        <Image src={BigHand} alt="Big Hand" className="game-over__big-hand" />
        <div className="game-over__content">
          <div className="game-over__summary">
            <h1 className="game-over__title">Total score:</h1>
            <div className="game-over__score">${currentUserReward} earned</div>
          </div>
          <Button onClick={() => handleStart()}>Try again</Button>
        </div>
      </div>
    </div>
  );
};
