# Gutenberg Languages Institute - Official Website

Welcome to the official codebase for the Gutenberg Languages Institute website. This project is a complete, production-ready language school website with advanced features including online booking, payment processing, and AI chatbot integration.

## 🚀 Features

- **9 Full Pages**: Home, About, Courses, Booking, Gallery, Reviews, Contact, Payment, Application
- **Responsive Design**: Mobile-first approach using Vanilla CSS (Yellow/Black theme)
- **Interactive Elements**:
  - Custom Navigation with mobile toggle
  - Filterable Course lists
  - Dynamic Booking Form
  - Photo Gallery Grid
- **Functionality**:
  - **Online Booking**: Schedule language sessions instantly
  - **Payment Integration**: Secure forms for credit card/bank transfer
  - **AI Chatbot**: Instant student assistance
  - **Contact Form**: EmailJS integration for direct messaging
- **SEO & Performance**: Optimized meta tags, sitemap, and fast loading structure

## 📂 Project Structure

```
/
├── index.html          # Home page
├── about.html          # About Us page
├── courses.html        # Courses info
├── booking.html        # Booking form
├── gallery.html        # Photo gallery
├── reviews.html        # Testimonials
├── contact.html        # Contact info
├── payment.html        # Payment gateway
├── application.html    # Online application
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Crawler rules
├── css/
│   ├── styles.css      # Core styles & variables
│   └── components.css  # Component library (cards, buttons, forms)
└── js/
    ├── main.js         # Navigation & global logic
    ├── booking.js      # Booking system logic
    ├── payment.js      # Payment processing logic
    ├── chatbot.js      # AI chat widget
    └── emailjs-config.js # Email service configuration
```

## 🛠️ Setup & Usage

1.  **Open locally**: Simply open `index.html` in any modern web browser.
2.  **Deploy**: Upload all files to your web hosting server (e.g., Netlify, Vercel, Apache, Nginx).

## ⚙️ Configuration

### 1. Logo Replacement
Open `index.html` (and other pages if needed) and replace:
```html
<img src="PASTE_YOUR_LOGO_URL_HERE" ...>
```
with your actual logo URL (e.g., `images/logo.png`).

### 2. Partner Image Replacement
Open `index.html` or `reviews.html` and replace:
```html
<img src="PASTE_PARTNER_IMAGE_URL_HERE" ...>
```
with your partner/accreditation badge URL.

### 3. EmailJS Setup (Contact Form)
To make the contact form sending emails:
1.  Register at [EmailJS](https://www.emailjs.com/)
2.  Create a Service and Template
3.  Open `js/emailjs-config.js`
4.  Update the constants:
    ```javascript
    const EMAILJS_CONFIG = {
        serviceID: 'YOUR_SERVICE_ID',
        templateID: 'YOUR_TEMPLATE_ID',
        publicKey: 'YOUR_PUBLIC_KEY'
    };
    ```

### 4. Google Maps
In `contact.html`, search for `iframe` and replace the `src` with your Google Maps Embed code.

## 🎨 Customization

-   **Colors**: Edit CSS variables in `css/styles.css` under `:root`.
    ```css
    :root {
        --primary-yellow: #FFD700;
        --primary-black: #000000;
        /* ... */
    }
    ```
-   **Content**: Edit HTML files directly to update text and images.

---

© 2026 Gutenberg Languages Institute
