const menuBars = document.querySelector(".menu-bars");
const header = document.querySelector("header");
const menuItems = document.querySelectorAll(".menu__item");
const circlesWrapper = document.querySelectorAll(".circles");
const search = document.querySelectorAll(".menu__icon--search");

menuBars.addEventListener("click", () => {
  header.classList.toggle("change");
});

// menuItems.forEach((menuItem) => {
//   menuItem.addEventListener("click", () => {
//     menuItems.forEach((menuItem) => {
//       menuItem.classList.remove("active");
//     });

//     menuItem.classList.add("active");
//   });
// });

document.querySelectorAll(".menu__item").forEach((el) => {
  el.addEventListener("click", (e) => {
    if (!e.target.closest(".menu__item--search")) return;
    console.log(e.target);
    e.currentTarget.classList.add("active");
    console.log(e.currentTarget);
  });
});

document.addEventListener("click", (e) => {
  console.log("działa");
  if (!e.target.closest(".menu__form")) return;
  console.log(
    document.querySelector(".menu__item--search").classList.contains("active")
  );
  document.querySelector(".menu__item").classList.remove("active");
});

circlesWrapper.forEach((circles) => {
  const circle = Array.from(circles.children);

  circle.forEach((circleItem) => {
    circleItem.addEventListener("click", () => {
      circle.forEach((circleItem) => {
        circleItem.classList.remove("active");
      });
      circleItem.classList.add("active");
    });
  });
});

// search.forEach((searchItem) => {
//   searchItem.addEventListener("click", () => {
//     searchItem.parentElement.classList.add("active");
//   });
// });

document.addEventListener("keydown", (e) => {
  console.log(e);
  if (e.key === "Escape") {
    // search.forEach((searchItem) => {
    //   searchItem.parentElement.classList?.remove("active");
    // });
  }
});
