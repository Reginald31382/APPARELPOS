const required = [
  "MONGO_URI",
  "JWT_SECRET",
  "STRIPE_SECRET_KEY",
  "BREVO_API_KEY",
];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} is missing.`);
  }
});
