import express from 'express'
import { engine } from 'express-handlebars'
import * as fs from "node:fs"
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Data structures
let RecipeParamsArray = []
let WebPagesArray = []
let IdPagesArray = []

// Data initialization
function initializeData() {
  try {
    const data = fs.readFileSync("./public/Webpages_info.txt", 'utf-8')
    const STRArray = data.split(/\r?\n/).filter(line => line.trim() !== '')
    
    RecipeParamsArray = []
    WebPagesArray = []
    IdPagesArray = []

    for (let i = 0; i < STRArray.length; i += 2) {
      const pagePath = STRArray[i]
      const recipeId = STRArray[i + 1]
      
      try {
        const baseInfo = fs.readFileSync(`./public/local/${recipeId}/BaseInfo.txt`, 'utf-8')
        const ingredients = fs.readFileSync(`./public/local/${recipeId}/Ingred.txt`, 'utf-8')
        const steps = fs.readFileSync(`./public/local/${recipeId}/Seq.txt`, 'utf-8')

        const RecipeBaseArray = baseInfo.split(/\r?\n/)
        const RecipeParams = {
          Title: RecipeBaseArray[0],
          Author: RecipeBaseArray[1],
          IMG: RecipeBaseArray[2],
          EnergyValue: RecipeBaseArray.slice(3, 7),
          Description: RecipeBaseArray[7],
          Ingredients: ingredients.split(/\r?\n/),
          Sequence: steps.split(/\r?\n/),
          ID: recipeId
        }

        RecipeParamsArray.push(RecipeParams)
        WebPagesArray.push(pagePath)
        IdPagesArray.push(recipeId)

        // Register dynamic routes
        app.get(pagePath, (req, res) => {
          res.render(recipeId, {
            layout: 'recipe',
            RecipeParams: RecipeParams,
            WebPagesArray
          })
        })

      } catch (error) {
        console.error(`Error loading recipe ${recipeId}:`, error)
      }
    }
  } catch (error) {
    console.error('Initialization error:', error)
  }
}

// Add recipe functionality
app.post('/add-recipe', async (req, res) => {
  try {
    const { title, author, energy, description, ingredients, steps, imageUrl} = req.body
    const recipeId = `recipe_${Date.now()}`

    // Create directory structure
    fs.mkdirSync(`./public/local/${recipeId}`, { recursive: true })

    // Create files
    fs.writeFileSync(
      `./public/local/${recipeId}/BaseInfo.txt`,
      `${title}\n${author}\n${recipeId}.png\n${energy}\n${description}`
    )

    fs.writeFileSync(
      `./public/local/${recipeId}/BaseInfo.txt`,
      `${title}\n${author}\n${imageUrl}\n${energy}\n${description}`
    );

    fs.writeFileSync(
      `./public/local/${recipeId}/Ingred.txt`,
      Array.isArray(ingredients) ? ingredients.join('\n') : ingredients
    )

    fs.writeFileSync(
      `./public/local/${recipeId}/Seq.txt`,
      Array.isArray(steps) ? steps.join('\n') : steps
    )

    // Update Webpages_info
    fs.appendFileSync(
      './public/Webpages_info.txt',
      `\n/add-${recipeId}\n${recipeId}`
    )
    
    fs.writeFileSync(`./views/${recipeId}.handlebars`, '');

    // Reinitialize data
    initializeData()
    res.redirect('/')

  } catch (error) {
    console.error('Error saving recipe:', error)
    res.status(500).send('Ошибка сохранения рецепта')
  }
})

// Routes
app.get('/', (_, res) => {
  const TopParamsArray = RecipeParamsArray.map((recipe, index) => ({
    Title: recipe.Title,
    Description: recipe.Description,
    IMG: recipe.IMG,
    ID: recipe.ID,
    path: WebPagesArray[index]
  }));

  const navigationItems = WebPagesArray.map((path, index) => ({
    path,
    title: RecipeParamsArray[index]?.Title || 'Новое блюдо'
  }));
  
  res.render('index', {
    layout: 'main',
    NavigationItems: navigationItems,
    TopParamsArray
  })
})

app.get('/inputpage', (_, res) => {
  res.render('inputpage', {
    layout: 'input',
    WebPagesArray,
    RecipeParams: RecipeParamsArray[0] || {}
  })
})

// Initialization
initializeData()

// Server start
app.listen(3000, () => {
  console.log('Server started on port 3000')
  console.log('Available recipes:', WebPagesArray)
})