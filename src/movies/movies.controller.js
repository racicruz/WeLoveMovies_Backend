const service = require("./movies.service");

function list(req, res, next) {
  const { is_showing = false } = req.query;
  if (is_showing) {
    service
      .listIsShowing()
      .then((data) => res.json({ data }))
      .catch(next);
  } else {
    service
      .list()
      .then((data) => res.json({ data }))
      .catch(next);
  }
}

function read(req, res, next) {
  const movie = res.locals.movie;
  res.json({ data: movie });
}

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

async function listTheatersPlayingMovie(req, res, next) {
  const { movie_id } = res.locals.movie;
  const theaters = await service.listTheatersPlayingMovie(movie_id);
  res.json({ data: theaters });
}

async function listReviewsByMovie(req, res, next) {
  const { movie_id } = res.locals.movie;
  const reviews = await service.listReviewsByMovie(movie_id);
  res.json({ data: reviews });
}

module.exports = {
  list,
  read: [movieExists, read],
  listTheatersPlayingMovie: [movieExists, listTheatersPlayingMovie],
  listReviewsByMovie: [movieExists, listReviewsByMovie],
};