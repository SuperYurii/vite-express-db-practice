import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
dotenv.config();
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();

app.use(express.json());

app.use(cors());

app.listen(8080, function () {
  console.log("Server good. Ug. 8080 good.");
});

//=============================================

//I need a route to CREATE new data in the database

app.post("/messages", async (req, res) => {
  try {
    const data = req.body;
    const query = await db.query(
      `INSERT INTO guests (username, email, message) VALUES ($1, $2, $3)`,
      [data.username, data.email, data.message]
    );
    await res.json(query.rows);
  } catch (err) {
    console.error("Error posting data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//I need a route to READ data from the database
app.get("/messages", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM guests ORDER BY id DESC");
    res.json(result.rows); // send the data as JSON
  } catch (err) {
    console.error("Error getting data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//I need a route to DELETE data from the database
app.delete("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query("DELETE FROM guests WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      // No rows deleted = ID not found
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(204).send(); // No content = success
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
