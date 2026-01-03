# 🌾 DalagHub - Agricultural Marketplace

DalagHub is a mobile-first Progressive Web App (PWA) that connects Somali farmers and livestock owners with buyers, traders, restaurants, and exporters.

## 📱 Overview

DalagHub is an agricultural marketplace designed for simplicity. The MVP focuses on **product listing + easy contact** rather than full e-commerce functionality. Sellers list their products, and buyers contact them directly via WhatsApp or phone call.

## 👥 Target Users

- **Sellers**: Farmers & Livestock owners
- **Buyers**: Traders, restaurants, exporters

## ✨ Core Features

### For Sellers
- Add agricultural products with photos, descriptions, and pricing
- Manage product listings (mark as sold, delete)
- Receive inquiries via WhatsApp or phone call

### For Buyers
- Browse product listings by category
- Search for specific products
- Contact sellers directly via WhatsApp or phone call
- View seller location and product details

## 🧺 Product Categories

### Crops
- Maize
- Sorghum
- Rice
- Banana
- Sesame

### Livestock
- Camel
- Cow
- Goat
- Sheep

## 📸 Screenshots

### Landing Page
![Landing Page](public/screenshots/landing.png)

### Home Page - Product Listings
![Home Page](public/screenshots/home.png)

### Authentication
![Auth Page](public/screenshots/auth.png)

### Add Product
![Add Product](public/screenshots/add-product.png)

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **Backend**: Supabase (via Lovable Cloud)
  - Authentication (Email/Password)
  - PostgreSQL Database
  - File Storage for product images
- **PWA**: vite-plugin-pwa for offline support

## 🚀 Getting Started

### Prerequisites
- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📂 Project Structure

```
src/
├── assets/           # Images and static assets
├── components/
│   ├── layout/       # App layout, navigation
│   ├── products/     # Product cards, search, filters
│   └── ui/           # shadcn/ui components
├── contexts/
│   ├── AuthContext   # User authentication state
│   └── ProductContext# Product data management
├── hooks/            # Custom React hooks
├── pages/
│   ├── Landing       # Welcome page
│   ├── Auth          # Login/Register
│   ├── Home          # Product listings
│   ├── Search        # Search products
│   ├── AddProduct    # Create new listing
│   ├── ProductDetails# View product
│   └── Profile       # User profile
├── types/            # TypeScript interfaces
└── integrations/     # Supabase client
```

## 🔐 Authentication

Users can register as:
- **Buyer**: Browse and contact sellers
- **Seller**: List products + all buyer features

Registration requires:
- Full name
- Email address
- Password
- Phone number (for WhatsApp contact)
- Location

## 📍 Supported Locations

- Mogadishu
- Hargeisa
- Kismayo
- Baidoa
- Garowe
- Beledweyne
- Bosaso
- Merca
- Jowhar
- Afgooye

## 🌐 Deployment

This project is deployed checkout here [DalagHub](https://dalaghub.vercel.app). 


## 📄 License

This project is built with [Lovable](https://lovable.dev).

---

**Built with ❤️ for Somali farmers and traders**
