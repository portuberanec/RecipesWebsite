import express from 'express'
import { engine } from 'express-handlebars'
import * as fs from "node:fs";

const app = express()
/*const fs = require('node:fs');*/

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(express.static('public'));

app.get('/', (_, res) => {
    res.render('index', {layout: 'main'})
})

// чтение файла со всеми страницами и передача запроса для отображения страницы
const data = fs.readFileSync("C:/Github/RecipesWebsite/public/Webpages_info.txt", 'utf-8');
let STR = data.toString();
STR = STR.replace("\r\n", " - ");
let STRArray = STR.split(" - ");
/*STRArray.forEach(element => {
    console.log(element);
});*/

const RetArray = STRArray;
  //  console.log(STR.slice(0, STR.indexOf(' -')));   // выводим считанные данные

// нужно создать объект, который будет считывать файл и в цикле в него будут записываться определённые данные типа наименования, 

var RecipeParams = {
    Title: "",
    Author: "",
    IMG: "",
    EnergyValue: "",
    Ingredients: "",
    Sequence: "",
};

for (let i = 0; i < STRArray.length - 1; i = i + 2) {
    app.get(RetArray[i], (_, res) => {
        res.render(RetArray[i+1], {layout: 'recipe', png1: 1})
    })
    //console.log(RetArray[i]);
}

app.listen(3000, () => console.log('Server started'))