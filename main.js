// TODO: 주석 달기
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDZhZTNhNzI5OTNhOTI2NGQxNWQzNGEzNTdlYzhlZSIsInN1YiI6IjY0NzRhNDNmNWNkMTZlMDBkYzNlOWRjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3TEUDm0P7pa-OyHhIfV60sMS5UGuVcRl613Ht0hF68Q",
  },
};

const topRatedMoviesFectch = fetch(
  "https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1",
  options
)
  .then((response) => response.json())
  .then((data) => {
    const topRatedMovies = data.results;
    const movieWrapper = document.querySelector(".top-rated-list");

    topRatedMovies.forEach((movie) => {
      const id = movie.id;
      const title = movie.title;
      const posterURI = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
      const voteAverage = movie.vote_average;

      const movieLi = document.createElement("li");
      movieLi.classList.add("swiper-slide");
      movieLi.dataset.id = id;
      movieLi.innerHTML = `
                        <div class="poster-img" style="background: center / cover url('${posterURI}') no-repeat;" title="${title} 포스터 이미지"></div>
                        <div class="main-info">
                          <h3>${title}</h3>
                          <span>${voteAverage}</span>
                        </div>
                      `;
      movieWrapper.append(movieLi);
    });

    movieWrapper.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = e.target.closest("li").dataset.id;
      const targetMovie = topRatedMovies.filter(
        (movie) => movie.id === parseInt(targetId)
      );
      openModal(targetMovie);
    });

    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchInput = document.querySelector(".search-input");
      let searchText = searchInput.value;

      if (searchText.length <= 0) {
        alert("검색어를 입력해주세요");
        searchInput.focus();
      } else {
        const matchItem = topRatedMovies.filter(
          (topRatedMovie) =>
            topRatedMovie.title.toUpperCase() === searchText.toUpperCase()
        );
        if (!matchItem[0]) {
          alert("일치하는 영화가 없습니다.");
          searchInput.value = "";
          searchInput.focus();
          return;
        } else {
          openModal(matchItem);
        }
      }
    });
  })
  .catch((err) => console.error(err));

document.addEventListener("DOMContentLoaded", () => {
  closeModal();

  // swiper: top rated movies
  if (document.querySelector(".topRatedSwiper")) {
    let topRatedSwiper = new Swiper(".topRatedSwiper", {
      slidesPerView: 2,
      spaceBetween: 30,
      slidesPerGroup: 6,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        768: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        1300: {
          slidesPerView: 6,
          spaceBetween: 30,
        },
      },
    });
  }
});

function openModal(data) {
  const modalOverlay = document.querySelector(".modal-overlay");
  const modalImg = document.querySelector(".modal img");
  const modalTitle = document.querySelector(".modal-text h3");
  const modalRate = document.querySelector(".modal-text span");
  const modalOverview = document.querySelector(".modal-text p");
  const body = document.querySelector("body");

  modalImg.setAttribute(
    "src",
    `https://image.tmdb.org/t/p/original/${data[0].poster_path}`
  );
  modalImg.setAttribute("alt", `${data[0].title} 포스터`);
  modalTitle.textContent = data[0].title;
  modalRate.textContent = `ID ${data[0].id} | 평점 ${data[0].vote_average}`;
  modalOverview.textContent = data[0].overview || `요약 내용이 없습니다.`;
  modalOverlay.style.display = "block";
  body.classList.add("modal-active");
}

// 모달닫기
function closeModal() {
  document.querySelector(".btn-close-modal").addEventListener("click", () => {
    document.querySelector(".modal-overlay").style.display = "none";
    document.querySelector("body").classList.remove("modal-active");
  });
}
