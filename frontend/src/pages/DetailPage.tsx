import clsx from "clsx";
import { type SyntheticEvent, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

import FieldRenderer from "../components/FieldRenderer/FieldRenderer";
import { searchConfig } from "../config/searchConfig";
import { getField } from "../types/search";
import { formatFieldValue, getFieldImage, getFieldTitle } from "../utils/fieldFormatter";
import { detailLoader } from "./detail/loader";
import styles from "./DetailPage.module.css";

type DetailLoaderData = Awaited<ReturnType<typeof detailLoader>>;

function DetailPage() {
  const doc = useLoaderData<DetailLoaderData>();
  const navigate = useNavigate();

  const title = getFieldTitle(doc, searchConfig.titleField);
  const imageUrl = getFieldImage(doc, searchConfig.imageField);

  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setOrientation(naturalHeight >= naturalWidth ? "portrait" : "landscape");
  };

  const container = searchConfig.imageContainers[orientation];

  const configuredKeys = new Set([
    searchConfig.titleField,
    searchConfig.imageField,
    ...searchConfig.displayFields.map((f) => f.key),
  ]);
  const extraFields = Object.entries(doc).filter(([key]) => !configuredKeys.has(key));

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)} type="button">
        ← Back to results
      </button>
      {imageUrl && (
        <div
          className={clsx(
            styles.heroImageWrapper,
            orientation === "portrait"
              ? styles.heroImageWrapperPortrait
              : styles.heroImageWrapperLandscape,
          )}
        >
          <img
            alt={title}
            className={styles.heroImage}
            src={imageUrl}
            style={{ maxWidth: container.maxWidth, maxHeight: container.maxHeight }}
            onLoad={handleImageLoad}
          />
        </div>
      )}
      <h1 className={styles.title}>{title}</h1>

      {searchConfig.displayFields.map((field) => {
        const value = getField(doc, field.key);
        return (
          <section key={field.key} className={styles.section}>
            <h2 className={styles.sectionHeading}>{field.label}</h2>
            <FieldRenderer
              value={value}
              type={field.type}
              contentClassName={styles.sectionContent}
            />
          </section>
        );
      })}

      {extraFields.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>More Info</h2>
          <dl className={styles.extraFields}>
            {extraFields.map(([key, value]) => (
              <div key={key}>
                <dt className={styles.dt}>{key}</dt>
                <dd className={styles.dd}>{formatFieldValue(value)}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}

export default DetailPage;
