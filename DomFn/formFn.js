const modal = document.getElementById("folderModal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");

const uploadFileBtn = document.getElementById("uploadFileBtn");
const realFileInput = document.getElementById("realFileInput");
const uploadForm = document.getElementById("uploadForm");

openBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});
