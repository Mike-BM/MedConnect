# MediConnect - Full-Stack Healthcare Management System

A comprehensive healthcare management platform built with React, TypeScript, and Supabase. MediConnect provides appointment booking, medical symptom analysis, and healthcare facility management in a modern, user-friendly interface.

🌐 **Live Demo**: [https://mediconnect-full-sta-iiio.bolt.host](https://mediconnect-full-sta-iiio.bolt.host)

## 🏥 Features

### Core Functionality
- **Patient Management**: Complete patient registration and profile management
- **Appointment Booking**: Real-time appointment scheduling with doctors
- **Medical Symptom Checker**: AI-powered symptom analysis and recommendations
- **Hospital Management**: CRUD operations for healthcare facilities
- **Doctor Management**: Comprehensive doctor profiles and availability tracking
- **Dashboard Analytics**: Real-time statistics and activity tracking

### Technical Features
- **Authentication**: Secure user authentication with Supabase Auth
- **Real-time Updates**: Live data synchronization across all components
- **Responsive Design**: Mobile-first design that works on all devices
- **Role-based Access**: Different access levels for patients and healthcare providers
- **Data Security**: Row-level security policies for data protection

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mediconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Set up the database**
   - Run the SQL migrations in your Supabase SQL editor
   - The migrations are located in `supabase/migrations/`

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

### Database Schema
```sql
-- Core tables with relationships
hospitals (1) ──< doctors (1) ──< appointments >── (1) patients
                                                  │
                                                  └── (1) auth.users
```

### Key Components
- **AuthContext**: Manages user authentication state
- **Dashboard**: Central hub with statistics and quick actions  
- **AppointmentForm**: Dynamic form for booking/editing appointments
- **SymptomChecker**: Medical recommendation engine
- **PatientProfile**: User profile management
- **Hospital/DoctorManagement**: Administrative interfaces

### Security Model
- Row Level Security (RLS) enabled on all tables
- Users can only access their own patient data
- Public read access for hospitals and doctors
- Authenticated write access for administrative functions

## 📱 User Interface

### Design System
- **Colors**: Medical blue (#0ea5e9), trustworthy green (#10b981), clean whites
- **Typography**: System fonts for reliability and accessibility
- **Components**: Card-based layouts with subtle shadows and smooth transitions
- **Responsive**: Mobile-first approach with breakpoints for all screen sizes

### Key Pages
- **Login/Register**: Secure authentication flow
- **Dashboard**: Overview with stats, quick actions, and health tips
- **Appointments**: Full appointment lifecycle management
- **Symptom Checker**: Interactive medical consultation tool
- **Profile**: Personal and medical information management
- **Admin**: Hospital and doctor management interfaces

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── AppointmentForm.tsx
│   ├── AppointmentStats.tsx
│   ├── DoctorForm.tsx
│   ├── HealthTips.tsx
│   ├── HospitalForm.tsx
│   ├── Navbar.tsx
│   ├── PatientProfile.tsx
│   └── RecentActivity.tsx
├── pages/              # Main application pages
│   ├── Appointments.tsx
│   ├── Dashboard.tsx
│   ├── DoctorManagement.tsx
│   ├── HospitalManagement.tsx
│   ├── Login.tsx
│   ├── Profile.tsx
│   ├── Register.tsx
│   └── SymptomChecker.tsx
├── contexts/           # React contexts (Auth, etc.)
│   └── AuthContext.tsx
├── lib/                # Utilities and configurations
│   └── supabase.ts
├── types/              # TypeScript type definitions
│   └── database.ts
└── styles/             # Global styles and Tailwind config
    └── index.css
```

### Database Migrations
Located in `supabase/migrations/`:
- Core database schema with hospitals, doctors, patients, and appointments
- Row Level Security policies for data protection
- Sample data for development and testing

## 🚀 Deployment

The application is deployed on Bolt Hosting and ready for production use.

**Live URL**: [https://mediconnect-full-sta-iiio.bolt.host](https://mediconnect-full-sta-iiio.bolt.host)

### Environment Variables Needed
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Deployment Platforms
The application can be deployed on:
- **Bolt Hosting** (current deployment)
- **Netlify**
- **Vercel** 
- **Railway**
- **Render**

## 🔐 Security Features

### Authentication
- Email/password authentication via Supabase Auth
- Secure session management
- Password reset functionality
- Email confirmation (configurable)

### Data Protection
- Row Level Security (RLS) on all database tables
- User-specific data access controls
- Secure API endpoints
- Input validation and sanitization

### Privacy
- HIPAA-compliant data handling practices
- Encrypted data transmission
- Secure storage of medical information
- User consent management

## 📊 Database Schema Details

### Tables

#### `hospitals`
- `id` (UUID, Primary Key)
- `name` (Text, Required)
- `location` (Text, Required)
- `departments` (Text Array)
- `created_at` (Timestamp)

#### `doctors`
- `id` (UUID, Primary Key)
- `hospital_id` (UUID, Foreign Key → hospitals.id)
- `name` (Text, Required)
- `specialization` (Text, Required)
- `availability` (Text Array)
- `created_at` (Timestamp)

#### `patients`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → auth.users.id)
- `name` (Text, Required)
- `contact_info` (Text, Required)
- `medical_history` (Text)
- `created_at` (Timestamp)

#### `appointments`
- `id` (UUID, Primary Key)
- `patient_id` (UUID, Foreign Key → patients.id)
- `doctor_id` (UUID, Foreign Key → doctors.id)
- `date` (Date, Required)
- `time` (Time, Required)
- `status` (Enum: scheduled, confirmed, completed, cancelled)
- `created_at` (Timestamp)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add appropriate loading states
- Ensure responsive design
- Write meaningful commit messages

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the code comments
- Review the component examples in `/src/components`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

- **Telemedicine**: Video consultation integration
- **Prescription Management**: Digital prescription system
- **Insurance Integration**: Insurance verification and claims
- **Mobile App**: React Native companion app
- **AI Diagnostics**: Advanced AI-powered medical analysis
- **Multi-language**: Internationalization support
- **Wearable Integration**: Health device data synchronization
- **Appointment Reminders**: SMS/Email notification system

## 🏆 Acknowledgments

- Built with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- Database and authentication powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Deployed on [Bolt Hosting](https://bolt.new/)

---

**Built with ❤️ for better healthcare accessibility and management.**

For more information, visit the live application: [https://mediconnect-full-sta-iiio.bolt.host](https://mediconnect-full-sta-iiio.bolt.host)