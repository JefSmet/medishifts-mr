import express from 'express'
import bcrypt from 'bcrypt'
import initModels from './models/init-models'
import initBescoModels from './models/init-besco-models'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import session from 'express-session'
import sequelize from './config/database'
import sequelizeBesco from './config/besco'
import { Op } from 'sequelize'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
let bescoModels = initBescoModels(sequelizeBesco)
let models = initModels(sequelize)
const app = express()
const port = 3001
// const corsOptions = {
//     origin: 'http://localhost:3000', // Replace with the port your front-end is running on
//   };

// app.use(cors(corsOptions));
app.use(cors())
app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.initialize())
app.use(passport.session())

/**
 * Passport Local Strategy configuration.
 *
 * This function is used by Passport to authenticate a user using a username and password.
 * It checks if the user exists and verifies the password using bcrypt.
 *
 * @param {string} username - The username provided by the user.
 * @param {string} password - The password provided by the user.
 * @param {function} done - A callback function to be called after authentication attempt.
 */
passport.use(
  new LocalStrategy(
    { usernameField: 'username' }, // 'usernameField' is the name of the field in the login form
    async (username, password, done) => {
      const user = await models.users.findOne({
        where: { user_name: username },
      })
      if (!user) {
        return done(null, false, { message: 'No user with that username' })
      }
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Password incorrect' })
        }
      } catch (error) {
        return done(error)
      }
    }
  )
)

passport.serializeUser((user, done) => done(null, user.person_id))
passport.deserializeUser((id, done) => {
  models.users
    .findByPk(id)
    .then(user => done(null, user))
    .catch(err => done(err))
})

app.post('/login', passport.authenticate('local'), (req, res) => {
  // Verkrijg een platte versie van het Sequelize object
  const userObject = req.user.get({ plain: true })

  // Verwijder het wachtwoord uit het object
  const { password, ...userWithoutPassword } = userObject

  // Stuur de gebruikersdata terug zonder het wachtwoord veld
  res.json({ user: userWithoutPassword, message: 'Login successful' })
})

app.get('/logout', (req, res) => {
  req.logout()
})

app.listen(port, () => console.log(`Server running on port ${port}`))
app.get('/admin', checkUserRole('admin'), (req, res) => {
  res.send('Welcome admin!')
})
/**
 * Returns a function that checks the role of the user.
 *
 * @param {string} role - The role to check against.
 * @returns {Function} A middleware function to check user role authorization.
 */
function checkUserRole(role) {
  return async function (req, res, next) {
    try {
      const userRole = await models.user_roles.findOne({
        where: { user_id: req.user.person_id },
        include: [{ model: models.users }],
      })
      if (userRole.role == role) {
        next()
      } else {
        res.status(401).send('You are not authorized to perform this action.')
      }
    } catch (error) {
      console.error(error)
      res.status(500).send('Internal Server Error')
    }
  }
}

/*
    ROUTES FOR ALL OF THE MODELS
*/

//PERSONS

