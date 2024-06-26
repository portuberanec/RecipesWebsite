import express from 'express'
import { engine } from 'express-handlebars'
import * as fs from "node:fs";

const app = express()
/*const fs = require('node:fs');*/

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(express.static('public'));


// чтение файла со всеми страницами и передача запроса для отображения страницы
const data = fs.readFileSync("./public/Webpages_info.txt", 'utf-8');
let STR = data.toString();
STR = STR.replace(/\r\n/g, " - ");
let STRArray = STR.split(" - ");
/*STRArray.forEach(element => {
    console.log(element);
});*/

const RetArray = STRArray;
const RecipeParamsArray = [];
const WebPagesArray = [];
  //  console.log(STR.slice(0, STR.indexOf(' -')));   // выводим считанные данные


  function UpdateData () {

for (let i = 0; i < STRArray.length - 1; i = i + 2) {
    const RecipeBaseData = fs.readFileSync("./public/local/" + RetArray[i+1] + "/BaseInfo.txt", 'utf-8');

    let RecipeBaseArray = RecipeBaseData.split("\r\n");
    //console.log(RecipeBaseArray);
    
    const RecipeIngredData = fs.readFileSync("./public/local/" + RetArray[i+1] + "/Ingred.txt", 'utf-8');
    
    let RecipeIngredArray = RecipeIngredData.split("\r\n");
    //console.log(RecipeIngredArray);
    
    const RecipeSeqData = fs.readFileSync("./public/local/" + RetArray[i+1] + "/Seq.txt", 'utf-8');
    
    let RecipeSeqArray = RecipeSeqData.split("\r\n");
    //console.log(RecipeSeqArray);
    
    var RecipeParams = {
        Title: RecipeBaseArray[0],
        Author: RecipeBaseArray[1],
        IMG: RecipeBaseArray[2],
        EnergyValue: [RecipeBaseArray[3], RecipeBaseArray[4], RecipeBaseArray[5], RecipeBaseArray[6]],
        Desctiption: RecipeBaseArray[7],
        Ingredients: RecipeIngredArray,
        Sequence: RecipeSeqArray,
    };
    
    RecipeParamsArray.push(RecipeParams);
    WebPagesArray.push(STRArray[i+1]);
    //console.log(RetArray[i]);
}
}

for (let i = 0; i < STRArray.length - 1; i = i + 2) {
    app.get(RetArray[i], (req, res) => {
    res.render(RetArray[i+1], {layout: 'recipe', RecipeParams: RecipeParamsArray[i/2], WebPagesArray});
    //console.log(req);
    //console.log(RecipeParamsArray, i);
})
}

UpdateData();

const TopParamsArray = [];

for (let i = 0; i < WebPagesArray.length; i++) {

    var TopParams = {
        Title: RecipeParamsArray[i].Title,
        Desctiption: RecipeParamsArray[i].Desctiption,
        IMG: RecipeParamsArray[i].IMG,
    }
    TopParamsArray.push(TopParams);
}
//console.log (TopParamsArray);

app.get('/', (_, res) => {
    res.render('index', {layout: 'main', WebPagesArray, TopParamsArray})
})

app.listen(3000, () => console.log('Server started'))