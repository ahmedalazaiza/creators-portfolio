# Azaiza Gallery ✨

A modern, high-performance creative portfolio and showcase platform for **designers and photographers** — inspired by Behance.

Built with **Vite 6 + React 18, React Router 7, Tailwind CSS v4, Motion, shadcn/ui, and Supabase**.

---

## 🌟 Features

### Public Discovery
- **Explore Feed (`/`)**: Hero showcase with dynamic metrics, featured creators spotlight, interactive category pills, search bar, and 3D responsive project cards grid.
- **Filtering & Sorting**: Filter by creative fields (UI/UX, Branding, Photography, 3D & Motion, Architecture, AI Art), software tools (Figma, Blender, Cinema 4D, etc.), and sort by Curated, Most Appreciated, Trending, or Latest.
- **Global Search (`Cmd+K` / `Ctrl+K`)**: Rapid instant modal to search projects, creators, software tools, and disciplines.
- **Case Study Detail (`/project/:slug`)**: Multi-image high-resolution visual narrative, interactive Lightbox with fullscreen zoom, sticky appreciation bar with heart burst animation, project metadata sidebar, tools used, color palette swatches, and comments thread.
- **Creator Profiles (`/@username` or `/user/:username`)**: Custom panoramic banner, avatar, availability badge, metrics overview, social links, and tabs for published projects, appreciated works, and biography & skills.

### Creator Studio & Dashboard
- **Creator Studio (`/dashboard`)**: Overview statistics (Published Works, Total Appreciations, Impressions), project management table with quick status toggle (Published/Draft), edit shortcuts, and delete modal.
- **Project Editor (`/dashboard/new` & `/dashboard/edit/:id`)**: Full-featured case study publishing suite with multi-image gallery manager, tool tagger, category selector, accent color picker, and live preview.
- **Profile & Portfolio Settings (`/dashboard/settings`)**: Customize bio, headline, avatar, banner, skills, available for work status, and social profiles (Twitter, Dribbble, Behance, LinkedIn, GitHub, Instagram).

### Authentication & Fallback Support
- **Supabase Auth**: Clean integration supporting email signup and login.
- **Zero-Friction Demo Mode**: When Supabase keys are not configured yet, the app seamlessly uses an in-memory & `localStorage` store with pre-populated creator profiles and high-res case studies so you can test all features immediately.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🗄️ Supabase Setup (Optional for Cloud Sync)

1. Create a new project at [Supabase](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard and run the script in [`supabase/schema.sql`](file:///Users/apple/Desktop/behance/supabase/schema.sql).
3. Copy your project credentials into `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your Supabase URL and public anon key:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. Restart Vite dev server (`npm run dev`).

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── AppreciationButton.tsx      # Heart button with burst particle animation
│   │   ├── ConfirmModal.tsx            # Destructive action modal
│   │   ├── CustomCursor.tsx            # Desktop interactive cursor
│   │   ├── FilterBar.tsx               # Category pills, tool selector, sorting
│   │   ├── Footer.tsx                  # Designer platform footer
│   │   ├── Lightbox.tsx                # Fullscreen zoomable image viewer
│   │   ├── Navbar.tsx                  # Responsive header with search trigger & auth
│   │   ├── ProjectCard.tsx             # 3D perspective tilt project card
│   │   ├── ScrollToTopButton.tsx       # Floating back-to-top button
│   │   ├── SearchModal.tsx             # Global Cmd+K search dialog
│   │   ├── ShareModal.tsx              # Share dialog with social shortcuts
│   │   └── ui/                         # Complete shadcn/ui components
│   ├── context/
│   │   └── AuthContext.tsx             # Supabase Auth provider + Demo session switch
│   ├── data/
│   │   ├── categories.ts               # Creative disciplines & popular tools
│   │   └── mockData.ts                 # Creator profiles, case studies & comments
│   ├── hooks/
│   │   ├── useCreator.ts               # Creator profile & follow management hook
│   │   ├── useProjects.ts              # Projects query, filter, sort & CRUD hook
│   │   └── useScrolled.ts              # Scroll spy hook
│   ├── pages/
│   │   ├── AuthPage.tsx                # Sign In & Sign Up with demo accounts
│   │   ├── CreatorProfilePage.tsx      # Public creator portfolio & tabs
│   │   ├── DashboardPage.tsx           # Creator Studio project management
│   │   ├── HomePage.tsx                # Explore feed & featured showcase
│   │   ├── NotFoundPage.tsx            # 404 dead-end experience
│   │   ├── ProjectDetailPage.tsx       # Case study presentation & comments
│   │   ├── ProjectEditorPage.tsx       # Case study builder & image gallery manager
│   │   └── SettingsPage.tsx            # Profile & social customization
│   ├── types/
│   │   └── index.ts                    # TypeScript types
│   └── App.tsx                         # Router, theme provider & transitions
├── lib/
│   └── supabase.ts                     # Supabase client with fallback
├── styles/                             # Theme CSS variables & Typography
└── supabase/
    └── schema.sql                      # Complete Postgres schema with RLS & seeds
```
