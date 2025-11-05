# KinoApp

## Requirements
 - Node v20.16.0
 - NPM 10.8.1
 - NPX 10.8.1
 - Docker Compose version v2.28.1
 - Docker version 27.0.3

## Install
```sh
git clone https://github.com/makeinside-create/kino-test-app.git

cd ./kino-test-app

npm i

```

## Services Start

__Start__: postgres, redis, kafka, zookeeper

```sh
npm run dockerUp
```

## Init DB
```sh
npm run migration:auth

npm run migration:tickets
```

## Start Project
Starting Nx console for 3 app.
```sh
npm run runAll
```

## Create User

http://localhost:3001/ - Auth

POST http://localhost:3001/auth/register or ( POST http://localhost:3001/auth/login )

Request:
```json
{
"email": "testmail@gmail.com",
"password": "qwe123"
}
```
Response:
```json
{
  "token": "0b4864fc-3522-4475-a1e0-3eae839669fe",
  "user": {
    "id": "cf2d0447-35ac-4c9e-aa54-8b139ad9d15f",
    "email": "testmail@gmail.com"
  }
}
```
Token need for next queries


## Create 'events' and 'tickets'

http://localhost:3003/ - Tickets

Goto: http://localhost:3003/graphql

### createEvent

```
mutation createEvent ($name: String! $date: String!) {
  createEvent(name: $name date: $date) {
    id
    name
    date
  }
}
```

Request: 
```json
{
  "name": "test Event",
  "date": "2025-11-05T08:15:58+00:00"
}
```

Response:
```json
{
  "data": {
    "createEvent": {
      "id": "9d1ad363-68ea-47c1-aaf1-e4b57a72c7ba",
      "name": "test 3",
      "date": "2025-11-05T08:15:58.000Z"
    }
  }
}
```

### createTicket

```
mutation createTicket ($eventId: String! $seat: Float! $token: String!) {
  createTicket(eventId: $eventId seat: $seat token: $token) {
    id
		seat
		status
		userId
  }
}
```

Request:
```json
{
  "eventId":"9d1ad363-68ea-47c1-aaf1-e4b57a72c7ba",
  "seat":10,
  "token": "0b4864fc-3522-4475-a1e0-3eae839669fe"
}
```

Response:
```json
{
  "data": {
    "createTicket": {
      "id": "6468e946-1e79-4508-9513-af799d2b571b",
      "seat": 10,
      "status": "AVAILABLE",
      "userId": null
    }
  }
}
```
### reserveTicket
```
mutation reserveTicket ($ticketId: String! $token: String!) {
  reserveTicket(ticketId: $ticketId token: $token) {
    id
		seat
		status
		userId
  }
}
```
Request:
```json
{
  "ticketId":"6468e946-1e79-4508-9513-af799d2b571b",
  "token": "0b4864fc-3522-4475-a1e0-3eae839669fe"
}
```

Response:
```json
{
  "data": {
    "reserveTicket": {
      "id": "6468e946-1e79-4508-9513-af799d2b571b",
      "seat": 10,
      "status": "RESERVED",
      "userId": "cf2d0447-35ac-4c9e-aa54-8b139ad9d15f"
    }
  }
}
```

__After reserveTicket, a message will appear in the “notifications” application console:__
```text
Email sent to user testmail@gmail.com for ticket 6468e946-1e79-4508-9513-af799d2b571b.
```

## Stop Services

__Stop__: postgres, redis, kafka, zookeeper

```sh
npm run dockerDown
```
