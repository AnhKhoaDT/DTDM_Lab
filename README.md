# TaskManager Setup Guide

## 1. Create Database
Create a PostgreSQL database named `TaskManager`.

## 2. Setup Environment Variables
Create a `.env` file following the structure of `.env.example`.

## 3. Install Dependencies
Run the following command to install dependencies:
```sh
npm install
```

## 4. Run Database Migrations
Execute the migration command to create tables in the database:
```sh
npx sequelize-cli db:migrate
```

## 5. Start the Backend Server
Run the following command to start the backend:
```sh
npm run dev
```

