import express from "express";

const app = express();
const port = process.env.PORT ?? 3001;

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
