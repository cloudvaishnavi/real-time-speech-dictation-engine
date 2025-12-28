export function cleanText(rawText, tone = "neutral") {
  if (typeof rawText !== "string" || rawText.trim() === "") return "";

  let text = rawText.trim();

  /* ==================================================
     LEVEL 1 — Noise Cleanup
  ================================================== */

  const fillerWords = [
    "um", "uh", "like", "you know", "i mean",
    "basically", "literally", "actually",
    "kinda", "sort of", "okay so", "so yeah"
  ];

  fillerWords.forEach(filler => {
    text = text.replace(new RegExp(`\\b${filler}\\b`, "gi"), " ");
  });

  // Remove stuttering
  text = text.replace(/\b(\w+)\b(\s+\1\b)+/gi, "$1");

  // Normalize spaces
  text = text.replace(/\s+/g, " ").trim();

  /* ==================================================
     LEVEL 2 — Sentence Structuring
  ================================================== */

  let sentences = text.match(/[^.!?]+/g) || [];

  sentences = sentences.map(s => {
    s = s.trim();
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  });

  text = sentences.join(". ");

  // Fix lowercase i
  text = text.replace(/\bi\b/g, "I");

  /* ==================================================
     LEVEL 2 — Clarity Detection (AI-like heuristic)
  ================================================== */

  const weakPhrases = [
    "I think",
    "maybe",
    "kind of",
    "sort of",
    "it was okay",
    "not bad"
  ];

  let clarityScore = 100;
  weakPhrases.forEach(p => {
    if (new RegExp(`\\b${p}\\b`, "i").test(text)) {
      clarityScore -= 10;
    }
  });

  /* ==================================================
     LEVEL 2 — Meaning Rewrite (KEY FIX)
     Neutral MUST improve clarity
  ================================================== */

  if (clarityScore <= 85) {
    text = text
      .replace(/\bI think\b/gi, "It appears that")
      .replace(/\bmaybe\b/gi, "possibly")
      .replace(/\bit was okay\b/gi, "the experience was acceptable")
      .replace(/\bnot bad\b/gi, "reasonably good");
  }

  /* ==================================================
     LEVEL 2 — Grammar Stability
  ================================================== */

  text = text
    .replace(/\bthey is\b/gi, "they are")
    .replace(/\bhe are\b/gi, "he is")
    .replace(/\bshe are\b/gi, "she is");

  text = text
    .replace(/\ba ([aeiou])/gi, "an $1")
    .replace(/\ban ([^aeiou])/gi, "a $1");

  /* ==================================================
     LEVEL 2 — Connector Normalization
  ================================================== */

  text = text
    .replace(/\bbut\b/gi, ". However,")
    .replace(/\bso\b/gi, "therefore");

  /* ==================================================
     LEVEL 2 — Tone Control (FIXED)
  ================================================== */

  // FORMAL
  if (tone === "formal") {
    text = text.replace(/\bpossibly\b/gi, "perhaps");
  }

  // CONCISE (short but meaningful)
  if (tone === "short") {
    text = text
      .replace(/\bIt appears that\b/gi, "")
      .replace(/\bpossibly\b/gi, "")
      .replace(/\bHowever,\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // FRIENDLY
  if (tone === "friendly") {
    text = "Hey! " + text;
  }

  // EXPANDED (NEW — clarity explanation)
  if (tone === "expanded") {
    text = text.replace(
      /\.$/,
      ". This suggests that the situation may require more consideration before taking action."
    );
  }

  /* ==================================================
     FINAL — Punctuation (ONCE, GUARANTEED)
  ================================================== */

  text = text
    .split(".")
    .map(s => s.trim())
    .filter(Boolean)
    .join(". ");

  if (!/[.!?]$/.test(text)) {
    text += ".";
  }

  if (tone === "friendly") {
    text = text.replace(/\.$/, "!");
  }

  return text.trim();
}