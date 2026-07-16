import type { PageGuide } from "@/lib/i18n/guides";
import styles from "./GuideSection.module.css";

/**
 * 페이지 하단 가이드/FAQ. 서버 컴포넌트 — 크롤러에 항상 보이는 시맨틱 텍스트.
 */
export default function GuideSection({ guide }: { guide: PageGuide }) {
  return (
    <section className={styles.guide} aria-label={guide.title}>
      <h2 className={styles.title}>{guide.title}</h2>
      {guide.sections.map((s) => (
        <div key={s.heading} className={styles.block}>
          <h3 className={styles.heading}>{s.heading}</h3>
          {s.body.map((p, i) => (
            <p key={i} className={styles.body}>
              {p}
            </p>
          ))}
        </div>
      ))}
    </section>
  );
}
