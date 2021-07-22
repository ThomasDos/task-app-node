module.exports = (dateToCompare) => {
  const dateNow = new Date();
  const date = new Date(dateToCompare);
  return Math.ceil(
    (dateNow.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
};
