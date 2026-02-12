# Worko - Candidate Referral System

Worko is a premium, modern candidate referral management system designed for seamless recruitment tracking. It features a high-end UI/UX built with Vanilla CSS, a robust Node.js/Express backend, and a searchable candidate dashboard with real-time analytics.

---

## 🚀 Features

### 🔐 Authentication System
- **Secure Login & Signup**: JWT-based authentication with bcrypt password hashing.
- **Protected Routes**: Ensuring only authenticated users can access the dashboard and add candidates.
- **Premium UI**: Glassmorphic cards with floating background animations.

### 📊 Candidate Dashboard
- **Real-time Stats Overview**: Instant visibility into Total, Pending, Reviewed, and Hired candidates.
- **Dynamic Search**: Filter candidates by name, job title, or status instantly.
- **Pipeline Management**: Effortlessly update candidate statuses through localized dropdowns.
- **Detailed Insights**: View candidate contact information and job roles at a glance.

### ➕ Candidate Management
- **Structured Form**: Add candidates with Name, Email, Phone, and Job Title.
- **Resume Upload**: Integrated PDF upload functionality for candidate profiles.
- **Validation**: Client-side and server-side validation for data integrity.

### 🎨 Visual Excellence (UI/UX)
- **Vanilla CSS Design System**: Zero utility-class overhead, fully custom premium design.
- **Aesthetics**: Glassmorphism, abstract blob animations, and smooth transitions.
- **Typography**: Uses the modern 'Outfit' Google Font for a professional SaaS feel.
- **Responsive**: Fully optimized for Desktop, Tablet, and Mobile screens.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- React Router DOM
- Axios
- Vanilla CSS (Custom Design System)

**Backend:**
- Node.js & Express
- MongoDB (Mongoose ODM)
- JWT (JSON Web Tokens) for Auth
- Multer (File Uploads)
- Bcrypt (Password Hashing)

---

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (Local or Atlas instance)
- **npm** or **yarn**

---

## 💻 Local Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/punam114/Company-Assignment.git
cd Company-Assignment/Worko.ai
```

### 2. Backend Configuration
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Run the backend server:
```bash
npm run dev
```

### 3. Frontend Configuration
```bash
cd ../client
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🧠 Assumptions & Limitations

- **Storage**: Currently, resumes are stored locally in the `server/uploads` folder. In a production environment, this would be replaced with a cloud storage provider like AWS S3 or Cloudinary.
- **Database**: Assumes a MongoDB instance is accessible via the provided URI in the environment variables.
- **Authentication**: JWT tokens are stored in `localStorage` for session persistence.
- **File Types**: The system currently prioritizes PDF uploads for resumes for consistency.

---

## 📂 Project Structure

```
Worko.ai/
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI (Navbar, CandidateCard)
│   │   ├── pages/         # Page components (Login, Signup, Dashboard, Add)
│   │   ├── services/      # API axios instance
│   │   ├── App.css        # Global design system & animations
│   │   └── index.css      # Base styles & CSS variables
├── server/                # Express Backend
│   ├── config/            # DB & Auth configs
│   ├── controllers/       # Business logic for Auth & Candidates
│   ├── models/            # Mongoose Schemas (User, Candidate)
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth & File upload handlers
│   └── uploads/           # Local resume storage
```

---

## 📧 Support
For any queries or assistance, feel free to reach out.

Developed by **Punam Prajapati**
