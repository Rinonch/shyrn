# Shyrn - Personal Blog & Projects

[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue?style=flat-square&logo=github)](https://your-username.github.io/shyrn-blog)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A modern personal website featuring blog posts and projects with a sleek dark theme design.

## 🌟 Features

- **Modern Design**: Clean, minimalist interface with dark theme
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Progressive Web App**: PWA support with offline capabilities
- **Performance Optimized**: Fast loading with caching strategies
- **SEO Friendly**: Proper meta tags and semantic HTML
- **Search Functionality**: Built-in blog search feature

## 🚀 Live Demo

Visit the live website: [https://your-username.github.io/shyrn-blog](https://your-username.github.io/shyrn-blog)

## 📱 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **PWA**: Service Worker, Web App Manifest
- **Hosting**: GitHub Pages
- **Icons**: Custom SVG icons
- **Fonts**: Google Fonts integration

## 🛠️ Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/shyrn-blog.git
   cd shyrn-blog
   ```

2. Open with a local server:

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

3. Open `http://localhost:8000` in your browser

## 📁 Project Structure

```
├── index.html          # Homepage with featured content
├── blog.html           # Blog posts page
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── script.js       # Main JavaScript
├── images/             # Image assets
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
└── favicon.svg        # Site favicon
```

## 🎨 Customization

### Adding New Blog Posts

Edit the blog posts array in `js/script.js`:

```javascript
const blogPosts = [
  {
    id: 1,
    title: "Your New Post Title",
    excerpt: "Brief description of your post...",
    date: "2025-07-18",
    image: "images/your-image.jpg",
    tags: ["tag1", "tag2"],
  },
  // Add more posts...
];
```

### Adding New Projects

Update the projects array in `js/script.js`:

```javascript
const projects = [
  {
    id: 1,
    title: "Your Project Name",
    description: "Project description...",
    date: "2025-07-18",
    image: "images/project-image.jpg",
    tags: ["technology", "category"],
  },
  // Add more projects...
];
```

## 🚀 Deployment to GitHub Pages

1. Fork this repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click Save

Your site will be available at: `https://your-username.github.io/shyrn-blog`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

- Website: [https://your-username.github.io/shyrn-blog](https://your-username.github.io/shyrn-blog)
- GitHub: [@your-username](https://github.com/your-username)

---

⭐ Star this repository if you found it helpful!

- Accent color: `#ff4444`
- Text color: `#ffffff`
- Secondary text: `#999`

### Search Functionality

The search feature filters posts by:

- Post title
- Publication date
- Supports real-time filtering as you type

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with similar capabilities

## Performance

- Optimized images with lazy loading
- Minimal JavaScript
- CSS optimized for fast rendering
- Service worker for caching

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Reduced motion preferences respected

## License

Free to use and modify for personal projects.
