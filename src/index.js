import { app } from "./app.js";
import { databaseConnection } from "./database/server.js";

databaseConnection()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server is listen on port 3001");
    });
  })
  .catch((error) => {
    console.log("Network error!");
  });
