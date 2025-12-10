document.addEventListener("DOMContentLoaded", () => {
  const range = document.getElementById("targetKB");
  const label = document.getElementById("targetLabel");
  const form = document.getElementById("compressForm");
  const btn = document.getElementById("compressBtn");
  const loader = document.getElementById("loader");
  const imageInput = document.getElementById("imageInput");
  const selectedPreview = document.getElementById("selectedPreview");

  if (range && label) {
    range.addEventListener("input", () => {
      label.innerText = `${range.value} KB`;
    });
  }

  if (imageInput) {
    imageInput.addEventListener("change", () => {
      const f = imageInput.files[0];
      if (f) {
        selectedPreview.innerText = `${f.name} — ${(f.size/1024).toFixed(2)} KB`;
      } else {
        selectedPreview.innerText = "";
      }
    });
  }

  if (form) {
    form.addEventListener("submit", () => {
      if (btn) {
        btn.disabled = true;
        btn.innerText = "Compressing...";
      }
      if (loader) loader.classList.remove("hidden");
    });
  }
});
