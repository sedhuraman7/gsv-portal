# GSV Company Internship Portal

A Full-Stack responsive web application for managing Internship Registration and Administration.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React, Vanilla CSS (Modern UI)
- **Backend**: Next.js API Routes (Node.js)
- **Database**: MongoDB (Mongoose)
- **Authentication**: Custom JWT (Role-Based: Student/Admin)
- **Email**: SMTP (Nodemailer)
- **Data Export**: ExcelJS

## Features
- **Student Portal**: Register/Login, Profile Status, Tasks, Attendance.
- **Admin Portal**: Dashboard Stats, Review Applications (Approve/Reject + Email), Export Data to Excel.
- **Security**: Password hashing, JWT Cookies, Protected Routes.

## Setup Instructions

1. **Install Dependencies** (Already done if using provided environment)
   ```bash
   npm install
   ```

2. **Environment Variables**
   The project uses `.env.local` for configuration. The following are set (defaults):
   - `MONGODB_URI`: `mongodb://127.0.0.1:27017/gsv_internship`
   - `JWT_SECRET`: `supersecretgsvkey2026`
   - `ADMIN_SECRET`: `GSV-ADMIN-2026`
   - `SMTP_HOST`: (Example: smtp.gmail.com) - *Configure regarding your email provider for notifications to work.*

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`

## User Guide

### 1. Admin Registration/Login
- Go to `/register`.
- Select **Admin**.
- Enter Name, Email, Password.
- **Admin Secret Code**: `GSV-ADMIN-2026`
- Once registered, login at `/login`.

### 2. Student Registration
- Go to `/register`.
- Select **Student**.
- Fill details & Upload Resume (PDF).
- Account status will be "Pending".

### 3. Approval Flow
- Login as Admin.
- Go to "Interns" tab.
- Click "Approve" on pending students.
- Values: Student status becomes "Active", Email sent to student.

### 4. Excel Export
- In Admin Dashboard, click "Export Data (Excel)" to download a report of all interns.

## Troubleshooting

### "Registration Not working" (Reg Agala)
If registration fails, check:
1. **Is MongoDB Running?** The app needs a local MongoDB server.
2. **Database Status**: The registration page will show an error if it cannot connect to the DB.
3. **Uploads Folder**: Ensure `public/uploads` directory exists and is writable.

### "Where is the Excel File?"
The Excel file is **generated on demand**. It is NOT saved as a file on the server.
To get it:
1. Login as Admin.
2. Go to **Dashboard**.
3. Click the **Export Data (Excel)** button.
4. The file `interns_data.xlsx` will download to your computer.
