import clsx from "clsx";

import { formatFieldValue } from "../../utils/fieldFormatter";
import sharedStyles from "./FieldRenderer.module.css";

interface FieldRendererProps {
  value: unknown;
  type?: string;
  truncate?: number;
  badgesClassName?: string;
  badgeClassName?: string;
  contentClassName?: string;
}

function FieldRenderer({
  value,
  type,
  truncate,
  badgesClassName,
  badgeClassName,
  contentClassName,
}: FieldRendererProps) {
  if (type === "badge" && Array.isArray(value)) {
    return (
      <div className={clsx(sharedStyles.badges, badgesClassName)}>
        {value.map((item) => (
          <span key={String(item)} className={clsx(sharedStyles.badge, badgeClassName)}>
            {String(item)}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={clsx(sharedStyles.content, contentClassName)}>
      {formatFieldValue(value, type, truncate)}
    </div>
  );
}

export default FieldRenderer;