app.get('/persons', async (req, res) => {
  try {
    const persons = await models.persons.findAll()
    res.json(persons)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/persons/:id', async (req, res) => {
  try {
    const person = await models.persons.findByPk(req.params.id)
    if (person) {
      res.json(person)
    } else {
      res.status(404).send('Person not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.post('/persons', async (req, res) => {
  try {
    const newPerson = await models.persons.create(req.body)
    res.status(201).json(newPerson)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.put('/persons/:id', async (req, res) => {
  try {
    const person = await models.persons.findByPk(req.params.id)
    if (person) {
      await person.update(req.body)
      res.json(person)
    } else {
      res.status(404).send('Person not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.delete('/persons/:id', async (req, res) => {
  try {
    await models.persons.destroy({ where: { id: req.params.id } })
    res.status(204).send('Person deleted')
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

//DOCTORS

app.get('/doctors', async (req, res) => {
  try {
    const doctors = await models.doctors.findAll()
    res.json(doctors)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/doctors/:id', async (req, res) => {
  try {
    const doctor = await models.doctors.findByPk(req.params.id)
    if (doctor) {
      res.json(doctor)
    } else {
      res.status(404).send('Doctor not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.post('/doctors', async (req, res) => {
  try {
    const newDoctor = await models.doctors.create(req.body)
    res.status(201).json(newDoctor)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.put('/doctors/:id', async (req, res) => {
  try {
    const doctor = await models.doctors.findByPk(req.params.id)
    if (doctor) {
      await doctor.update(req.body)
      res.json(doctor)
    } else {
      res.status(404).send('Doctor not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.delete('/doctors/:id', async (req, res) => {
  try {
    await models.doctors.destroy({ where: { doctor_id: req.params.id } })
    res.status(204).send('Doctor deleted')
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

// ACTIVITIES

app.get('/activities/:year/:month', async (req, res) => {
  const { year, month } = req.params

  try {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const activities = await models.activities.findAll({
      where: {
        begin_DT: {
          [Op.gte]: startDate,
        },
        end_DT: {
          [Op.lte]: endDate,
        },
        status: 'OK',
      },
      include: [
        {
          model: models.persons,
          attributes: ['first_name', 'last_name'],
        },
        {
          model: models.activity_types,
          attributes: ['name'],
          where: {
            name: {
              [Op.ne]: 'Verlof',
            },
          },
        },
      ],
      order: [
        ['begin_DT', 'ASC'],
        [models.activity_types, 'name', 'ASC'],
        [models.persons, 'last_name', 'ASC'],
        [models.persons, 'first_name', 'ASC'],
      ],
    })

    res.json(activities)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/activities/:id', async (req, res) => {
  try {
    const activity = await models.activities.findByPk(req.params.id)
    if (activity) {
      res.json(activity)
    } else {
      res.status(404).send('Activity not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.post('/activities', async (req, res) => {
  try {
    const newActivity = await models.activities.create(req.body)
    res.status(201).json(newActivity)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.put('/activities/:id', async (req, res) => {
  try {
    const activity = await models.activities.findByPk(req.params.id)
    if (activity) {
      await activity.update(req.body)
      res.json(activity)
    } else {
      res.status(404).send('Activity not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.delete('/activities/:id', async (req, res) => {
  try {
    await models.activities.destroy({ where: { activity_id: req.params.id } })
    res.status(204).send('Activity deleted')
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

// ACTIVITY TYPES

app.get('/activity_types', async (req, res) => {
  try {
    const activityTypes = await models.activity_types.findAll()
    res.json(activityTypes)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/activity_types/:id', async (req, res) => {
  try {
    const activityType = await models.activity_types.findByPk(req.params.id)
    if (activityType) {
      res.json(activityType)
    } else {
      res.status(404).send('Activity type not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.post('/activity_types', async (req, res) => {
  try {
    const newActivityType = await models.activity_types.create(req.body)
    res.status(201).json(newActivityType)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.put('/activity_types/:id', async (req, res) => {
  try {
    const activityType = await models.activity_types.findByPk(req.params.id)
    if (activityType) {
      await activityType.update(req.body)
      res.json(activityType)
    } else {
      res.status(404).send('Activity type not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.delete('/activity_types/:id', async (req, res) => {
  try {
    await models.activity_types.destroy({
      where: { activity_type_id: req.params.id },
    })
    res.status(204).send('Activity type deleted')
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

// USERS

app.get('/users', async (req, res) => {
  try {
    const users = await models.users.findAll()
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/users/:id', async (req, res) => {
  try {
    const user = await models.users.findByPk(req.params.id)
    if (user) {
      res.json(user)
    } else {
      res.status(404).send('User not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.post('/users', async (req, res) => {
  try {
    const newUser = await models.users.create(req.body)
    res.status(201).json(newUser)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.put('/users/:id', async (req, res) => {
  try {
    const user = await models.users.findByPk(req.params.id)
    if (user) {
      await user.update(req.body)
      res.json(user)
    } else {
      res.status(404).send('User not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.delete('/users/:id', async (req, res) => {
  try {
    await models.users.destroy({ where: { person_id: req.params.id } })
    res.status(204).send('User deleted')
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

// USER ROLES

app.get('/user_roles', async (req, res) => {
  try {
    const userRoles = await models.user_roles.findAll()
    res.json(userRoles)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/user_roles/:id', async (req, res) => {
  try {
    const userRole = await models.user_roles.findByPk(req.params.id)
    if (userRole) {
      res.json(userRole)
    } else {
      res.status(404).send('User role not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.post('/user_roles', async (req, res) => {
  try {
    const newUserRole = await models.user_roles.create(req.body)
    res.status(201).json(newUserRole)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.put('/user_roles/:id', async (req, res) => {
  try {
    const userRole = await models.user_roles.findByPk(req.params.id)
    if (userRole) {
      await userRole.update(req.body)
      res.json(userRole)
    } else {
      res.status(404).send('User role not found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.delete('/user_roles/:id', async (req, res) => {
  try {
    await models.user_roles.destroy({ where: { id: req.params.id } })
    res.status(204).send('User role deleted')
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.post('/persons-doctors', async (req, res) => {
  const transactionConst = await sequelize.transaction()
  try {
    // Maak een person aan
    const person = await models.persons.create(req.body.person, {
      transaction: transactionConst,
    })

    // Gebruik de ID van de aangemaakte person om een doctor aan te maken
    req.body.doctor.person_id = person.id // Zorg ervoor dat 'PersonId' de juiste foreign key is in je Doctor model
    const doctor = await models.doctors.create(req.body.doctor, {
      transaction: transactionConst,
    })

    // // Voeg een user role toe, indien nodig
    // roleData.userId = person.id; // Aanpassen op basis van je modelstructuur
    // const userRole = await UserRole.create(data.body.role, { transaction: transactionConst });

    // Commit de transactie
    await transactionConst.commit()
    res.status(201).json({ person, doctor })
  } catch (error) {
    // Rollback bij een fout
    await transactionConst.rollback()
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/activities/:activity_type/:begin_DT/:end_DT', async (req, res) => {
  try {
    const activities = await models.activities.findAll({
      include: [
        {
          model: models.activity_types,
          where: { name: req.params.activity_type },
          required: true,
        },
        {
          model: models.persons,
          attributes: ['last_name', 'first_name'],
        },
      ],
      where: {
        begin_DT: {
          [Op.gte]: req.params.begin_DT,
        },
        end_DT: {
          [Op.lte]: req.params.end_DT,
        },
      },
      order: [['begin_DT', 'ASC']],
    })
    res.json(activities)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/besco/qualificationName/:qualificationCode', async (req, res) => {
  try {
    const qualificationCodes = await bescoModels.qualificationCode.findOne({
      attributes: ['DescriptionNL'],
      where: {
        ProfessionCode: 10,
        code: req.params.qualificationCode,
      },
    })
    res.json(qualificationCodes)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})
