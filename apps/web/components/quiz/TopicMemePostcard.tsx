import Image from "next/image";
import styles from "./TopicMemePostcard.module.css";

type SummaryVariant = "diagnostic" | "exam";

type TopicMeme = {
  id: "kinematics" | "dynamics" | "electro" | "thermo" | "optics";
  src: string;
  caption: string;
};

const memeByTopic: Record<string, TopicMeme> = {
  "Кинематика": {
    id: "kinematics",
    src: "/art/production/meme-kinematics-jet-cat.webp",
    caption: "Кот уже набрал скорость.",
  },
  "Динамика": {
    id: "dynamics",
    src: "/art/production/meme-dynamics-sisyphus-cat.webp",
    caption: "Сила есть. Камень тоже.",
  },
  "Электродинамика": {
    id: "electro",
    src: "/art/production/meme-electro-lightning-cat.webp",
    caption: "Контакт установлен.",
  },
  "Термодинамика": {
    id: "thermo",
    src: "/art/production/meme-thermo-explosion-cat.webp",
    caption: "Тепловой эффект получился убедительным.",
  },
  "Оптика": {
    id: "optics",
    src: "/art/production/meme-optics-star-cat.webp",
    caption: "Свет пойман.",
  },
};

export function hasTopicMeme(topic?: string, variant?: SummaryVariant) {
  return !variant && Boolean(topic && memeByTopic[topic]);
}

export function TopicMemePostcard({
  topic,
  variant,
}: {
  topic?: string;
  variant?: SummaryVariant;
}) {
  const meme = !variant && topic ? memeByTopic[topic] : undefined;

  if (!meme) return null;

  return (
    <figure className={styles.postcard} data-meme-id={meme.id}>
      <div className={styles.imageFrame} aria-hidden="true">
        <Image
          src={meme.src}
          alt=""
          fill
          sizes="132px"
          className={styles.image}
        />
      </div>
      <figcaption>{meme.caption}</figcaption>
    </figure>
  );
}
