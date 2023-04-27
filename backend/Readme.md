# Running the project

## Required:

- .env file (with ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET variables)
- mysql database (edit the ormconfig.json)

## Run migration with:
```
npm run typeorm migration:run

```
## Run changes on solidity contracts:
```
npm run truffle migrate:reset

```

## API End-Points

- /auth/login
- /auth/check
- /auth/logout
- /auth/validid

## login credintials
```
email: najla@bcoc.com password: Blockchain@Najla
email: yaser@bcoc.com password: Blockchain@Yaser
email: john@bcoc.com password: Blockchain@John

``` 

## Notes : 
```
- make sure to update google map API with ur own secret key. 
- the backend server runs on http://localhost:8000
- the frontend server runs on http://localhost:3000

``` 

## URL for website : 