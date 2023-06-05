const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function list() {
  return knex("movies").select("*");
}

function listIsShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .select("m.*")
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id");
}

function read(id) {
  return knex("movies").select("*").where({ movie_id: id }).first();
}

function listTheatersPlayingMovie(id) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .select("*")
    .where({
      "mt.is_showing": true,
      "mt.movie_id": id,
    });
}

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

function listReviewsByMovie(id) {
  return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
    .where({
      "r.movie_id": id,
    })

    .then((resp) => resp.map(addCritic));
}

module.exports = {
  list,
  listIsShowing,
  read,
  listTheatersPlayingMovie,
  listReviewsByMovie,
};