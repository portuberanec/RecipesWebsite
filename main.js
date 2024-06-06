import express from 'express'
import { engine } from 'express-handlebars'

const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(express.static('public'));

app.get('/', (_, res) => {
    res.render('index', {layout: 'main'})
})

app.get('/breakfast', (_, res) => {
    res.render('breakfast', {layout: 'recipe', png1: 1})
})

app.listen(3000, () => console.log('Server started'))