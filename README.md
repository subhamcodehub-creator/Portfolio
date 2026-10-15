# ⚡ Subham Ghosh — Personal Portfolio Website

[![Portfolio](https://img.shields.io/badge/Portfolio-Live_Site-FF5E36?style=for-the-badge&logo=googlechrome&logoColor=white)](https://github.com/subhamcodehub-creator/Portfolio)
[![IIT Madras](https://img.shields.io/badge/IIT_Madras-Data_Science-10B981?style=for-the-badge&logo=academia&logoColor=white)](https://www.iitm.ac.in/)
[![Supabase Backend](https://img.shields.io/badge/Backend-Supabase_Cloud-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-8B5CF6?style=for-the-badge)](LICENSE)

A modern, cinematic, high-performance personal portfolio built for **Subham Ghosh**, Developer & Data Science Enthusiast at **IIT Madras**. 

Featuring a fixed **240-frame 60 FPS Canvas Scroll Scrub Engine**, responsive glassmorphic interfaces, interactive project carousels, instant email commissioning tiers, and a real-time **Supabase cloud database backend** for client inquiries.

---

## ✨ Key Features

* **🎞️ 60 FPS Canvas Scroll Scrubbing:** 240 pre-rendered cinematic frames dynamically synchronized with scroll position using HTML5 Canvas, sub-pixel interpolation (LERP damping), and Lenis smooth scrolling.
* **☁️ Cloud Backend with Supabase:** Client inquiries submitted via the interactive scaling application form are stored in real-time in a Supabase PostgreSQL database protected by Row Level Security (RLS).
* **💻 Interactive Showcase:** Swipable, snap-scrolling carousel showcasing real-world projects with deep-dive technical stacks, links, and impact summaries.
* **📬 Direct Email Project Commissioning:** Pre-formatted commission tiers (Web Apps, AI/ML Predictive Models, Full-Stack Architecture) with one-click email composition and clipboard integration.
* **🎨 Premium Glassmorphic Aesthetic:** Hand-crafted CSS design system featuring translucent frosted glass, vibrant gradients, micro-animations, and responsive layouts across Desktop, Tablet, and Mobile.
* **⚡ 100% Zero-Heavy-Framework Footprint:** Ultra-fast vanilla HTML5, CSS3, and modern JavaScript for maximum runtime performance and 95+ Google Lighthouse scores.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Core** | HTML5, Modern Vanilla JavaScript (ES6+), CSS3 Variables & Flexbox/Grid |
| **Animation & Motion** | HTML5 Canvas 2D Context API, RequestAnimationFrame, Lenis Smooth Scroll |
| **Backend & Database** | [Supabase](https://supabase.com) (PostgreSQL, Supabase JS SDK, Realtime REST API, Row Level Security) |
| **Typography** | Google Fonts (*Plus Jakarta Sans*, *Outfit*, *Caveat*, *Syne*, *Space Grotesk*) |
| **Local Development** | Node.js HTTP Server (`server.js`) |

---

## 📂 Project Architecture

```plaintext
Portfolio/
├── assets/                  # Project preview cards, phone mockups & client avatars
│   ├── iphone-bistro.jpg
│   ├── iphone-iitmadras.jpg
│   ├── iphone-landslide.jpg
│   ├── project-card-01.jpg ... 05.jpg
│   └── review-avatar-1.jpg ... 06.jpg
├── frames/                  # 240 high-definition canvas scroll video frames (ezgif-frame-*.jpg)
├── app.js                   # Canvas renderer, LERP scroll physics & Supabase submission logic
├── index.html               # Main portfolio markup & semantic SEO structure
├── lenis.min.js             # Lenis smooth scrolling library
├── package.json             # Node.js project manifest & scripts
├── server.js                # Lightweight local development server
├── style.css                # Complete responsive design system & glassmorphic styles
├── .gitignore               # Ignored dependencies & build artifacts
└── README.md                # Project documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (version 16 or newer installed)
* Git

### Installation & Launch

1. **Clone the repository:**
   ```bash
   git clone https://github.com/subhamcodehub-creator/Portfolio.git
   cd Portfolio
   ```

2. **Start the local development server:**
   ```bash
   npm start
   # or
   node server.js
   ```

3. **Open the site:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🗄️ Supabase Backend Setup

The portfolio's inquiry form is connected directly to a Supabase Postgres instance. The database schema and RLS policies are structured as follows:

```sql
-- Create Inquiries Table
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  scaling_challenge TEXT,
  annual_revenue TEXT,
  business_tenure TEXT,
  marketing_spend TEXT,
  paid_ads TEXT,
  status TEXT DEFAULT 'new'
);

-- Enable Row Level Security (RLS)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors to submit inquiries
CREATE POLICY "Allow anonymous inquiries insert" 
ON inquiries FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated reads to protect user submissions
CREATE POLICY "Allow authenticated read" 
ON inquiries FOR SELECT TO authenticated USING (true);
```

---

## 📬 Contact & Connect

* **Developer:** Subham Ghosh (Student at IIT Madras)
* **Email:** [subham.codehub@gmail.com](mailto:subham.codehub@gmail.com)
* **GitHub:** [@subhamcodehub-creator](https://github.com/subhamcodehub-creator)
* **LinkedIn:** [Subham Ghosh](https://www.linkedin.com/in/subham-ghosh-601753424/)
* **Instagram:** [@subham.codehub](https://www.instagram.com/subham.codehub/)
* **Location:** Kolkata, India (Available Worldwide for Remote Projects)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
