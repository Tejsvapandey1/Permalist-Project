import express from "express";
import bodyParser from "body-parser";
import pg from "pg"
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "sJUbc#4h52",
  port: 5432,
});
db.connect();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];
async function getitemlist(){
  const result= await db.query("select * from items")
  const items= result.rows
  
  return items;
}

app.get("/", async(req, res) => {
  const items1= await getitemlist()
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items1,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  await db.query("insert into items (title) values ($1)",[item])
  
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const itemid=req.body.updatedItemId
  const newtitle=req.body.updatedItemTitle
  db.query("update items set title= $1 where id = $2",[newtitle,itemid])
  res.redirect("/")
});

app.post("/delete", (req, res) => {
  const todel=req.body.deleteItemId
  db.query("delete from items where id=$1",[todel])
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
