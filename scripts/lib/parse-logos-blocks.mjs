// Converts a Logos Sermons "sermonEditor" rich-text document (an array of
// blocks, each with a `kind` like "normal"/"heading1"/"bullet" and a
// `content` array of styled text runs) into simple HTML.

const HEADING_TAGS = {
  heading1: "h1",
  heading2: "h2",
  heading3: "h3",
  heading4: "h4",
  heading5: "h5",
};

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderRuns(content) {
  if (!Array.isArray(content)) return "";
  return content
    .map((run) => {
      let text = escapeHtml(run.text ?? "");
      if (!text) return "";
      if (run.bold) text = `<strong>${text}</strong>`;
      if (run.italic) text = `<em>${text}</em>`;
      if (run.underline) text = `<u>${text}</u>`;
      return text;
    })
    .join("");
}

export function blocksToHtml(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return "";

  const html = [];
  let listTag = null; // "ul" | "ol" | null, tracks an open list

  function closeList() {
    if (listTag) {
      html.push(`</${listTag}>`);
      listTag = null;
    }
  }

  for (const block of blocks) {
    const text = renderRuns(block.content);
    if (!text.trim()) continue;

    if (block.kind === "bullet" || block.kind === "number") {
      const wantTag = block.kind === "bullet" ? "ul" : "ol";
      if (listTag !== wantTag) {
        closeList();
        html.push(`<${wantTag}>`);
        listTag = wantTag;
      }
      html.push(`<li>${text}</li>`);
      continue;
    }

    closeList();

    if (HEADING_TAGS[block.kind]) {
      html.push(`<${HEADING_TAGS[block.kind]}>${text}</${HEADING_TAGS[block.kind]}>`);
    } else if (block.kind === "blockquote") {
      html.push(`<blockquote>${text}</blockquote>`);
    } else {
      html.push(`<p>${text}</p>`);
    }
  }

  closeList();
  return html.join("\n");
}

export function blocksToPlainText(blocks) {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block) =>
      (block.content ?? []).map((run) => run.text ?? "").join("")
    )
    .filter((line) => line.trim())
    .join("\n\n");
}
