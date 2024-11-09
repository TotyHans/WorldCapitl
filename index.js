import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';
 
const client = new pg.Client({
  host: 'localhost',
  port: 5432,
  database: 'world',
  user: 'postgres',
  password: 'admin',
})

const app = express()
const port = 3000;
await client.connect();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));

const query = {
  text: 'SELECT * FROM capitals',
}

var rowCount=0;
var score=0;
var row={};
var answer ="";
var country="";
var capital="";
var allInfo=[];
var original=[];
var randomId=0
var nextLevel = false;

const result = await client.query(query);
//counting rows
rowCount = result.rowCount;

//obtaining all the information
original = result.rows;
allInfo = result.rows;
//closing connection
await client.end();

//cargando primera pantalla
app.get('/', async (req, res) => {
  score =0;
  nextLevel = true;
  await chargingNewLevel();
  res.render("index.ejs",{ country,score,nextLevel },function(err,html){
  res.send(html)
  });
  });

app.post("/submit",(req,res)=>{
  //obtaining answer and plus score  
  answer = req.body.answer;
  answer = answer.toLocaleLowerCase();
  capital = capital.toLocaleLowerCase();
  if(answer == capital){
    score++;
    nextLevel = true;
    rowCount--;
    var index = allInfo.indexOf(allInfo[randomId]);
    allInfo.splice(index,1);
    chargingNewLevel();
  }else{
    nextLevel = false;
    allInfo = [];
  }
  if(nextLevel){
    res.render("index.ejs",{country,score,nextLevel},function(err,html){
      res.send(html);
    });
  }else{
    res.render("index.ejs",{nextLevel,score},function(err,html){
      res.send(html);
    });
  }
});


async function chargingNewLevel(){
  allInfo = original;
  randomId = getRandomInt(rowCount);
  console.log("conteo de rows "+rowCount);
  console.log("id random "+randomId);
  row = allInfo[randomId];
  console.log(row);
  country = row.country;
  capital = row.capital;
  capital = capital.toLowerCase();
}

async function chargingNewLevelFlags(){
  allInfo = original;
  randomId = getRandomInt(rowCount);
  row = allInfo[randomId];
  console.log(row);
  country = row.country;
  country  = country.toLocaleLowerCase();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.get('/flag', async (req, res) => {
  score =0;
  nextLevel = true;
  await chargingNewLevelFlags();
  res.render("flag.ejs",{ country,score,nextLevel },function(err,html){
  res.send(html)
  });
  });

app.post('/submitFlag',async (req,res)=>{
  answer = req.body.answer;
  answer = answer.toLocaleLowerCase();
  country = country.toLocaleLowerCase();
  if(answer == country){
    score++;
    nextLevel = true;
    rowCount--;
    var index = allInfo.indexOf(allInfo[randomId]);
    allInfo.splice(index,1);
    chargingNewLevel();
  }else{
    nextLevel = false;
    allInfo = [];
  }
  if(nextLevel){
    res.render("flag.ejs",{country,score,nextLevel},function(err,html){
      res.send(html);
    });
  }else{
    res.render("flag.ejs",{nextLevel,score},function(err,html){
      res.send(html);
    });
}});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
