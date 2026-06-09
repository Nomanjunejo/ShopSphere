# ShopSphere 🛒

ShopSphere is a modern, production-ready full-stack e-commerce platform built to deliver a fast, responsive shopping experience. The application features dynamic product management, a sleek user interface, serverless cloud data persistence, and an integrated AI engine for smart product insights.

## 🚀 Live Demo
- **Frontend Deployment:** [https://shop-sphere-five-azure.vercel.app/]
- 

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework:** React.js (Functional components & Hooks)
- **Styling:** Tailwind CSS (Fully responsive, mobile-first layouts)
- **Deployment:** Vercel

### Backend & AI
- **Framework:** FastAPI (Python) - High-performance, asynchronous REST API architecture
- **AI Integration:** Hugging Face API (Utilized for automated product descriptions / metadata generation)

### Database & Infrastructure
- **Database:** Neon (Serverless PostgreSQL cloud database instance)
- **Version Control:** Git & GitHub fully tracked workflow

---

## ✨ Key Features

- **Dynamic Product Catalog:** Seamless data fetching from the database to render real-time product listings, categories, and inventory.
- **Responsive Shopping UI:** A modular shopping cart experience built with React state management and styled for desktop, tablet, and mobile displays using Tailwind CSS.
- **AI-Powered Product Insights:** Integration with **Hugging Face models** to automate or enrich product text processing and metadata generation.
- **Cloud-Native Data:** Powered by **Neon Serverless Postgres** to handle instant scaling, relational constraints, and highly efficient connection pooling.
- **Fully Documented API:** Self-documenting backend endpoints via FastAPI's built-in Swagger UI (`/docs`).

---

## 📁 Project Structure

```text
shopsphere/
├── backend/
│   ├── main.py            # FastAPI application entrypoint
│   ├── config.py          # Environment variables & DB connection configs
│   ├── models.py          # PostgreSQL schemas & database models
│   └── requirements.txt   # Python dependencies
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI components (Navbar, ProductCard, Cart)
    │   ├── App.jsx        # Main application routing & state wrapper
    │   └── index.css      # Tailwind CSS configuration imports
    ├── package.json       # Frontend dependencies
    └── vercel.json        # Deployment optimization configs
