import { getMovies, searchMovie } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  // swiper: top rated movies
  if (document.querySelector(".searchedMovieSwiper")) {
    let searchedMovieSwiper = new Swiper(
      ".searchedMovieSwiper",
      mainSwiperSetting
    );
  }

  // swiper: top rated movies
  if (document.querySelector(".topRatedSwiper")) {
    let topRatedSwiper = new Swiper(".topRatedSwiper", mainSwiperSetting);
  }

  // swiper: poplur movies
  if (document.querySelector(".popularSwiper")) {
    let popularSwiper = new Swiper(".popularSwiper", mainSwiperSetting);
  }

  // swiper: now playing movies
  if (document.querySelector(".nowPlayingSwiper")) {
    let nowPlayingSwiper = new Swiper(".nowPlayingSwiper", mainSwiperSetting);
  }

  // swiper: upcoming movies
  if (document.querySelector(".upcomingSwiper")) {
    let upComingSwiper = new Swiper(".upcomingSwiper", mainSwiperSetting);
  }
});

// 메인 스와이퍼 공통 옵션
const mainSwiperSetting = {
  slidesPerView: 2,
  spaceBetween: 30,
  slidesPerGroup: 2,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    768: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 20,
    },
    1300: {
      slidesPerView: 6,
      slidesPerGroup: 6,
      spaceBetween: 30,
    },
  },
};

// 검색 기능
searchForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const searchedMovieSection = document.querySelector(".searchedMovieSwiper");
    const searchInput = document.querySelector(".search-input");
    const searchText = searchInput.value;
    const searchedMovies = await searchMovie(searchText, "ko-KR");
    const title = document.querySelector(".searchedMovieSwiper h2");
    title.textContent = `SEARCH RESULTS: ${searchText}`;

    if (searchText.length <= 0) {
      alert("검색어를 입력해주세요.");
      searchInput.focus();
      return;
    }
    searchedMovieSection.style.display = "block";
    listingMovies(".searched-movie-list", searchedMovies);
    openModalMovie(".searched-movie-list", searchedMovies);
  } catch (err) {
    console.error(err);
  }
});

// 영화 분류별 셋팅
// top rated
const topRatedMovies = await getMovies("top_rated", "ko-KR");
listingMovies(".top-rated-list", topRatedMovies);
openModalMovie(".top-rated-list", topRatedMovies);
// popular
const popularMovies = await getMovies("popular", "ko-KR");
listingMovies(".popular-list", popularMovies);
openModalMovie(".popular-list", popularMovies);
// now-playing
const nowPlayingMovies = await getMovies("now_playing", "ko-KR");
listingMovies(".now-playing-list", nowPlayingMovies);
openModalMovie(".now-playing-list", nowPlayingMovies);
// upcoming
const upcomingMovies = await getMovies("upcoming", "ko-KR");
listingMovies(".upcoming-list", upcomingMovies);
openModalMovie(".upcoming-list", upcomingMovies);

// 영화 리스팅
function listingMovies(wrapperClass, movieArr) {
  const movieWrapper = document.querySelector(wrapperClass);
  movieWrapper.replaceChildren();

  movieArr.forEach((movie) => {
    const id = movie.id;
    const title = movie.title;
    const posterURI = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
    const voteAverage = movie.vote_average;

    const movieLi = document.createElement("li");
    movieLi.classList.add("swiper-slide");
    movieLi.dataset.id = id;
    movieLi.innerHTML = `
                          <div class="poster-img" style="background: center / cover url('${posterURI}') no-repeat;" title="${title} 포스터"></div>
                          <div class="main-info">
                            <h3>${title}</h3>
                            <span>${voteAverage}</span>
                          </div>
                        `;
    movieWrapper.append(movieLi);
  });
}

// 영화 클릭시 데이터 필터, 모달 오픈
function openModalMovie(wrapperClass, movieArr) {
  const movieWrapper = document.querySelector(wrapperClass);

  movieWrapper.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = e.target.closest("li").dataset.id;
    const targetMovie = movieArr.filter(
      (movie) => movie.id === parseInt(targetId)
    );
    openModal(targetMovie);
  });
}

// 모달오픈
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

  closeModal();
}

// 모달닫기
function closeModal() {
  document.querySelector(".btn-close-modal").addEventListener("click", () => {
    document.querySelector(".modal-overlay").style.display = "none";
    document.querySelector("body").classList.remove("modal-active");
  });
}
