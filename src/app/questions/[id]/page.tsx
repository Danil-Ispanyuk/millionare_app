import { QuizLevel } from "@/components";

export default async function QuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const questionId = (await params).id;

  return <QuizLevel questionId={questionId} />;
}
