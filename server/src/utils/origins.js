const splitOrigins = (value = '') =>
  value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

export const getAllowedOrigins = () => {
  const origins = new Set([
    ...splitOrigins(process.env.CLIENT_URL),
    ...splitOrigins(process.env.CLIENT_URLS)
  ]);

  return Array.from(origins);
};

export const isOriginAllowed = (origin) => {
  const allowedOrigins = getAllowedOrigins();

  if (!origin || allowedOrigins.length === 0) {
    return true;
  }

  return allowedOrigins.includes(origin);
};
