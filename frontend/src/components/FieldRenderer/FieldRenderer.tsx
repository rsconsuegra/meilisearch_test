import clsx from "clsx";
import { Highlight, Snippet } from "react-instantsearch";

import { formatFieldValue } from "../../utils/fieldFormatter";
import sharedStyles from "./FieldRenderer.module.css";

type InstantSearchHit = Parameters<typeof Highlight>[0]["hit"];

interface FieldRendererProps {
  attribute: string;
  badgesClassName?: string | undefined;
  badgeClassName?: string | undefined;
  contentClassName?: string | undefined;
  hit?: Record<string, unknown> | undefined;
  truncate?: number | undefined;
  type?: "text" | "badge" | "date" | undefined;
  value: unknown;
}

function hasHighlightResult(hit: Record<string, unknown> | undefined, attribute: string): boolean {
  if (!hit) return false;
  const hr = hit["_highlightResult"] as Record<string, unknown> | undefined;
  if (!hr) return false;
  return attribute in hr;
}

function hasSnippetResult(hit: Record<string, unknown> | undefined, attribute: string): boolean {
  if (!hit) return false;
  const sr = hit["_snippetResult"] as Record<string, unknown> | undefined;
  if (!sr) return false;
  return attribute in sr;
}

function asSearchHit(hit: Record<string, unknown>): InstantSearchHit {
  return hit as InstantSearchHit;
}

function FieldRenderer({
  attribute,
  badgesClassName,
  badgeClassName,
  contentClassName,
  hit,
  truncate,
  type,
  value,
}: FieldRendererProps) {
  if (type === "date") {
    return (
      <div className={clsx(sharedStyles.content, contentClassName)}>
        {formatFieldValue(value, type, truncate)}
      </div>
    );
  }

  if (type === "badge" && Array.isArray(value)) {
    if (hasHighlightResult(hit, attribute) && hit) {
      const isHit = asSearchHit(hit);
      return (
        <div className={clsx(sharedStyles.badges, badgesClassName)}>
          {value.map((item, index) => (
            <span key={String(item)} className={clsx(sharedStyles.badge, badgeClassName)}>
              <Highlight
                attribute={[attribute, index.toString()]}
                hit={isHit}
                highlightedTagName="span"
                nonHighlightedTagName="span"
              />
            </span>
          ))}
        </div>
      );
    }

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

  if (truncate !== undefined && hasSnippetResult(hit, attribute) && hit) {
    return (
      <div className={clsx(sharedStyles.content, contentClassName)}>
        <Snippet attribute={attribute} hit={asSearchHit(hit)} />
      </div>
    );
  }

  if (hasHighlightResult(hit, attribute) && hit) {
    return (
      <div className={clsx(sharedStyles.content, contentClassName)}>
        <Highlight attribute={attribute} hit={asSearchHit(hit)} />
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
