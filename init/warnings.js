module.exports = () => {
  if (!process.env.DB_USER)
    throw new Error('Please provide DB_USER environment variable');
  if (!process.env.DB_PASS)
    throw new Error('Please provide DB_PASS environment variable');
  if (!process.env.DB_HOST)
    throw new Error('Please provide DB_HOST environment variable');
  if (!process.env.DB_NAME)
    throw new Error('Please provide DB_NAME environment variable');
  if (!process.env.TOKEN_SECRET)
    throw new Error('Please provide TOKEN_SECRET environment variable');
  if (!process.env.COOKIE_SECRET)
    throw new Error('Please provide COOKIE_SECRET environment variable');
};
