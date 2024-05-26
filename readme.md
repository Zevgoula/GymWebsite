# Gym Chain Website

## Overview

This project is a Node.js web application for a gym chain, providing features like membership management, class scheduling, and user account handling. The app uses SQLite as the database, with asynchronous SQLite queries for efficient data handling.

## Features

- User authentication and account management
- Membership purchase and management
- Class scheduling and booking
- Gym location and services information
- Contact form for inquiries

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** SQLite, async-sqlite
- **Frontend:** HTML, CSS, JavaScript
- **Templating Engine:** Handlebars.js

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.x or later)
- npm (v6.x or later)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Zevgoula/GymWebsite.git
   ```
2. Install all necessary dependencies
   ```bash
   npm install
   ```
3. Run in local server
   ```bash
   npm run watch
   ```
gym-chain-website/
│
├── controllers/        # Route handling logic
│   ├── authController.js
│   ├── gymController.js
│   ├── membershipController.js
│   ├── scheduleController.js
│   └── ...
│
├── models/             # Database models and async-sqlite queries
│   ├── User.js
│   ├── Membership.js
│   ├── Class.js
│   ├── Session.js
│   ├── Booking.js
│   └── ...
│
├── views/              # Handlebars templates for rendering HTML
│   ├── layouts/
│   ├── partials/
│   ├── accountPage.hbs
│   ├── home.hbs
│   ├── login.hbs
│   ├── ...
│
├── public/             # Static assets (CSS, JS, images)
│   ├── css/
│   ├── js/
│   ├── images/
│   └── ...
│
├── routes/             # Route definitions
│   ├── authRoutes.js
│   ├── gymRoutes.js
│   ├── membershipRoutes.js
│   ├── scheduleRoutes.js
│   └── ...
│
├── config/             # Configuration files and database setup scripts
│   ├── db.js
│   └── ...
│
├── .env                # Environment variables
├── app.js              # Main application file
├── package.json        # NPM dependencies and scripts
└── README.md           # Project documentation


   
