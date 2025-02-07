const Planets = require("../models/planet")
const Explorer = require("../models/explorer")

const newPlanet = (req, res) => {
  res.render("planets/new")
}

const create = async (req, res) => {
  for (let key in req.body) {
    if (req.body[key] === "") {
      delete req.body[key]
    }
  }

  req.body.hasWater = !!req.body.hasWater

  try {
    await Planets.create(req.body)
    res.redirect("/planets/new")
  } catch (error) {
    console.log(error)
    res.redirect("/planets/new")
  }
}

const index = async (req, res) => {
  try {
    const planets = await Planets.find()
    res.render("planets", { planets })
  } catch (error) {
    console.log(error)
  }
}

const show = async (req, res) => {
  try {
    const planet = await Planets.findById(req.params.id).populate("explorers")
    planet.plants.sort((a, b) => {
      const nameA = a.name.toUpperCase() // ignore upper and lowercase
      const nameB = b.name.toUpperCase() // ignore upper and lowercase
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
    })

    const allExplorers = await Explorer.find()
    const planetExplorers = planet.explorers
    const availableExplorers = allExplorers.filter((explorer) => {
      // console.log(planetExplorers)
      if (!planetExplorers.some((e) => e.name === explorer.name)) {
        return explorer
      }
    })
    const explorers = availableExplorers
    res.render("planets/show", { planet, planetExplorers, explorers })
  } catch (error) {
    console.log(error)
  }
}

module.exports = { newPlanet, create, index, show }
