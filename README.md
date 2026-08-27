# PathForge – React Frontend

**Version:** 1.0.0

PathForge is a modern React frontend application that works with the PathForge Laravel backend API.

This package contains the **React frontend**. The Laravel backend/API is configured separately.

For complete backend, VPS, Docker, Nginx, SSL, deployment, and troubleshooting instructions, please visit:

**Documentation:** https://documentation.techtrack.online/

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Requirements](#requirements)
* [Package Structure](#package-structure)
* [Installation](#installation)
* [Environment Configuration](#environment-configuration)
* [Backend API Configuration](#backend-api-configuration)
* [Firebase Configuration](#firebase-configuration)
* [Stripe Configuration](#stripe-configuration)
* [Development](#development)
* [Production Build](#production-build)
* [Deployment](#deployment)
* [Admin Panel](#admin-panel)
* [Troubleshooting](#troubleshooting)
* [Documentation](#documentation)
* [Security](#security)
* [Credits](#credits)
* [Support](#support)

---

## Overview

PathForge is built with React and communicates with the Laravel backend through API endpoints.

The frontend provides the user interface, while the backend handles server-side functionality such as:

* Authentication
* Database operations
* Business logic
* Email/SMTP configuration
* Payment processing
* API services
* Administrative functionality

> **Important:** The Laravel backend must be installed and configured before using the complete application.

---

## Features

* Modern React frontend
* Responsive user interface
* Laravel REST API integration
* Authentication
* Firebase integration
* Stripe payment integration
* Configurable API URL
* Environment-based configuration
* Production-ready build
* Docker deployment support
* VPS deployment support
* Nginx support
* HTTPS/SSL support

---

## Requirements

### Frontend

Recommended:

* Node.js 20 or newer
* npm 10 or newer
* Modern web browser

### Backend

The frontend requires the PathForge Laravel backend/API.

The backend should have:

* PHP
* Composer
* Database
* Required PHP extensions
* Correct environment configuration

For complete backend requirements and installation instructions, see:

**https://documentation.techtrack.online/**

---

## Package Structure

The frontend project contains the main application source code and configuration files.

```text
pathforge/
├── public/
├── src/
├── .env.example
├── package.json
├── package-lock.json
├── vite.config.*
└── README.md
```

The exact source structure may vary depending on the release version.

---

# Installation

## 1. Extract the Package

Extract the purchased PathForge frontend package to your computer or server.

Open the frontend project directory:

```bash
cd pathforge
```

---

## 2. Install Dependencies

Run:

```bash
npm install
```

This installs all required frontend dependencies.

---

## 3. Create the Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

On Windows, you can manually copy:

```text
.env.example
```

to:

```text
.env
```

---

# Environment Configuration

Open the `.env` file and configure the application.

Example:

```env
VITE_APP_URL=https://your-domain.com
VITE_API_URL=https://your-domain.com/api

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=

VITE_STRIPE_PUBLIC_KEY=
```

## Environment Variables

| Variable                    | Description                    |
| --------------------------- | ------------------------------ |
| `VITE_APP_URL`              | Frontend application URL       |
| `VITE_API_URL`              | Laravel backend API URL        |
| `VITE_FIREBASE_API_KEY`     | Firebase web API key           |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase authentication domain |
| `VITE_FIREBASE_PROJECT_ID`  | Firebase project ID            |
| `VITE_STRIPE_PUBLIC_KEY`    | Stripe publishable key         |

### Example

If your frontend is:

```text
https://example.com
```

and your API is:

```text
https://example.com/api
```

use:

```env
VITE_APP_URL=https://example.com
VITE_API_URL=https://example.com/api
```

> **Important:** After changing Vite environment variables, rebuild the application.

---

# Backend API Configuration

The React frontend communicates with the Laravel backend through:

```env
VITE_API_URL=https://your-domain.com/api
```

For local development:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

For production:

```env
VITE_API_URL=https://your-domain.com/api
```

Make sure:

* The Laravel backend is running.
* The API URL is correct.
* The backend API is accessible.
* CORS is configured correctly.
* HTTPS is correctly configured in production.

Complete Laravel backend installation instructions are available in the online documentation.

---

# Firebase Configuration

If Firebase functionality is enabled in your installation, create/configure your Firebase project and add the required web application values to `.env`.

Example:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
```

Use the Firebase configuration belonging to the customer's own Firebase project.

> Do not include your personal Firebase project credentials in the Envato package.

For detailed Firebase configuration instructions, see:

**https://documentation.techtrack.online/**

---

# Stripe Configuration

If Stripe payments are enabled, configure the Stripe publishable key:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxx
```

For production, use the appropriate production publishable key.

> **Important:** Never place a Stripe secret key (`sk_...`) inside the React frontend.

Stripe secret keys must remain on the Laravel backend/server.

For complete Stripe configuration instructions, see:

**https://documentation.techtrack.online/**

---

# Development

After installing dependencies and configuring `.env`, start the development server:

```bash
npm run dev
```

Vite will display the local URL in the terminal.

Open the displayed URL in your browser.

---

# Production Build

To create a production build:

```bash
npm run build
```

The production files will be generated in:

```text
dist/
```

You can preview the production build using:

```bash
npm run preview
```

---

# Deployment

The React frontend can be deployed using several methods.

## Option 1 – VPS / Nginx

Build the application:

```bash
npm install
npm run build
```

Upload/deploy the generated `dist/` directory to your server and configure Nginx to serve the frontend.

For React routing, your Nginx configuration should support the application's fallback to `index.html`.

Example:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

After changing the Nginx configuration:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Option 2 – Docker

If using the provided Docker deployment configuration, follow the Docker instructions in the online documentation.

Typical Docker commands are:

```bash
docker compose up --build -d
```

Check containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

> Docker configuration may differ between releases. Always follow the Docker instructions included with your purchased version.

---

# Admin Panel

The Laravel backend includes the administration panel.

After installing the backend, administrators can configure application settings from the Admin Panel.

Depending on the installed version, settings may include:

* General application settings
* Mail/SMTP settings
* Payment settings
* Firebase settings
* Other application integrations

## SMTP Configuration

SMTP credentials should be entered by the customer through the Admin Panel.

Example:

```text
Mail Driver: SMTP
Mail Host: smtp.example.com
Mail Username: your-email@example.com
Mail Password: your-password
Mail Port: 587
Mail Encryption: TLS
Mail From Address: your-email@example.com
Mail From Name: PathForge
```

The Envato package must not contain the seller's personal SMTP credentials.

> **Security:** Never distribute real SMTP passwords, API secrets, database passwords, or other private credentials with the product.

---

# Troubleshooting

## Blank Page

If the application displays a blank page:

1. Open the browser developer console.
2. Check for JavaScript errors.
3. Verify the `.env` configuration.
4. Verify `VITE_API_URL`.
5. Confirm the backend is accessible.
6. Rebuild the application.

Run:

```bash
npm run build
```

---

## API Not Working

Check:

```env
VITE_API_URL=https://your-domain.com/api
```

Also verify:

* Laravel backend is running.
* API URL is correct.
* Backend CORS configuration is correct.
* HTTPS is working.
* Authentication configuration is correct.
* Browser console does not show blocked requests.

---

## 404 When Refreshing a Page

If the application works when navigating normally but displays a 404 after refreshing a route, configure your web server to redirect unknown frontend routes to `index.html`.

For Nginx:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## Environment Changes Not Working

Vite environment variables are processed during the build.

After changing `.env`, run:

```bash
npm run build
```

Then redeploy the newly generated `dist/` files.

---

# Documentation

Complete technical documentation is available online:

**PathForge Documentation**

https://documentation.techtrack.online/

The online documentation provides detailed instructions for:

* Laravel backend installation
* React frontend deployment
* Docker deployment
* VPS deployment
* Nginx configuration
* HTTPS/SSL
* Environment configuration
* Database configuration
* Updates
* Troubleshooting

The README is intended as a quick-start guide, while the online documentation provides the complete technical installation and deployment procedures.

---

# Security

Before distributing the product, make sure that no private credentials are included.

Do not distribute:

* SMTP passwords
* Database passwords
* Stripe secret keys
* Private API keys
* Personal access tokens
* Production `.env` files
* Private server credentials

The `.env.example` file should contain placeholders only.

Example:

```env
VITE_API_URL=https://your-domain.com/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_STRIPE_PUBLIC_KEY=
```

---

# Credits

PathForge uses open-source libraries and third-party services.

Please review the project's package/dependency files and the licenses of the respective third-party libraries.

All third-party trademarks and services belong to their respective owners.

---

# Support

For technical support, please use the support channel provided with your Envato purchase.

When contacting support, include:

* PathForge version
* Node.js version
* npm version
* Browser
* Operating system
* Error message
* Screenshot when applicable
* Relevant browser/server logs

### Please do not send:

* Passwords
* SMTP credentials
* Stripe secret keys
* Database credentials
* API secrets
* Private access tokens

---

# Version

**PathForge React Frontend – Version 1.0.0**

Thank you for choosing PathForge.
