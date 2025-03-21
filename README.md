npm install
npm run dev
VITE_AWS_ACCESS_KEY_ID=your_access_key_id
VITE_AWS_SECRET_ACCESS_KEY=your_secret_access_key
VITE_AWS_REGION=your_aws_region
VITE_S3_BUCKET=your_bucket_name
https://incomparable-speculoos-66f2b9.netlify.app
We are building a simple web application that allows users to securely upload and manage images. The app will feature user authentication, integration with Amazon S3 for image storage, and an AI feature that can analyze images using ChatGPT.
1.1 Technology Stack
Frontend: Vite with TypeScript React
Backend: Python Flask
Database: PostgreSQL
File Storage: Amazon S3
AI Integration: ChatGPT API
2. System Architecture
2.1 Frontend (Vite with TypeScript)
A simple web interface for users to interact with.
Uses API to communicate with the backend.
2.2 Backend (Python)
API built in Python to handle core functions like user authentication, image uploads, and database interactions.
Integrates with Amazon S3 for storing images.
2.3 Database (PostgreSQL)
Stores user information and metadata related to the images (e.g., upload date, file name).
2.4 File Storage (Amazon S3)
Secure cloud storage for user-uploaded images.
2.5 AI Integration 
Optionally integrates with the ChatGPT API to analyze images and generate AI descriptions.
3. Core Features
3.1 User Authentication
Users can register, log in, and log out.
Secure password handling.
3.2 Image Management
Users can upload images to an Amazon S3 bucket.
Users can view a list of their uploaded images.
Display images on the user dashboard.
3.3 AI Image Analysis (Optional)
If implemented, AI-generated descriptions of images will be displayed using ChatGPT.
4. API Requirements
Endpoints to handle user authentication, image upload, and image retrieval.
Ensure all API endpoints are secure, requiring authentication for access.
5. Database Design
Store user account details and login credentials.
Store image metadata, such as the file name and upload time, linked to user accounts.
6. Security
Use HTTPS for secure communication.
Ensure secure password handling for user authentication.
Implement proper access controls for the S3 bucket so that only the image owner can access their images.
