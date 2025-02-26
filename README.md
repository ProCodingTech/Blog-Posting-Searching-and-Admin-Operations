# Blog Posting, Searching, and Admin Operations

## Overview
This is a **Node.js Express-based Blog Management System** that allows users to create, search, and manage blog posts. It includes authentication, admin controls, and a structured database using MongoDB.

## Features
- **User Authentication**: JWT-based login and registration
- **Blog Posting**: Users can create, edit, and delete blogs
- **Search Functionality**: Search for blogs based on keywords
- **Admin Operations**: Admin can manage users and blogs
- **File Uploading**: Supports image and file uploads for blog posts
- **Environment Configuration**: Uses dotenv for managing sensitive data

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (v14+ recommended)
- MongoDB (Local or Cloud)

### Steps to Install & Run
1. Clone the repository or extract the ZIP file.
2. Navigate to the project directory:
   ```sh
   cd blog_project
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Configure environment variables:
   - Rename `.env.example` to `.env` and set up required values.
5. Start the server:
   ```sh
   npm start
   ```

## API Endpoints
### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Blog Management
- `POST /api/blogs/create` - Create a new blog
- `GET /api/blogs` - Retrieve all blogs
- `GET /api/blogs/:id` - Get blog by ID
- `PUT /api/blogs/:id` - Update a blog
- `DELETE /api/blogs/:id` - Delete a blog

### Admin Operations
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete a user

## File Structure
```
📁 blog_project
│── index.js                  # Main server file
│── package.json              # Project dependencies
│── .env                      # Environment variables
│── Controllers/              # Handles API requests
│   ├── AdminController.js    # Admin operations
│   ├── authController.js     # User authentication
│   ├── BlogController.js     # Blog management
│── Models/                   # MongoDB schemas
│   ├── Blog.schema.js        # Blog model
│── Middleware/               # Custom middleware
│── Routes/                   # API route handlers
```

## Contributing
Feel free to contribute by creating issues or submitting pull requests.

## License
This project is open-source and available under the **MIT License**.
