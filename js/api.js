const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDZhZTNhNzI5OTNhOTI2NGQxNWQzNGEzNTdlYzhlZSIsInN1YiI6IjY0NzRhNDNmNWNkMTZlMDBkYzNlOWRjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3TEUDm0P7pa-OyHhIfV60sMS5UGuVcRl613Ht0hF68Q",
  },
};

export async function getMovies(category, lang = "en-US", page = 1) {
  let data = [];
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${category}?language=${lang}&page=${page}`,
      options
    );
    const resultJson = await response.json();
    data = resultJson.results;
  } catch (err) {
    console.error(err);
  }
  return data;
}

export async function searchMovie(query, lang = "en-US", page = 1) {
  let data = [];
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=${lang}&page=${page}`,
      options
    );
    const resultJson = await response.json();
    data = await resultJson.results;
  } catch (err) {
    console.error(err);
  }
  return data;
}
