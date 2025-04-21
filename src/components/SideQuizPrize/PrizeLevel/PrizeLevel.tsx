"use client";

import React from "react";
import "./styles.scss";

interface PrizeLevelProps {
  prize: number;
  isCurrent?: boolean;
}

const PrizeLevel: React.FC<PrizeLevelProps> = ({
  prize,
  isCurrent = false,
}) => {
  return (
    <div className="prize-level__wrapper">
      <p className={`prize-level__line ${isCurrent ? "active" : null}`} />
      <div className={`prize-level__container ${isCurrent ? "current" : null}`}>
        {prize}
      </div>
      <p className={`prize-level__line ${isCurrent ? "active" : null}`} />
    </div>
  );
};

export default PrizeLevel;
