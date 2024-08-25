// Import dependencies
// import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import passport from './config/passport.js';
import { Strategy as LocalStrategy } from 'passport-local';
import { Op } from 'sequelize';
import sequelizeBesco from './config/besco.js';
import sequelize from './config/database.js';
import initBescoModels from './models/init-besco-models.js';
import initModels from './models/init-models.js';
import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'your_jwt_secret';

// Load environment variables
dotenv.config();

// Initialize models
let bescoModels = initBescoModels(sequelizeBesco);
let models = initModels(sequelize);

// Initialize Express app
const app = express();
const port = 3001;

// Middleware setup
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/**
 * Passport Local Strategy configuration.
 */
passport.use(
  new LocalStrategy(
    { usernameField: 'username' },
    async (username, password, done) => {
      const user = await models.users.findOne({
        where: { user_name: username },
      });
      if (!user) {
        return done(null, false, { message: 'No user with that username' });
      }
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.person_id));
passport.deserializeUser((id, done) => {
  models.users
    .findByPk(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}
/**
 * Route definitions
 */

// User authentication routes
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const platform = req.headers['x-platform'];

  models.users
    .findOne({
      where: { username },
      include: [
        {
          model: models.user_roles,
          attributes: ['role'],
        },
      ],
    })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ usernameNotFound: 'username not found' });
      }

      const hashedInput = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');

      if (hashedInput === user.password) {
        // Gebruiker gevonden, JWT token genereren
        const payload = {
          id: user.id,
          name: user.name,
          role: user.user_role.role,
        };

        let expiresIn;
        if (platform === 'web') {
          expiresIn = '2h'; // 2 uur voor web
        } else if (platform === 'mobile') {
          expiresIn = '7d'; // 7 dagen voor mobiel
        } else {
          expiresIn = '1h'; // Standaard, indien platform onbekend is
        }

        jwt.sign(payload, secret, { expiresIn }, (err, token) => {
          res.json({
            success: true,
            token: 'Bearer ' + token,
          });
        });
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: 'Password incorrect' });
      }
    })
    .catch((err) => res.status(401).json({ error: err.message }));
});

// Beveiligde route
// app.get('/api/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
//   res.json({ message: 'You are authenticated!', user: req.user });
// });

app.get('/logout', (req, res) => {
  req.logout();
});

app.get('/ics/:token', async (req, res) => {
  const { token } = req.params;

  const user = await models.users.findOne({ where: { ics_token: token } });

  if (!user) {
    return res.status(404).send('User not found');
  }

  const icsData = await generateICS(models, user.id, req.query.activity_types);
  res.setHeader('Content-Disposition', 'attachment; filename=calendar.ics');
  res.setHeader('Content-Type', 'text/calendar');
  res.send(icsData);
});

app.get('/ics/all-doctors/:token', async (req, res) => {
  const { token } = req.params;

  const user = await models.users.findOne({ where: { ics_token: token } });

  if (!user) {
    return res.status(404).send('User not found');
  }

  const icsData = await generateICSForAllDoctors(
    models,
    req.query.activity_types
  );
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=all-doctors-calendar.ics'
  );
  res.setHeader('Content-Type', 'text/calendar');
  res.send(icsData);
});

app.get(
  '/get-ics-token',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const user = await models.users.findByPk(req.user.id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (!user.ics_token) {
      user.ics_token = generateToken();
      await user.save();
    }

    res.json({ ics_token: user.ics_token });
  }
);

// Admin route with role checking middleware
app.get('/admin', checkUserRole('admin'), (req, res) => {
  res.send('Welcome admin!');
});

// Model-based routes

