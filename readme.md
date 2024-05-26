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
2. **Create a .env file in the root of your project with the following content:**
   ```bash
  
      MODEL=sqlite-async
      LOGIN_CONTROLLER=login-controller-password
      SESSION_SECRET=PhenyugCucow3
      SESSION_NAME=gymChain-session
      SESSION_LIFETIME=1000 * 60 * 60 * 2
      PORT=9999
   ```

3. **Install all necessary dependencies**
   ```bash
   npm install
   ```
4. **Run in local server**
   ```bash
   npm run watch
   ```
# Project Structure

## controllers/
Contains route handling logic.

## models/
Contains database models and queries using async-sqlite.

## views/
Contains Handlebars templates for rendering HTML.

## public/
Contains static assets (CSS, JS, images).

## routes/
Contains route definitions.

# Database Schema

## Tables

- **User:** Stores user account information.
- **Membership:** Stores membership details.
- **Class:** Stores gym class information.
- **Session:** Stores class session details (the weekly schedule for each gym)
- **Books:** Stores class booking information.
- **Belongs** Stores customers' home gym
- **Customer** Stores customers' details
- **Gym** Stores gym details
- **Includes** Stores which class each membership includes
- **Message** Stores messages sent by visitors and users
- **Payment Info** Stores user payment details
- **Represents** Stores which class each session represents





   
