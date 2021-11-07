require("express-async-errors");
const app = require("express")();

// Pre-route middlewares
require("./middlewares/pre-route.middleware")(app);

// API routes
app.use("/api", require("./routes"));

// Ping route for testing connection
app.get("/ping", (req, res) => {
  return res.status(200).json({ message: "Hello world from Haikoto Backend!" });
});

// Error middlewares
require("./middlewares/error.middleware")(app);

const PORT = process.env.PORT || 4000;

// Listen to server port
app.listen(PORT, async () => {
  // Initialize MongoDB connection
  require("./database");

  console.log(
    `:::> Server listening on port ${PORT} @ http://localhost:${PORT}`
  );
});

// On server error
app.on("error", (error) => {
  console.error(`<::: An error occurred on the server: \n ${error}`);
});

module.exports = app;
