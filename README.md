# Notes App

A modern, secure note-taking application built with React and Supabase. Create, edit, and manage your notes with a clean and intuitive interface, all while keeping your data secure with proper authentication.

## ✨ Features

- **User Authentication**
  - Email/password login and registration
  - Google OAuth integration
  - Secure session management

- **Note Management**
  - Create, read, update, and delete notes
  - Timestamps for better organization
  - Clean, responsive UI

- **Security**
  - Row Level Security (RLS) with Supabase
  - User-specific data isolation
  - Secure authentication flows

- **User Experience**
  - Smooth transitions and animations
  - Responsive design for all devices
  - Intuitive error handling

## 🚀 Live Demo

Check out the live demo: [Notes App](https://react-notes-liart.vercel.app/)

## 🛠️ Technologies Used

- **Frontend**
  - React.js
  - CSS3 with custom animations
  - Modern JavaScript (ES6+)

- **Backend**
  - Supabase (Backend as a Service)
  - PostgreSQL database
  - Supabase Auth

- **Deployment**
  - Vercel for frontend hosting
  - Supabase for backend services

## 📋 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Supabase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/notes-app.git
   cd notes-app
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials
   ```
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up your Supabase project
   - Follow the instructions in `SUPABASE_AUTH_SETUP.md`
   - Run the SQL migrations in the `supabase/migrations` folder

5. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

### Supabase Setup

This application uses Supabase for authentication and data storage. To set up your Supabase project:

1. Create a new project on [Supabase](https://supabase.com)
2. Set up authentication providers (Email, Google)
3. Run the SQL migrations from the `supabase/migrations` folder
4. Update your environment variables with your Supabase credentials

Detailed instructions can be found in the `SUPABASE_AUTH_SETUP.md` file.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Supabase](https://supabase.com) for the amazing BaaS platform
- [React](https://reactjs.org) for the frontend library
- [Vercel](https://vercel.com) for hosting

---

Made with ❤️ by [Your Name]
