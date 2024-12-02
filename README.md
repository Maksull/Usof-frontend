# USOF Frontend

A modern forum/discussion platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- User authentication and authorization
- Post management (create, read, update, delete)
- Comment system with nested replies
- Like/Dislike functionality
- User profiles with ratings
- Admin dashboard
- Category management
- Responsive design
- Dark mode support
- Internationalization (i18n) support

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Internationalization:** i18next
- **Component Library:** Custom components with Tailwind

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Header/
│   ├── Footer/
│   ├── ErrorModal/
│   ├── MainPage/
│   ├── LoginPage/
│   ├── ProfilePage/
│   └── ...
├── models/
│   ├── User.ts
│   ├── Post.ts
│   ├── Comment.ts
│   ├── Like.ts
│   └── Category.ts
├── services/
│   ├── AuthService.ts
│   └── UsersService.ts
├── utils/
│   └── mapping.ts
├── config.ts
└── App.tsx
```

## 📥 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd usof-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following content:
```env
VITE_BACKEND_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

## ⚙️ Configuration

The project uses a configuration system to manage environment-specific variables:

- `.env` file contains environment-specific variables
- `config.ts` exports a configuration object that can be imported throughout the application
- Environment variables are type-safe and accessed through the config object

Example usage:
```typescript
import config from './config';

// Access backend URL
const apiUrl = config.backendUrl;
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint the codebase

## 💻 Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Environment Variables

The application uses the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_BACKEND_URL | Backend API URL | http://localhost:3000/api |

## 🔐 Authentication

The application uses token-based authentication. The `AuthService` handles:
- Login/Logout
- Session management
- Token refresh
- Session expiration

## 📱 Responsive Design

The application is fully responsive using Tailwind CSS utility classes:
- Mobile-first approach
- Breakpoint system
- Dark mode support

## 🌍 Internationalization

The application supports multiple languages using i18next:
- Language switching
- Translation management
- Fallback language support

## 🔒 Security Features

- Protected routes
- Role-based access control (User/Admin)
- Session management
- Secure password handling

## 🏗️ Build Optimization

The production build is optimized with:
- Code splitting
- Tree shaking
- Vendor chunk splitting
- Minification
- Source map generation (disabled in production)

## 🌐 API Integration

The application communicates with a backend API:
- Base URL configured through environment variables
- Type-safe API requests
- Error handling and response interceptors
- Request/response transformations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
