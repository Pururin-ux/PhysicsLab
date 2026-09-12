import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const chapters = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/chapters" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    topic: z.string(),
    status: z.string(),
    authorReviewRequired: z.boolean(),
    description: z.string(),
    lead: z.string(),
    mainIdea: z.string(),
    nav: z.array(
      z.object({
        href: z.string(),
        label: z.string()
      })
    ),
    sections: z.object({
      lab: z.object({
        eyebrow: z.string(),
        title: z.string(),
        description: z.string()
      }),
      formula: z.object({
        eyebrow: z.string(),
        title: z.string(),
        description: z.string()
      }),
      mistake: z.object({
        eyebrow: z.string(),
        title: z.string(),
        body: z.array(z.string())
      }),
      summary: z.object({
        eyebrow: z.string(),
        title: z.string(),
        items: z.array(z.string())
      }),
      check: z.object({
        eyebrow: z.string(),
        question: z.string(),
        answers: z.array(
          z.object({
            id: z.string(),
            label: z.string()
          })
        ),
        feedback: z.object({
          initial: z.string(),
          correct: z.string(),
          wrong: z.string()
        })
      })
    })
  })
});

export const collections = { chapters };
