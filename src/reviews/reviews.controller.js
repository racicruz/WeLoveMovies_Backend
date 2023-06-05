const service = require("./reviews.service");

async function update(req, res) {
  const time = new Date().toISOString();
  const reviewId = res.locals.review.review_id;
  const updatedReview = {
    ...req.body.data,
    review_id: reviewId,
  };
  await service.update(updatedReview);
  const rawData = await service.updateCritic(reviewId);
  const data = { ...rawData[0], created_at: time, updated_at: time };
  res.json({ data });
}

async function destroy(req, res) {
  const { review } = res.locals;
  await service.destroy(review.review_id);
  res.sendStatus(204);
}

async function reviewExists(req, res, next) {
  const review = await service.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

module.exports = {
  update: [reviewExists, update],
  delete: [reviewExists, destroy],
};