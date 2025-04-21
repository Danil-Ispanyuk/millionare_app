import { IQuestionListForUser, IQuestion, IQuestionRequest } from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data: IQuestionRequest = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/questions.json`
    ).then((res) => res.json());

    const formattedQuestions = data.questions.map(
      (question: IQuestion): IQuestionListForUser => {
        return {
          id: question.id,
          reward: question.reward,
        };
      }
    );

    return NextResponse.json(formattedQuestions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load game questions" },
      { status: 500 }
    );
  }
}
