import { Link } from "react-router-dom";

import { searchConfig } from "../../config/searchConfig";
import type { SearchHit } from "../../types/search";
import { getField } from "../../types/search";
import { getFieldImage, getFieldTitle } from "../../utils/fieldFormatter";
import FieldRenderer from "../FieldRenderer/FieldRenderer";
import styles from "./HitCard.module.css";

interface HitCardProps {
  hit: SearchHit;
}

function HitCard({ hit }: HitCardProps) {
  const title = getFieldTitle(hit, searchConfig.titleField);
  const imageUrl = getFieldImage(hit, searchConfig.imageField);

  return (
    <article className={styles.card} data-testid="hit-card">
      <Link className={styles.cardLink} to={`/detail/${hit.id}`}>
        {imageUrl && <img alt={title} className={styles.image} loading="lazy" src={imageUrl} />}
        <div className={styles.titleContent}>
          <h2 className={styles.title}>{title}</h2>
        </div>
      </Link>
      <div className={styles.fieldsContent}>
        {searchConfig.displayFields.map((field) => {
          const value = getField(hit, field.key);
          return (
            <div key={field.key} className={styles.field}>
              <div className={styles.fieldLabel}>{field.label}</div>
              <FieldRenderer
                attribute={field.key}
                contentClassName={styles.fieldValue}
                hit={hit}
                truncate={field.truncate}
                type={field.type}
                value={value}
              />
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default HitCard;
