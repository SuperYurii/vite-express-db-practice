import { db } from "./server.js";

//I can query my database using SQL and the querty method
db.query(
  `INSERT INTO staff (staff_name, staff_role, productivity_rating, department, ai_replaced)
    VALUES ('Frankie', 'instructor', 250000, 'digital innovation', false)`
);
