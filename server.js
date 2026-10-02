require("dotenv").config();

const http = require("http");
const express = require("express");
require("./services/cacheStore");
const productRoutes = require("./routes/products");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use("/products", productRoutes);

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    driver: process.env.DB_DRIVER || "json",
  });
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Products API listening on port ${port}`);
  console.log(`Cache TTL: ${Number(process.env.CACHE_TTL_MS) || 60000}ms`);
  console.log(`DB driver: ${process.env.DB_DRIVER || "json"}`);
});
