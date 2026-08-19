const ALLOWED_TAGS = new Set([
  "b",
  "strong",
  "i",
  "em",
  "u",
  "p",
  "br",
  "ul",
  "ol",
  "li",
]);

const DROP_WITH_CONTENT = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "svg",
  "math",
]);

export function sanitizeHtml(rawHtml: unknown): string {  // unknown type is used because we dont trust the input
  if (typeof rawHtml !== "string") {
    return "";
  }

  try {
    const parser = new DOMParser();
    const document = parser.parseFromString(rawHtml, "text/html");

    const cleanDocument = window.document.implementation.createHTMLDocument("");
    const cleanContainer = cleanDocument.createElement("div");

    document.body.childNodes.forEach((node) => {
      const cleanNodeResult = cleanNode(node, cleanDocument);

      if (cleanNodeResult) {
        cleanContainer.appendChild(cleanNodeResult);
      }
    });

    return cleanContainer.innerHTML;
  } catch {
    return "";
  }
}

function cleanNode(node: Node, document: Document): Node | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(node.textContent ?? "");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node as HTMLElement;
  const tagName = element.tagName.toLowerCase();

  if (DROP_WITH_CONTENT.has(tagName)) {
    return null;
  }

  if (!ALLOWED_TAGS.has(tagName)) {
    const fragment = document.createDocumentFragment();

    element.childNodes.forEach((child) => {
      const cleanChild = cleanNode(child, document);

      if (cleanChild) {
        fragment.appendChild(cleanChild);
      }
    });

    return fragment;
  }

  const cleanElement = document.createElement(tagName);

  element.childNodes.forEach((child) => {
    const cleanChild = cleanNode(child, document);

    if (cleanChild) {
      cleanElement.appendChild(cleanChild);
    }
  });

  return cleanElement;
}