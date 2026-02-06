Overview

This project is a background email scheduling system built using:

Node.js + TypeScript

Prisma ORM

Redis

BullMQ Queue

SMTP Email Service

It allows you to:

Schedule emails for future delivery

Store email jobs and recipients in database

Process emails using background workers

Track status of each email and job.

Environment Variables

DATABASE_URL=postgresql://user:password@localhost:5432/emaildb

REDIS_HOST=localhost

REDIS_PORT=6379

SMTP_HOST=smtp.gmail.com

SMTP_PORT=587

SMTP_USER=your_email@gmail.com

SMTP_PASS=your_password

Installation

npm install

npx prisma generate

npx prisma migrate dev

docker run -p 6379:6379 redis

npm run dev

npm run worker


Author

Aniket

Computer Science Graduate

Backend Developer (Node.js, Spring Boot, Prisma, SQL, NoSQL)

GitHub:

https://github.com/aniket709




