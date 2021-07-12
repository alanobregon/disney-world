# Alkemy Labs - Backend Challenge (Node)

## Quick installation guide

## Endpoints
### Authentication
- POST `/auth/login`
- POST `/auth/Register`

### Endpoints that require authentication
#### Characters
- GET `/characters`
  - GET `/characters?name=customName`
  - GET `/characters?age=customAge`
  - GET `/characters?movies=idMovie`
- POST `/characters`
- GET `/characters/:id`
- PUT `/characters/:id`
- DELETE `/characters/:id`

#### Movies
- GET `/movies`
  - GET `/movies?name=custonName`
  - GET `/movies?gender=genderIds`
  - GET `/movies?order=ASC` or `/movies?order=DESC`
- POST `/movies`
- GET `/movies/:id`
- PUT `/movies/:id`
- DELETE `/movies/:id`