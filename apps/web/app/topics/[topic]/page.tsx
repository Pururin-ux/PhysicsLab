import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicLesson } from "../../../components/topics/TopicLesson";
import { getTaskLessonData } from "../../../lib/learning/topic-lesson-data";
import { topics } from "../../../lib/topics";

type TopicLessonPageProps = {
  params: Promise<{ topic: string }>;
};

function isTopicId(value: string): value is (typeof topics)[number]["id"] {
  return topics.some((topic) => topic.id === value);
}

export function generateStaticParams() {
  return topics.map((topic) => ({ topic: topic.id }));
}

export async function generateMetadata({ params }: TopicLessonPageProps): Promise<Metadata> {
  const { topic } = await params;

  if (!isTopicId(topic)) {
    return { title: "Тема не найдена | PhysicsLab" };
  }

  const data = getTaskLessonData(topic);

  return {
    title: `${data.topic.title} · урок | PhysicsLab`,
    description: data.lesson.tagline,
  };
}

export default async function TopicLessonPage({ params }: TopicLessonPageProps) {
  const { topic } = await params;

  if (!isTopicId(topic)) {
    notFound();
  }

  return <TopicLesson topicId={topic} />;
}
