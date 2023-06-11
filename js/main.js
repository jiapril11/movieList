import { getMovies, searchMovie } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".search-input").focus();

  // 영화 분류별 셋팅
  loadMoives("top_rated", ".top-rated-list", lang);
  loadMoives("popular", ".popular-list", lang);
  loadMoives("now_playing", ".now-playing-list", lang);
  loadMoives("upcoming", ".upcoming-list", lang);

  // swiper: 영화 분류별 셋팅
  if (document.querySelector(".searchedMovieSwiper")) {
    let searchedMovieSwiper = new Swiper(
      ".searchedMovieSwiper",
      mainSwiperSetting
    );
  }
  if (document.querySelector(".topRatedSwiper")) {
    let topRatedSwiper = new Swiper(".topRatedSwiper", mainSwiperSetting);
  }
  if (document.querySelector(".popularSwiper")) {
    let popularSwiper = new Swiper(".popularSwiper", mainSwiperSetting);
  }
  if (document.querySelector(".nowPlayingSwiper")) {
    let nowPlayingSwiper = new Swiper(".nowPlayingSwiper", mainSwiperSetting);
  }
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
    title.textContent = `SEARCH RESULTS: ${searchText}(${searchedMovies.length})`;

    if (searchText.length <= 0) {
      alert("검색어를 입력해주세요.");
      searchInput.focus();
      return;
    } else {
      if (searchedMovies.length) {
        searchedMovieSection.style.display = "block";
        listingMovies(".searched-movie-list", searchedMovies);
        openModalMovie(".searched-movie-list", searchedMovies);
      } else {
        alert("검색된 영화가 없습니다.");
      }
    }
  } catch (err) {
    console.error(err);
  }
});

// 영화 API 언어 변경
let lang = "ko-KR";
const langBtn = document.querySelector(".lang-btn");
langBtn.addEventListener("click", () => {
  if (lang === "en-US") {
    lang = "ko-KR";
    langBtn.innerText = "EN";
    loadMoives("top_rated", ".top-rated-list", lang);
    loadMoives("popular", ".popular-list", lang);
    loadMoives("now_playing", ".now-playing-list", lang);
    loadMoives("upcoming", ".upcoming-list", lang);
  } else {
    lang = "en-US";
    langBtn.innerText = "KO";
    loadMoives("top_rated", ".top-rated-list", lang);
    loadMoives("popular", ".popular-list", lang);
    loadMoives("now_playing", ".now-playing-list", lang);
    loadMoives("upcoming", ".upcoming-list", lang);
  }
});

// api result 가져와서 리스팅/모달 함수 적용
async function loadMoives(category, wrapper, lang) {
  const movieResult = await getMovies(category, lang);
  listingMovies(wrapper, movieResult);
  openModalMovie(wrapper, movieResult);
}

// 영화 리스팅
function listingMovies(wrapperClass, movieArr) {
  const movieWrapper = document.querySelector(wrapperClass);
  movieWrapper.replaceChildren();

  movieArr.forEach((movie) => {
    const id = movie.id;
    const title = movie.title;
    const posterURI = movie.poster_path
      ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
      : `./imgs/no_img.png`;
    const voteAverage = movie.vote_average;

    const movieLi = document.createElement("li");
    movieLi.classList.add("swiper-slide");
    movieLi.dataset.id = id;
    movieLi.innerHTML = `
                          <div class="poster-img" style="background: center / cover url('${posterURI}') no-repeat;" title="${title} 포스터"></div>
                          <div class="main-info">
                            <h3>${title}</h3>
                            <p title="평점"><i class="fa-solid fa-star"></i> <span>${voteAverage}</span></p>
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
  const modalTextBox = document.querySelector(".modal-text");
  const modalTitle = document.querySelector(".modal-text h3");
  const modalRate = document.querySelector(".modal-text span");
  const modalOverview = document.querySelector(".modal-text p");
  const body = document.querySelector("body");

  if (data[0].poster_path) {
    modalImg.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/original/${data[0].poster_path}`
    );
    modalImg.setAttribute("alt", `${data[0].title} 포스터`);
  } else {
    modalImg.setAttribute("src", `./imgs/no_img.png`);
    modalImg.setAttribute("alt", `${data[0].title} 대체 이미지`);
  }
  modalTitle.textContent = data[0].title;
  modalRate.textContent = `ID ${data[0].id} | 평점 ${data[0].vote_average}`;
  modalOverview.textContent = data[0].overview || `요약 내용이 없습니다.`;
  modalOverlay.style.display = "block";
  modalTextBox.style.height = `${modalImg.clientHeight}px`;
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
