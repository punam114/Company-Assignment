# Students Table - React Vite Application

A frontend-only React application built with Vite for managing student records with full CRUD operations.

## Features

- ✅ Student List with Name, Email, Age, and Actions columns
- ✅ Add Student with form validation (all fields mandatory, valid email format)
- ✅ Edit Student with pre-filled data and validation
- ✅ Delete Student with confirmation dialog
- ✅ Simulated loading state for operations
- ✅ Excel download functionality for student data

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Build for Production

```bash
npm run build
```

## Technologies

- React 18
- Vite
- XLSX library for Excel export
- In-memory state management (no backend required)
