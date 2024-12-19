# Musicboxd

## Docker

Run `docker compose up --build` to start running the NextJS application, socket server, and MongoDB containers
simultaneously. After that, everything should work like if you were developing locally.

## To Run The Site

1. In the terminal run the command `npm install` to install all necessary packages
2. Run the command `npm run dev` and click on [localhost:300](http://localhost:3000)

## To Seed The DB

1. Go to src/app/page.tsx
2. Uncomment out the function seed(). This will seed the database
3. In the terminal run the command `npm run dev` and click on [localhost:300](http://localhost:3000)
4. Wait until you see 'Done Seeding Database' in the terminal and then click 'CTRL C' to stop the site from running.
5. Go back to src/app/page.tsx and comment out the function seed().
6. In the terminal run the command `npm run dev` and click on [localhost:300](http://localhost:3000) again and will be
   able to run the site with the seeded database. 