import { IQuestion, IQuestionRequest } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export interface IQuestionGetRequestProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: IQuestionGetRequestProps) {
  try {
    const { id: questionId } = await context.params;
    const data: IQuestionRequest = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/questions.json`).then(
      (res) => res.json()
    );


    const question = data.questions.find(
      (question: IQuestion) => question.id === questionId
    );

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load game question" },
      { status: 500 }
    );
  }
}
