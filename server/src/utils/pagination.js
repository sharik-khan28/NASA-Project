function pagination(query) {
  const page = Math.abs(query.page);
  const limit = Math.abs(query.limit);
  const skip = (page - 1) * limit;
  return { skip, limit };
}

module.exports = { pagination };
