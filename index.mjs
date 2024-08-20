import express from "express";
import fs from "fs/promises";
import cors from "cors";
const server = express();
server.use(cors());
server.get("/items", async (req, res) => {
  console.log(req.url);
  const filter = req.query.filter && req.query.filter.toLowerCase();
  let items = await fs.readFile("db.json");
  let json = JSON.parse(items).items;
  if (filter) {
    json = json.reduce((acc, val) => {
      if (val.name.toLowerCase().includes(filter.toLowerCase())) {
        return [...acc, val];
      } else {
        return acc;
      }
    }, []);
  }
  if (req.query.sort) {
    switch (req.query.sort) {
      case "price":
        json = json.sort((val1, val2) => {
          return val1.price - val2.price;
        });
        await res.json(json).status(200);
        return;
      case "discount":
        json = json.sort((val1, val2) => {
          return val2.discount - val1.discount;
        });
        await res.json(json).status(200);
        return;
      case "amount":
        json = json.sort((val1, val2) => {
          return val2.nutrients.length - val1.nutrients.length;
        });
        await res.json(json).status(200);
        return;
    }
  }
  await res.json(json).status(200);
});

server.listen(4000);
