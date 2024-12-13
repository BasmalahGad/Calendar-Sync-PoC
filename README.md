# Calendar Sync PoC

This project is designed to sync calendars using the Microsoft Graph API. It requires several npm packages to be installed before running the application.

## Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- npm (comes with Node.js)

## Getting Started

Follow these steps to set up and run the project locally:

#### 1. Clone the Repository

First, clone the repository to your local machine.

```bash
git clone https://github.com/BasmalahGad/calendar-sync-poc.git
cd calendar-sync-poc
```
#### 2. Install Dependencies
You need to install all the required npm modules. Run the following command in your project directory

```bash
npm install
```
This will automatically install all dependencies listed in ```package.json```. If you encounter any missing modules, use the following commands to install them
```bash
npm install express
```
```bash
npm install cookie-parser
```
```bash
npm install express-session
```
```bash
npm install simple-oauth2
```
```bash
npm install @microsoft/microsoft-graph-client
```
```bash
npm install isomorphic-fetch
```
#### 3. Run the Application
After installing all the dependencies, you can run the application with the following command
```bash
node app.js
```
