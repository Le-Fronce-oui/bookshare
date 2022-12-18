# BookShare

BookShare is a project created for a course of dynamic web programming. Its purpose is to allow individuals to enter a list of books they own, and then share some of them in organisations which they are part of. A user belonging to one of these organisation can then request to borrow a book to read it, which will be tracked in the application.

## Deployment

### Docker (recommended)

**Requirements: docker**

First, you have to build the containers. The easiest way is to use `make all` at the root of the repository.

You can either deploy the backend and the frontend in one single container or have them as two containers behind a reverse proxy. Examples for both of these configurations can be found in [`docker/compose`](docker/compose).

*Note: even if you don't want to use the split configuration you have to build all the images because they are necessary to build the full image*

### Manual

**Requirements: nginx, node 16, angular 14, postgresql 14+**

1. Build the backend : `cd backend && tsc`

2. Build the frontend : `cd frontend && ng build`

3. Setup the web server for serving the files + making the reverse proxy for the api (examples can be found for NGINX in [`docker/nginx`](docker/nginx))

4. Start the backend : `cd backend && npm run start` (don't forget the environment variables for the database connection)

5. Start the web server

## Setup for development

**Requirements: see manual deployment**

After cloning the repo, start with `make install` to install the node dependencies for the frontend and backend.

Fill the `.env` file in the backend with the values of the environment variables. Here is an example to get you started :

```
BS_JWT_KEY=<RANDOM STRING>
BS_DATABASE_HOST=localhost
BS_DATABASE_USER=bookshare
BS_DATABASE_NAME=bs
BS_DATABASE_PASS=<DATABASE PASSWORD>
BS_DATABASE_PORT=5432
BS_DATABASE_URL=postgresql://bookshare:<DATABASE PASSWORD>@localhost:5432/bs?schema=public
```

Then run `npx prisma migrate dev` to setup the database (only needed once).

To run the frontend in development mode : `ng serve`

To run the backend in development mode : `npm run dev`

