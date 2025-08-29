# MediConnect - Full-Stack Health Application

A comprehensive healthcare management system built with React, TypeScript, and Supabase. MediConnect provides appointment booking, medical recommendations, and healthcare facility management in a modern, user-friendly interface.

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
   - Click "Connect to Supabase" in the application to configure

4. **Start the development server**
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
├── pages/              # Main application pages
├── contexts/           # React contexts (Auth, etc.)
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
└── styles/             # Global styles and Tailwind config
```

### Database Migrations
Located in `supabase/migrations/`:
- `create_mediconnect_schema.sql` - Core database schema
- `seed_sample_data.sql` - Sample data for development

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Netlify** (recommended)
- **Vercel** 
- **Railway**
- **Render**

Environment variables needed:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `/docs` folder
- Review the component examples in `/src/components`

## 🔮 Future Enhancements

- **Telemedicine**: Video consultation integration
- **Prescription Management**: Digital prescription system
- **Insurance Integration**: Insurance verification and claims
- **Mobile App**: React Native companion app
- **AI Diagnostics**: Advanced AI-powered medical analysis
- **Multi-language**: Internationalization support

---

Built with ❤️ for better healthcare accessibility and management.