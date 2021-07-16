# Alkemy Labs - Backend Challenge (Node)

## Quick installation guide
### Pre-requisites
- [Node.js](https://nodejs.org/es/)
- [Sequelize CLI](https://github.com/sequelize/cli)

### Steps
```sh
# Clone repository
git clone https://github.com/Alan49/disney-world.git
cd disney-world
npm install

# Migrations and seeds
sequelize db:create
sequelize db:migrate
sequelize db:seed:all

# Run project
npm run start
```

## Endpoints
### Authentication
- POST `/auth/login`
- POST `/auth/register`

### Endpoints that require authentication
#### Characters
- GET `/characters`
  - GET `/characters?name=customName`
  - GET `/characters?age=customAge`
  - GET `/characters?movies=idMovie`
- POST `/characters`
- GET `/characters/:id`
- PUT `/characters/:id`
  - PUT `/characters/:id/movies/add`
  - PUT `/characters/:id/movies/remove`
- DELETE `/characters/:id`

#### Movies
- GET `/movies`
  - GET `/movies?name=custonName`
  - GET `/movies?gender=genderId`
  - GET `/movies?order=ASC` or `/movies?order=DESC`
- POST `/movies`
- GET `/movies/:id`
- PUT `/movies/:id`
  - PUT `/movies/:id/characters/add`
  - PUT `/movies/:id/characters/remove`
- DELETE `/movies/:id`