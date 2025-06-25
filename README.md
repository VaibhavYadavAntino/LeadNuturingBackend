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
## 🚀 CI/CD

This project uses **GitHub Actions** for Continuous Integration and Continuous Deployment (CI/CD) to automate the build, push, and deployment of the Node.js backend.

### ⚙️ CI/CD Pipeline Flow

1. **Trigger**: The workflow is triggered on every push to the `dev` branch.
2. **Build**:
   - Checks out the latest source code.
   - Logs in to Docker Hub using GitHub Secrets.
   - Builds the Docker image of the backend.
   - Pushes the image to Docker Hub: `vaibhavyadav350/leadnuturingbackend`.
3. **Deploy**:
   - A self-hosted GitHub Actions runner running on an EC2 instance pulls the latest Docker image.
   - Deletes any existing Docker container.
   - Recreates and starts the container with the latest image.
   - Loads environment variables from a `.env` file securely passed as a GitHub Secret (`ENV_FILE`).
   
### 🏃 Self-Hosted GitHub Actions Runner

A **self-hosted runner** is configured on an EC2 instance to allow GitHub Actions to deploy directly to the server.

#### 🧩 Setup Summary:

- EC2 instance is based on Ubuntu.
- `docker` and `node` are installed on the instance.
- A GitHub Actions runner is installed and registered:
  ```bash
  ./config.sh --url https://github.com/VaibhavYadavAntino/LeadNuturingBackend --token YOUR_TOKEN
  ./run.sh

### 📁 Key Files

- `.github/workflows/CICD.yml`: GitHub Actions workflow configuration file.
- `Dockerfile`: Used to build the Docker image.
- `.env`: Environment variables (not stored in the repo; passed through secrets).

### 🖥️ EC2 Configuration

- EC2 instance acts as a self-hosted runner registered with GitHub.
- Docker is installed and running.
- Port `5000` is open in the security group for HTTP traffic.
- (Optional) Nginx can be used to route traffic and enable HTTPS (port `443`).

### 🔐 Required GitHub Secrets

| Secret Name        | Description                         |
|--------------------|-------------------------------------|
| `DOCKER_USERNAME`  | Your Docker Hub username            |
| `DOCKER_PASSWORD`  | Your Docker Hub password/token      |
| `ENV_FILE`         | Contents of your `.env` file        |

> Make sure to keep these secrets secure and never commit sensitive information to the repository.


## Contribution

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/foo`)
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

ISC

