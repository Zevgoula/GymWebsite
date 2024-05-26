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

## config/
Contains configuration files and database setup scripts.

# Routes

## Public Routes

- **/home:** Home page
- **/login:** User login
- **/joinNow:** Membership sign-up
- **/about_classes:** Information about gym services and classes
- **/contact:** Contact form

## Protected Routes (require authentication)

- **/account_page:** User account details
- **/services/:location:** Membership purchase for a specific gym location
- **/gymLab_schedule/:location:** Class schedule for a specific gym location
- **/customer_schedule:** View user's booked classes
- **/logout:** User logout

# Database Schema

## Tables

- **Users:** Stores user account information.
- **Memberships:** Stores membership details.
- **Classes:** Stores gym class information.
- **Sessions:** Stores class session details.
- **Bookings:** Stores class booking information.




   
