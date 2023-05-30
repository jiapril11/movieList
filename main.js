const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDZhZTNhNzI5OTNhOTI2NGQxNWQzNGEzNTdlYzhlZSIsInN1YiI6IjY0NzRhNDNmNWNkMTZlMDBkYzNlOWRjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3TEUDm0P7pa-OyHhIfV60sMS5UGuVcRl613Ht0hF68Q",
  },
};

fetch(
  "https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1",
  options
)
  .then((response) => response.json())
  .then((data) => {
    const topRatedMovies = data.results;
    const movieWrapper = document.querySelector(".top-rated-list");

    topRatedMovies.forEach((movie) => {
      console.log(movie);
      const id = movie.id;
      const title = movie.title;
      const overview = movie.overview;
      const posterURI = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
      const voteAverage = movie.vote_average;

      const movieLi = document.createElement("li");
      movieLi.dataset.id = id;
      movieLi.innerHTML = `
                        <img src="${posterURI}" alt="${title} 포스터 이미지">
                        <h3>${title}</h3>
                        <span>${voteAverage}</span>
                        <p>${overview}</p>
                      `;
      movieWrapper.append(movieLi);
    });

    movieWrapper.addEventListener("click", (e) => {
      alert(`id: ${e.target.closest("li").dataset.id}`);
    });
  })
  .catch((err) => console.error(err));
