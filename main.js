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
      const overview = movie.overview;
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
                        <p>${overview}</p>
                      `;
      movieWrapper.append(movieLi);
    });

    movieWrapper.addEventListener("click", (e) => {
      alert(`id: ${e.target.closest("li").dataset.id}`);
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
          (topRatedMovie) => topRatedMovie.title === searchText
        );
        searchInput.value = "";

        if (!matchItem[0]) {
          alert("일치하는 영화가 없습니다.");
          searchInput.focus();
          return;
        }
        return console.log(matchItem[0]);
      }
    });
  })
  .catch((err) => console.error(err));

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".topRatedSwiper")) {
    var topRatedSwiper = new Swiper(".topRatedSwiper", {
      slidesPerView: 6,
      spaceBetween: 30,
      slidesPerGroup: 6,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }
});
