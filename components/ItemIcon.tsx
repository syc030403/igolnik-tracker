"use client";

import Image from "next/image";
import { useState } from "react";
import { SHOW_ITEM_ICONS } from "@/lib/flags";
import styles from "./ItemIcon.module.css";

/**
 * 아이템 아이콘. assets.tarkov.dev CDN에서 직접 로드하고,
 * 로드 실패(레이트리밋·404 등) 시 깨진 이미지 대신 약칭 텍스트로 폴백한다.
 */
export default function ItemIcon({
  src,
  alt,
  short,
}: {
  src: string | null;
  alt: string;
  short: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImg = SHOW_ITEM_ICONS && src && !failed;

  return (
    <div className={styles.icon}>
      {showImg ? (
        <Image
          src={src}
          alt={alt}
          width={46}
          height={46}
          unoptimized
          loading="lazy"
          style={{ objectFit: "contain" }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={styles.fallback}>{short.slice(0, 5)}</span>
      )}
    </div>
  );
}
