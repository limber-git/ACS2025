require("dotenv").config();
const app = require("./src/app");
const { conn, initializeDatabase } = require("./src/dbContext");
const { PORT } = process.env;

app.get("/", (req, res) => {
  res.status(200).send("<h1>Welcome to the server CBA!</h1>");
});

initializeDatabase()
  .then(() => {
    return conn.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to start the server:", err);
  });
