const textInput = document.querySelector("#textInput");
const binaryInput = document.querySelector("#binaryInput");
const statusBox = document.querySelector("#decoderStatus");

function setStatus(message, type = "") {
  statusBox.textContent = message;
  statusBox.className = `decoder-status ${type}`.trim();
}

function textToBinary(text) {
  const bytes = new TextEncoder().encode(text);
  return Array.from(bytes)
    .map((byte) => byte.toString(2).padStart(8, "0"))
    .join(" ");
}

function binaryToText(binary) {
  const clean = binary.trim().replace(/\s+/g, " ");
  if (!clean) return "";

  const tokens = clean.split(" ");
  const invalid = tokens.find((token) => !/^[01]{8}$/.test(token));

  if (invalid) {
    throw new Error(`Byte invalido: ${invalid}. Usa grupos de 8 bits separados por espacios.`);
  }

  const bytes = Uint8Array.from(tokens.map((token) => Number.parseInt(token, 2)));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function encode() {
  binaryInput.value = textToBinary(textInput.value);
  setStatus("Texto convertido a binario UTF-8.", "good");
}

function decode() {
  try {
    textInput.value = binaryToText(binaryInput.value);
    setStatus("Binario decodificado a texto humano.", "good");
  } catch (error) {
    setStatus(error.message, "bad");
  }
}

async function copyValue(value, label) {
  if (!value) {
    setStatus(`No hay ${label} para copiar.`, "bad");
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    setStatus(`${label} copiado al portapapeles.`, "good");
  } catch {
    setStatus(`No pude copiar ${label}; selecciona y copia manualmente.`, "bad");
  }
}

document.querySelector("#encodeButton")?.addEventListener("click", encode);
document.querySelector("#decodeButton")?.addEventListener("click", decode);

document.querySelector("#copyBinary")?.addEventListener("click", () => {
  copyValue(binaryInput.value, "binario");
});

document.querySelector("#copyText")?.addEventListener("click", () => {
  copyValue(textInput.value, "texto");
});

document.querySelector("#sampleText")?.addEventListener("click", () => {
  textInput.value = "Quantum Maximus dice: Vox Veritas Vita. El codigo sirve a la verdad.";
  encode();
});

document.querySelector("#clearAll")?.addEventListener("click", () => {
  textInput.value = "";
  binaryInput.value = "";
  setStatus("Listo para traducir. Un byte debe tener 8 bits: solo 0 y 1.");
});

textInput?.addEventListener("input", () => {
  if (textInput.value.length > 0) encode();
});

binaryInput?.addEventListener("input", () => {
  if (binaryInput.value.trim().length === 0) {
    setStatus("Listo para traducir. Un byte debe tener 8 bits: solo 0 y 1.");
    return;
  }

  try {
    binaryToText(binaryInput.value);
    setStatus("Binario valido. Pulsa Binario a texto para decodificar.", "good");
  } catch (error) {
    setStatus(error.message, "bad");
  }
});

document.querySelector(".top-button")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

textInput.value = "Vox Veritas Vita";
encode();
