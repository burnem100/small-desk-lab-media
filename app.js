const form = document.querySelector(".measurement-card");
const status = document.querySelector("#form-status");
const storageKey = "small-desk-lab-desk-fit-v1";

function readValues() {
  return Object.fromEntries(
    [...form.elements]
      .filter((element) => element instanceof HTMLInputElement)
      .map((input) => [input.name, input.value]),
  );
}

function updateStatus(message) {
  status.textContent = message;
}

function saveValues() {
  const values = readValues();
  localStorage.setItem(storageKey, JSON.stringify(values));
  const completed = Object.values(values).filter(Boolean).length;
  updateStatus(completed ? `${completed} of 8 fields recorded locally` : "Ready to measure");
}

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
  for (const input of form.querySelectorAll("input")) {
    if (typeof saved[input.name] === "string") input.value = saved[input.name];
  }
  saveValues();
} catch {
  localStorage.removeItem(storageKey);
}

form.addEventListener("input", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  if (input.value && Number(input.value) < 0) {
    input.setCustomValidity("Use zero or a positive measurement.");
    updateStatus(`${input.labels?.[0]?.textContent?.trim() || "Measurement"} cannot be negative`);
  } else {
    input.setCustomValidity("");
    saveValues();
  }
});

form.addEventListener("reset", () => {
  localStorage.removeItem(storageKey);
  requestAnimationFrame(() => updateStatus("Measurements cleared from this device"));
});

document.querySelector("#print-card").addEventListener("click", () => {
  if (!form.reportValidity()) return;
  updateStatus("Opening the print or PDF dialog");
  window.print();
});
