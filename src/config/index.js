const config = {
    APP_NAME: "haikoto",
    JWT_SECRET: process.env.JWT_SECRET || "000-12345-000",
    MONGODB_URI: process.env.MONGO_ATLAS_URI || "mongodb://localhost:27017/haikoto",
    BCRYPT_SALT: process.env.BCRYPT_SALT || 10,
    role: {
        USER: ["user", "admin"],
        ADMIN: ["admin"]
    },
    URL: {
        LANDING_URL: process.env.LANDING_URL || "http://localhost:3000",
        DASHBOARD_URL: process.env.DASHBOARD_URL || "http://localhost:3001"
    },
    mailer: {
        HOST: process.env.MAILER_HOST || "smtp.gmail.com",
        USER: process.env.MAILER_USER || "username@gmail.com",
        PASSWORD: process.env.MAILER_PASSWORD || "password",
        PORT: process.env.MAILER_PORT || 465,
        SECURE: process.env.MAILER_SECURE || true,
        DOMAIN: "@haikoto.com"
    },
    IMGBB: {
        BASE_URL: process.env.IMGBB_BASE_URL || "https://api.imgbb.com/1/upload",
        API_KEY: process.env.IMGBB_API_KEY || "9f71d9cff4efa4e7eda61275e33df975"
    }
};

module.exports = config;
