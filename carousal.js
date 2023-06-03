const buttons = document.querySelectorAll("[data-carousel-button]");
const dots = document.querySelectorAll(".dot");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const offset = button.dataset.carouselButton === "next" ? 1 : -1;
    const slides = button.closest("[data-carousel]").querySelector("[data-slides]");
    const activeSlide = slides.querySelector("[data-active]");
    let newIndex = [...slides.children].indexOf(activeSlide) + offset;
    if (newIndex < 0) newIndex = slides.children.length - 1;
    if (newIndex >= slides.children.length) newIndex = 0;
    slides.children[newIndex].dataset.active = true;
    delete activeSlide.dataset.active;
    updateActiveDot(newIndex);
  });
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    const slides = dot.closest("[data-carousel]").querySelector("[data-slides]");
    const activeSlide = slides.querySelector("[data-active]");
    slides.children[index].dataset.active = true;
    delete activeSlide.dataset.active;
    updateActiveDot(index);
  });
});

function updateActiveDot(index) {
  const activeDot = document.querySelector(".dot.active");
  activeDot.classList.remove("active");
  dots[index].classList.add("active");
}
