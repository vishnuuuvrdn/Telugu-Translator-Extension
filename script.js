const btn = document.getElementById("translateBtn");
const input = document.getElementById("inputText");
const engOut = document.getElementById("englishMeaning");
const telOut = document.getElementById("teluguMeaning");

// Google Dictionary API (Unofficial but reliable)
async function fetchOxfordLikeMeaning(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const data = await response.json();

    if (!Array.isArray(data) || !data[0]?.meanings?.length)
      throw new Error("No definition found.");

    // Find the definition that fits "look quickly and furtively..." type
    const definitions = data[0].meanings
      .map(m => m.definitions.map(d => d.definition))
      .flat();

    // Choose the most human-action-related one if multiple
    const bestDef = definitions.find(d =>
      /look|see|view|watch|observe/.test(d.toLowerCase())
    ) || definitions[0];

    const partOfSpeech = data[0].meanings[0].partOfSpeech;
    const example = data[0].meanings[0].definitions[0].example
      ? `Example: “${data[0].meanings[0].definitions[0].example}”`
      : "";

    return `${partOfSpeech ? partOfSpeech + " — " : ""}${bestDef}\n${example}`;
  } catch (err) {
    return "Meaning not found. Try another word.";
  }
}

// Telugu translation (using Google Translate)
async function fetchTelugu(word) {
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=${encodeURIComponent(word)}`
    );
    const data = await res.json();
    return data[0][0][0];
  } catch {
    return "అనువాదం పొందడం సాధ్యం కాలేదు.";
  }
}

btn.addEventListener("click", async () => {
  const word = input.value.trim();
  if (!word) return;

  engOut.textContent = "Fetching meaning...";
  telOut.textContent = "అనువదించుచున్నాం...";
  engOut.classList.remove("show");
  telOut.classList.remove("show");

  const [english, telugu] = await Promise.all([
    fetchOxfordLikeMeaning(word),
    fetchTelugu(word)
  ]);

  engOut.textContent = english;
  telOut.textContent = telugu;

  setTimeout(() => {
    engOut.classList.add("show");
    telOut.classList.add("show");
  }, 150);
});
