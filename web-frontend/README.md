# QR Code Generator

A powerful, privacy-focused QR code generator built with React, Vite, and TailwindCSS. Generate QR codes for any purpose with full customization options.

## Features

✨ **Multiple QR Code Types:**
- Text
- URLs/Websites
- Email addresses with pre-filled subject/body
- Phone numbers
- SMS messages
- WiFi credentials
- Contact cards (vCard)
- Calendar events
- Social media profiles
- File uploads/links

🎨 **Full Customization:**
- Custom colors (foreground/background)
- Adjustable size and margins
- Logo/image overlay support
- Error correction levels
- Color presets
- Real-time preview

📱 **Mobile Responsive:**
- Works perfectly on all devices
- Touch-friendly interface
- Optimized for mobile screens

🌙 **Light/Dark Mode:**
- Automatic system preference detection
- Manual theme toggle
- Preference saved to localStorage

💾 **Export Options:**
- PNG (high resolution)
- SVG (vector format)
- PDF support
- Copy to clipboard
- No server required - all processing in browser

🔒 **Privacy First:**
- No data sent to servers
- All processing happens locally
- No registration required
- No tracking or analytics

## Quick Start

Install dependencies:
```bash
npm install
```

Start development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server  
- **TailwindCSS** - Utility-first CSS framework
- **QRCode.js** - QR code generation library
- **Framer Motion** - Smooth animations
- **File-saver** - File download functionality

## Usage

1. **Select QR Code Type** - Choose from text, URL, email, phone, etc.
2. **Enter Your Data** - Fill in the required information using the dynamic forms
3. **Customize Appearance** - Adjust colors, size, add logos, set error correction
4. **Download & Share** - Export as PNG, SVG, or copy to clipboard

## Supported QR Code Types

### Text
Simple plain text content

### URL/Website  
Website links with automatic https:// prefixing

### Email
Email addresses with optional subject and message pre-filling

### Phone Number
Phone numbers with international format support

### SMS
SMS with phone number and optional pre-filled message

### WiFi
WiFi credentials with network name, password, security type, and hidden network support

### Contact Card (vCard)
Complete contact information including:
- Name, organization, job title
- Phone, email, website
- Address and notes

### Calendar Event
iCalendar events with:
- Title, description, location
- Start/end date and time
- Compatible with all major calendar apps

### Social Media
Direct links to social profiles:
- Facebook, Instagram, Twitter/X
- LinkedIn, YouTube, TikTok
- Telegram, WhatsApp, Discord
- Custom URLs

### File/Image
- Small file uploads (images, documents)
- External file URLs
- Image preview for uploaded files

## Customization Options

- **Size**: 200px to 800px
- **Colors**: Custom foreground and background colors with color picker
- **Logo**: Upload and overlay images with size control
- **Error Correction**: Low (7%) to High (30%)
- **Margins**: Adjustable white space around QR code
- **Presets**: Quick color combinations

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Contact us at support@example.com

---

Made with ❤️ for the community. No tracking, no ads, just pure functionality.
