import React from "react";
import "./styles.scss";

interface IAnswerOption {
  label: string;
  text: string;
  handleChooseAnswer: () => void;
}

export const AnswerOption = ({
  label,
  text,
  handleChooseAnswer,
}: IAnswerOption) => {
  return (
    <div className="answer-option__wrapper">
      <p className="answer-option__line" />
      <div className="answer-option__container" onClick={handleChooseAnswer}>
        <div className="answer-option__label">{label}</div>
        <div className="answer-option__text">{text}</div>
      </div>
      <p className="answer-option__line" />
    </div>
  );
};
