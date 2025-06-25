# Lead Nurturing Backend

A Node.js/Express backend for managing leads, communications, and recent activities, with automated status updates and admin authentication.

## Features

- **Lead Management**: Create, update, delete, search, and fetch leads. Tracks last contact date and status (`engaged`, `dormant`, `unresponsive`).
- **Communication Logging**: Log and retrieve communications (email, WhatsApp) with leads.
- **Automated Status Updates**: Cron job updates lead statuses based on last contact.
- **Recent Activity Tracking**: Logs status changes and communications.
- **Admin Authentication**: JWT-based login for admin users.
- **Email/WhatsApp Integration**: Send templated messages to leads.
- **RESTful API**: Well-structured endpoints for all resources.
- **Docker Support**: Easily run the app in a container.

## Tech Stack

- Node.js, Express
- MongoDB (via Mongoose)
- JWT for authentication
- Nodemailer for email
- node-cron for scheduled jobs
- Docker
- GitHub Actions

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance
- (Optional) Docker

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VaibhavYadavAntino/LeadNuturingBackend.git
   cd LeadNuturingBackend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   DEFAULT_ADMIN_EMAIL=<admin-email>
   DEFAULT_ADMIN_PASSWORD=<admin-password>
   EMAIL_USER=<your-email-address>
   EMAIL_PASS=<your-app-password>
   NODE_ENV=development
   ```

### Running the App

- Development mode (with nodemon):
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```
- Docker:
  ```bash
  docker build -t lead-nurturing-backend .
  docker run -p 5000:5000 --env-file .env lead-nurturing-backend
  ```

## API Endpoints

### Auth

- `POST /api/auth/login` — Admin login

### Leads

- `POST /api/leads` — Create lead
- `GET /api/leads` — Get all leads
- `GET /api/leads/:id` — Get lead by ID
- `PUT /api/leads/:id` — Update lead
- `DELETE /api/leads/:id` — Delete lead
- `GET /api/leads/search?query=...` — Search leads
- `GET /api/leads/stats/count` — Get lead stats
- `GET /api/leads/inactive-30days` — Leads inactive for 30 days
- `GET /api/leads/inactive-30days/count` — Count of such leads

### Communications

- `POST /api/communications` — Log communication
- `GET /api/communications` — Get all logs
- `GET /api/communications/:id` — Get log by ID
- `PUT /api/communications/:id` — Update log
- `DELETE /api/communications/:id` — Delete log
- `POST /api/communications/send-email` — Send email to lead
- `POST /api/communications/send-whatsapp` — Send WhatsApp to lead

### Recent Activity

- `GET /api/recent-activity` — Get recent activities

### Health Check

- `GET /health` — API status
Response:
```json
{
  "status": "UP",
  "uptime": "API is working fine!"
}
```

## Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT tokens
- `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_PASSWORD`: Initial admin credentials
- `EMAIL_USER`, `EMAIL_PASS`: Email credentials for Nodemailer

## Contribution

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/foo`)
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

ISC