// Persons
app.get('/persons', async (req, res) => {
  try {
    const persons = await models.persons.findAll();
    res.json(persons);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/persons/:id', async (req, res) => {
  try {
    const person = await models.persons.findByPk(req.params.id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).send('Person not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/persons', async (req, res) => {
  try {
    const newPerson = await models.persons.create(req.body);
    res.status(201).json(newPerson);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/persons/:id', async (req, res) => {
  try {
    const person = await models.persons.findByPk(req.params.id);
    if (person) {
      await person.update(req.body);
      res.json(person);
    } else {
      res.status(404).send('Person not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/persons/:id', async (req, res) => {
  try {
    await models.persons.destroy({ where: { id: req.params.id } });
    res.status(204).send('Person deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Doctors
app.get('/doctors', async (req, res) => {
  try {
    const doctors = await models.doctors.findAll();
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/doctors/:id', async (req, res) => {
  try {
    const doctor = await models.doctors.findByPk(req.params.id);
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).send('Doctor not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/doctors', async (req, res) => {
  try {
    const newDoctor = await models.doctors.create(req.body);
    res.status(201).json(newDoctor);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/doctors/:id', async (req, res) => {
  try {
    const doctor = await models.doctors.findByPk(req.params.id);
    if (doctor) {
      await doctor.update(req.body);
      res.json(doctor);
    } else {
      res.status(404).send('Doctor not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/doctors/:id', async (req, res) => {
  try {
    await models.doctors.destroy({ where: { doctor_id: req.params.id } });
    res.status(204).send('Doctor deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Activities
app.get('/activities/period/:startDate/:endDate', async (req, res) => {
  const { startDate, endDate } = req.params;
  try {
    const activities = await models.activities.findAll({
      where: {
        begin_DT: { [Op.gte]: startDate },
        end_DT: { [Op.lte]: endDate },
        status: 'OK',
      },
      include: [
        { model: models.persons, attributes: ['first_name', 'last_name'] },
        {
          model: models.activity_types,
          attributes: ['name'],
          where: { name: { [Op.ne]: 'Verlof' } },
        },
      ],
      order: [
        ['begin_DT', 'ASC'],
        [models.activity_types, 'name', 'ASC'],
        [models.persons, 'last_name', 'ASC'],
        [models.persons, 'first_name', 'ASC'],
      ],
    });

    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/activities/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const activities = await models.activities.findAll({
      where: {
        begin_DT: { [Op.gte]: startDate },
        end_DT: { [Op.lte]: endDate },
        status: 'OK',
      },
      include: [
        { model: models.persons, attributes: ['first_name', 'last_name'] },
        {
          model: models.activity_types,
          attributes: ['name'],
          where: { name: { [Op.ne]: 'Verlof' } },
        },
      ],
      order: [
        ['begin_DT', 'ASC'],
        [models.activity_types, 'name', 'ASC'],
        [models.persons, 'last_name', 'ASC'],
        [models.persons, 'first_name', 'ASC'],
      ],
    });

    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/activities/:id', async (req, res) => {
  try {
    const activity = await models.activities.findByPk(req.params.id);
    if (activity) {
      res.json(activity);
    } else {
      res.status(404).send('Activity not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/activities', async (req, res) => {
  try {
    const newActivity = await models.activities.create(req.body);
    res.status(201).json(newActivity);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/activities/:id', async (req, res) => {
  try {
    const activity = await models.activities.findByPk(req.params.id);
    if (activity) {
      await activity.update(req.body);
      res.json(activity);
    } else {
      res.status(404).send('Activity not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/activities/:id', async (req, res) => {
  try {
    await models.activities.destroy({ where: { activity_id: req.params.id } });
    res.status(204).send('Activity deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Activity Types
app.get('/activity_types', async (req, res) => {
  try {
    const activityTypes = await models.activity_types.findAll();
    res.json(activityTypes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/activity_types/:id', async (req, res) => {
  try {
    const activityType = await models.activity_types.findByPk(req.params.id);
    if (activityType) {
      res.json(activityType);
    } else {
      res.status(404).send('Activity type not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/activity_types', async (req, res) => {
  try {
    const newActivityType = await models.activity_types.create(req.body);
    res.status(201).json(newActivityType);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/activity_types/:id', async (req, res) => {
  try {
    const activityType = await models.activity_types.findByPk(req.params.id);
    if (activityType) {
      await activityType.update(req.body);
      res.json(activityType);
    } else {
      res.status(404).send('Activity type not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/activity_types/:id', async (req, res) => {
  try {
    await models.activity_types.destroy({
      where: { activity_type_id: req.params.id },
    });
    res.status(204).send('Activity type deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Users
app.get('/users', async (req, res) => {
  try {
    const users = await models.users.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await models.users.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/users', async (req, res) => {
  try {
    const newUser = await models.users.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const user = await models.users.findByPk(req.params.id);
    if (user) {
      await user.update(req.body);
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    await models.users.destroy({ where: { person_id: req.params.id } });
    res.status(204).send('User deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// User Roles
app.get('/user_roles', async (req, res) => {
  try {
    const userRoles = await models.user_roles.findAll();
    res.json(userRoles);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/user_roles/:id', async (req, res) => {
  try {
    const userRole = await models.user_roles.findByPk(req.params.id);
    if (userRole) {
      res.json(userRole);
    } else {
      res.status(404).send('User role not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/user_roles', async (req, res) => {
  try {
    const newUserRole = await models.user_roles.create(req.body);
    res.status(201).json(newUserRole);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/user_roles/:id', async (req, res) => {
  try {
    const userRole = await models.user_roles.findByPk(req.params.id);
    if (userRole) {
      await userRole.update(req.body);
      res.json(userRole);
    } else {
      res.status(404).send('User role not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/user_roles/:id', async (req, res) => {
  try {
    await models.user_roles.destroy({ where: { id: req.params.id } });
    res.status(204).send('User role deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Composite operation route
app.post('/persons-doctors', async (req, res) => {
  const transactionConst = await sequelize.transaction();
  try {
    const person = await models.persons.create(req.body.person, {
      transaction: transactionConst,
    });
    req.body.doctor.person_id = person.id;
    const doctor = await models.doctors.create(req.body.doctor, {
      transaction: transactionConst,
    });

    await transactionConst.commit();
    res.status(201).json({ person, doctor });
  } catch (error) {
    await transactionConst.rollback();
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// BESCO related routes
app.get('/besco/qualificationName/:qualificationCode', async (req, res) => {
  try {
    const qualificationCodes = await bescoModels.qualificationCode.findOne({
      attributes: ['DescriptionNL'],
      where: {
        ProfessionCode: 10,
        code: req.params.qualificationCode,
      },
    });
    res.json(qualificationCodes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * Utility functions
 */

// Role checking middleware
function checkUserRole(role) {
  return async function (req, res, next) {
    try {
      const userRole = await models.user_roles.findOne({
        where: { user_id: req.user.person_id },
        include: [{ model: models.users }],
      });
      if (userRole.role == role) {
        next();
      } else {
        res.status(401).send('You are not authorized to perform this action.');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };
}

// Start the server
const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
