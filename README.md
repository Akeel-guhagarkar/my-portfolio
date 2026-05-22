# Akeel Guhagarkar — Personal Portfolio

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)

Welcome to my personal portfolio repository! This is a modern, highly refined, and responsive single-page portfolio website tailored to showcase my skills, projects, achievements, and professional timeline. 

The website is designed with a premium **minimalist sand-beige aesthetic**, blending warm mid-century editorial typography with precise, futuristic technical elements. It stands as a physical manifestation of my engineering philosophy: **"Bridging physical circuitry with intelligent software logic."**

---

## ✨ Design & Visual Philosophy

This portfolio is not just a resume; it is a design artifact reflecting an analytical mind balanced with artistic craftsmanship:
* **The Palette**: Tailored sand-beige tone gradients (`#dfd5c6`, `#c5a880`) paired with elegant charcoal offsets and organic dark-mode variations.
* **Typography**: Clean, geometric **Outfit** for structural headings and technical data, contrasted with classical, elegant **Playfair Display (italic)** for organic accents.
* **Micro-interactions**:
  * **Interactive Cursor Glow**: A custom glassmorphic cursor radial glow that subtly follows the user's cursor across the canvas.
  * **Live Typing Effect**: Smooth dynamic typing loop highlighting my key engineering and leadership roles.
  * **Theme Toggle**: Perfectly calibrated light-to-dark transition using specialized HSL color maps.
  * **Scroll-Driven Reveals**: Fluid entry animations when navigating section-by-section.

---

## 🛠️ Tech Stack

* **Core Structure & Logic**: Semantically structured HTML5 & modular, lightweight ES6+ Vanilla JavaScript.
* **Styling & Layout**: Handcrafted Vanilla CSS utilizing advanced Flexbox/Grid systems, transition layers, and responsive breakpoint design. (Zero heavy third-party frameworks like Bootstrap or Tailwind, ensuring sub-second load times and infinite design granularity).
* **Icons**: [Lucide Icons](https://lucide.dev/) for crisp, scalable SVG icons.
* **Web Server**: Minimalist node server integration via `serve` for testing local deployments.

---

## 📁 Repository Structure

```text
my-portfolio/
├── assets/
│   ├── images/
│   │   ├── profile.png     # Professional portrait (Hero section)
│   │   ├── work.jpg        # About Me context image
│   │   └── contact.jpg     # Contact avatar
│   └── resume.pdf          # Downloadable offline resume
├── index.html              # Main webpage and layout structure
├── index.css               # Design tokens, variables, typography, and styles
├── index.js                # Interactive states, filter, typing, and reveals
├── package.json            # Scripts and metadata
├── .gitignore              # Ignored files (node_modules, system metadata)
└── README.md               # Repository documentation (This file)
```

---

## 🚀 Getting Started

### Prerequisites

To run this site locally, ensure you have [Node.js](https://nodejs.org/) installed.

### Installation & Local Run

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/Akeel-guhagarkar/my-portfolio.git
   cd my-portfolio
   ```

2. Install dependencies (only required for local server testing):
   ```bash
   npm install
   ```

3. Spin up the dev server:
   ```bash
   npm run dev
   ```
   *Your browser will launch the portfolio, usually on [http://localhost:3000](http://localhost:3000) or [http://localhost:5000](http://localhost:5000).*

---

## 🎖️ About the Engineer

I am an **Electrical Engineering student** at the *Finolex Academy of Management & Technology (FAMT)*, Ratnagiri, specializing in embedded systems, IoT architecture, and computer-vision-driven biometrics. 

### Key Highlights:
* **Patent Co-applicant**: Co-designed and registered a patent-pending *Smart Attendance System with Biometrics and Face Recognition* (Application No: 461354-001).
* **MTDC 1st Prize Winner**: Recipient of the state-level drawing award for spatial composition and architectural rendering—a testament to my attention to visual detail.
* **BIS Chapter Coordinator**: Active student lead driving technical quality standards under the Bureau of Indian Standards (BIS).

---

## 🎨 Gallery and Category Filters

The portfolio includes an interactive project showcase where users can filter creations dynamically across:
1. **Automation** (Closed-loop conveyors, custom sensor gates)
2. **AIML** (Facial recognition databases, OpenCV tracking)
3. **IoT & Embedded Systems** (Telemetry networks, MQTT, ESP32 nodes)
4. **Hardware & Solar** (Dual-axis solar tracking, photoresistor control arrays)

---

## 📡 Deployment

This portfolio is statically self-contained, making it incredibly easy to deploy:
* **GitHub Pages**: Go to **Settings > Pages** in this repository, choose the `main` branch, and click save. Your portfolio will live at `https://Akeel-guhagarkar.github.io/my-portfolio/`.
* **Vercel / Netlify**: Simply link your GitHub account, select this repository, and hit **Deploy** (No build command required!).

---

*Handcrafted with care and precision by [Akeel Guhagarkar](https://www.linkedin.com/in/akeel-guhagarkar-b37b25315).*
