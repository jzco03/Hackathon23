import cors from "cors";
import express from "express";
import { Client } from "pg";

const app = express();

app.use(express.json());

// app.use(cors());
// app.get("/", async (req, res) => {
//   res.send("WELCOME");
// });

app.get("/mouvementsPower", async (req, res) => {
  const result = await client.query(
    "SELECT SUM(value), s.cap, m.volume\
    FROM energie as e\
    INNER JOIN mouvements as m \
    ON e.dastef = m.id_site\
    INNER JOIN sites as s\
    ON s.id_site = m.id_site\
    WHERE\
    e.time >= '" +
      req.query.date_debut +
      "' AND e.time <= '" +
      req.query.date_fin +
      "' \
    AND\
    e.dastef = m.id_site\
    AND \
    m.id_client = '" +
      req.query.id_client +
      "' \
    AND \
    m.sortie IS NOT null \
    GROUP BY s.cap, m.volume"
  );
  var cap = result.rows[0].cap;
  var kwh = result.rows[0].sum;
  var volume = result.rows[0].volume;
  console.log(kwh);
  res.send(JSON.stringify({ kwh: (kwh / cap) * volume }));
});

app.get("/entreesortie", async (req, res) => {
  const result = await client.query(
    "SELECT count(*) \
    FROM mouvements as m\
    WHERE\
    m.entree BETWEEN '" +
      req.query.date_debut +
      "' AND '" +
      req.query.date_fin +
      "'\
    AND\
    m.id_client = '" +
      req.query.id_client +
      "'\
    "
  );
  const result2 = await client.query(
    "SELECT count(*)\
    FROM mouvements as m\
    WHERE\
    m.sortie BETWEEN '" +
      req.query.date_debut +
      "' AND '" +
      req.query.date_fin +
      "'\
    AND\
    m.id_client = '" +
      req.query.id_client +
      "'\
    "
  );
  var entree = result.rows[0].count;
  var sortie = result2.rows[0].count;
  res.send(JSON.stringify({ entree: entree, sortie: sortie }));
});

const client = new Client({
  host: "54.228.18.75",
  port: 5432,
  user: "blue",
  password: "blueHack",
  database: "blueDB",
});
client.connect();
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
