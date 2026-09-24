import React from 'react';

/**
 * A deliberately small markdown renderer for dispatch bodies: headings,
 * paragraphs, lists, quotes, bold/italic/code and links. It builds React
 * elements (never `dangerouslySetInnerHTML`), so a dispatch can only ever
 * produce the shapes listed here.
 */

type Block =
  | { kind: 'heading'; level: 2 | 3; text: string }
  | { kind: 'paragraph'; lines: string[] }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'quote'; lines: string[] };

function parseBlocks(markdown: string): Block[] {
  const blocks: Block[] = [];
  const lines = markdown.split(/\r?\n/);
  let paragraph: string[] = [];
  let quote: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flush = () => {
    if (paragraph.length) {
      blocks.push({ kind: 'paragraph', lines: paragraph });
      paragraph = [];
    }
    if (quote.length) {
      blocks.push({ kind: 'quote', lines: quote });
      quote = [];
    }
    if (list && list.items.length) {
      blocks.push({ kind: 'list', ordered: list.ordered, items: list.items });
    }
    list = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      flush();
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      blocks.push({
        kind: 'heading',
        level: heading[1].length <= 2 ? 2 : 3,
        text: heading[2].trim(),
      });
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (bullet || numbered) {
      if (quote.length) flush();
      const ordered = Boolean(numbered);
      if (!list || list.ordered !== ordered) {
        flush();
        list = { ordered, items: [] };
      }
      list.items.push((bullet?.[1] ?? numbered?.[1] ?? '').trim());
      continue;
    }

    const quoted = /^>\s?(.*)$/.exec(line);
    if (quoted) {
      if (paragraph.length) flush();
      quote.push(quoted[1].trim());
      continue;
    }

    if (quote.length || list) flush();
    paragraph.push(line.trim());
  }

  flush();
  return blocks;
}

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(INLINE).filter(Boolean).map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    const bold = /^\*\*([^*]+)\*\*$/.exec(part);
    if (bold) return <strong key={key}>{bold[1]}</strong>;

    const italic = /^\*([^*]+)\*$/.exec(part);
    if (italic) return <em key={key}>{italic[1]}</em>;

    const code = /^`([^`]+)`$/.exec(part);
    if (code) return <code key={key}>{code[1]}</code>;

    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      // Only real http(s) destinations become links; anything else stays text.
      return /^https?:\/\//.test(href) ? (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      ) : (
        <React.Fragment key={key}>{label}</React.Fragment>
      );
    }

    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

export const DispatchBody: React.FC<{ body: string }> = ({ body }) => (
  <div className="dispatch-body">
    {parseBlocks(body).map((block, index) => {
      const key = `block-${index}`;
      if (block.kind === 'heading') {
        return block.level === 2 ? (
          <h2 key={key}>{renderInline(block.text, key)}</h2>
        ) : (
          <h3 key={key}>{renderInline(block.text, key)}</h3>
        );
      }
      if (block.kind === 'list') {
        const items = block.items.map((item, itemIndex) => (
          <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
        ));
        return block.ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>;
      }
      if (block.kind === 'quote') {
        return <blockquote key={key}>{renderInline(block.lines.join(' '), key)}</blockquote>;
      }
      return <p key={key}>{renderInline(block.lines.join(' '), key)}</p>;
    })}
  </div>
);
