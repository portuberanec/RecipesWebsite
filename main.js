import express from 'express'
import { engine } from 'express-handlebars'

const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(express.static('public'));

app.get('/', (_, res, next) => {
    res.render('index', {layout: 'main'})
})

app.get('/breakfast', (req, res, next) => {
    res.render('breakfast.handlebars', {layout: 'recipe'})
})

app.listen(3000, () => console.log('Server started'))