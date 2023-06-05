const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function update(updatedReview) {
  return knex("reviews as r")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

function updateCritic(reviewId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ review_id: reviewId })
    .then((data) => data.map(addCritic));
}

function destroy(id) {
  return knex("reviews").where({ review_id: id }).del();
}

function read(id) {
  return knex("reviews").select("*").where({ review_id: id }).first();
}

module.exports = {
  update,
  updateCritic,
  destroy,
  read,
};