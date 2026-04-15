# Sri Anveeksha Public School - Web Application

A modern, full-stack, comprehensive school management portal and landing page built to digitize and streamline the administrative and collaborative efforts of Sri Anveeksha Public School. The platform serves as both a beautifully animated public-facing website and a deeply integrated internal management tool.

## 🚀 Tech Stack

**Frontend Architecture:**
- **React (v18+)** - Core UI library
- **TypeScript** - Strongly typed Javascript for maximum maintainability and safety
- **Vite** - Lightning fast development and build tool
- **Tailwind CSS** - Utility-first styling framework driving the application's entire custom design system
- **React Router (v6)** - Client-side dynamic nested routing
- **Framer Motion** - Delivering fluid, physics-based scroll animations and UI transitions
- **Lucide React** - Clean, modern vector icons for UI components
- **Sonner** - Elevated toast notifications

**Backend Architecture:**
- **Supabase** - Managed open-source Firebase alternative serving as the application backbone
- **PostgreSQL** - Relational database containing complex schemas for students, marks, attendance, configuration, and inquiries
- **Row Level Security (RLS)** - Robust database security securing data separation between admins, staff, and parents
- **Supabase Auth** - Native edge-based authentication handling role-based sign-ins

## 🔑 Core Features & Portals

### 1. The Marketing Landing Page
A dynamic, story-driven, fully responsive marketing landing page designed with rich aesthetics (deep navy and gold). 
- Animated Hero, About Us, Curriculum, Facilities, and Sports sections.
- Embedded Admissions flow and dynamic Google Maps integrations.
- Globally Linked Settings: Real-time syncing with backend configurations (such as contact info, footers, and active academic years).

### 2. Administrator Portal (`/admin/*`)
A robust command center accessible only by users with explicit admin privileges. 
- **Student Data Management:** Full CRUD operations for creating, editing, and mapping student data.
- **Attendance Board:** Track and report granular session-based daily attendance.
- **Mark & Grade Sheets:** Issue exam marks dynamically.
- **Global Settings Control:** Control the global academic year schedules, configure website contact metadata, and post live announcements to parents.
- **Finance & Fee Processing:** Track tuitions and outstanding balances.

### 3. Parent Portal (`/parent/*`)
A secure interface providing parents with complete lifecycle visibility over their child's academic journey.
- **Student Dashboard:** Track latest attendance inputs, academic remarks, and grade sheets in real-time.
- **Live Circulars:** Instantly receive secure school-wide and class-specific announcements directly from the principal.
- **Certificate Requests:** Seamless integrations to rapidly request Bonafide/Study certificates natively.

## 🛠 Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed along with `npm`. 
You will also need an active [Supabase](https://supabase.com) project.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/sri-anveeksha-school.git
cd sri-anveeksha-school
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file at the root of the project with your Supabase credentials:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-public-anon-key
```

### 4. Start the Application
To run the local development server:
```bash
npm run dev
```

### 5. Build for Production
To generate a production-ready optimized build:
```bash
npm run build
```

---
*Built with ❤️ for Sri Anveeksha Public School.*
