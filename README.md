# 🎬 Movie Search Web App

A modern, responsive web application for searching movies using The Movie Database (TMDb) API. Built with vanilla HTML, CSS, and JavaScript, ready for deployment on Netlify.

## ✨ Features

- **🔍 Movie Search**: Search for movies by title
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🎨 Modern UI**: Beautiful gradient design with smooth animations
- **⭐ Movie Details**: Comprehensive movie information including:
  - Plot summary
  - Ratings and reviews
  - Release date and runtime
  - Genres and language
  - High-quality poster images
- **🔑 API Key Management**: Secure local storage of API keys
- **⚡ Fast Performance**: Optimized for speed and user experience
- **🌐 Netlify Ready**: Pre-configured for easy deployment

## 🚀 Quick Start

### Local Development

1. **Clone or download the project**
   ```bash
   cd /Users/Ritu/movie-search-web
   ```

2. **Open in browser**
   ```bash
   # Option 1: Use Python's built-in server
   python3 -m http.server 8000
   # Then visit: http://localhost:8000
   
   # Option 2: Use Node.js server (if you have it)
   npx serve .
   # Then visit: http://localhost:3000
   
   # Option 3: Open directly in browser
   open index.html
   ```

3. **Get your TMDb API key**
   - Visit: https://www.themoviedb.org/settings/api
   - Create a free account
   - Request an API key
   - Copy your key

4. **Configure the app**
   - Click the "API Key" button in the header
   - Enter your TMDb API key
   - Click "Save API Key"

5. **Start searching!**
   - Enter a movie title in the search box
   - Click "Search" or press Enter
   - Click on any movie to see detailed information

## 🌐 Netlify Deployment

### Method 1: Drag and Drop (Easiest)

1. **Prepare your files**
   - Make sure all files are in the `movie-search-web` folder
   - Files needed: `index.html`, `styles.css`, `script.js`, `netlify.toml`, `_redirects`

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login to your account
   - Drag the entire `movie-search-web` folder to the deploy area
   - Wait for deployment to complete
   - Your site will be live at a random URL like `https://amazing-name-123456.netlify.app`

### Method 2: Git Integration

1. **Push to GitHub**
   ```bash
   # Initialize git repository
   git init
   git add .
   git commit -m "Initial commit: Movie Search Web App"
   
   # Create repository on GitHub and push
   git remote add origin https://github.com/yourusername/movie-search-web.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Deploy settings:
     - Build command: (leave empty)
     - Publish directory: (leave empty)
   - Click "Deploy site"

### Method 3: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy from command line**
   ```bash
   cd /Users/Ritu/movie-search-web
   netlify deploy --prod --dir .
   ```

## 📁 Project Structure

```
movie-search-web/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── netlify.toml        # Netlify configuration
├── _redirects          # Netlify redirects
└── README.md           # This documentation
```

## 🎯 Usage Guide

### Getting Started

1. **Open the application**
   - Visit your deployed URL or open `index.html` locally

2. **Configure API key**
   - Click the "API Key" button in the top-right corner
   - Enter your TMDb API key
   - Click "Save API Key"

3. **Search for movies**
   - Type a movie title in the search box
   - Press Enter or click the Search button
   - Browse through the results

4. **View movie details**
   - Click on any movie card to see detailed information
   - View plot, ratings, and more
   - Click the X to close the details modal

### Features Explained

#### Search Functionality
- **Real-time search**: Enter any movie title
- **Smart results**: Shows relevant movies with ratings and overviews
- **Image previews**: High-quality movie posters
- **Responsive grid**: Adapts to different screen sizes

#### Movie Details Modal
- **Comprehensive info**: Everything about the movie
- **Ratings**: User ratings and vote counts
- **Genres**: Movie categories
- **Plot summary**: Detailed description

#### API Key Management
- **Secure storage**: API keys stored locally in browser
- **Easy setup**: One-time configuration
- **Validation**: Checks for valid API key format

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox and grid
- **JavaScript ES6+**: Modern JavaScript features
- **TMDb API**: Movie database integration
- **Netlify**: Hosting and deployment

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance Features
- **Lazy loading**: Images load as needed
- **Caching**: API responses cached in browser
- **Optimized images**: Responsive image sizing
- **Minimal dependencies**: No external frameworks

## 🛠️ Customization

### Styling
Edit `styles.css` to customize:
- Colors and gradients
- Fonts and typography
- Layout and spacing
- Animations and transitions

### Functionality
Edit `script.js` to add:
- New search filters
- Additional movie information
- Custom animations
- New features

### Configuration
Edit `netlify.toml` to modify:
- Build settings
- Headers and security
- Redirects and routing
- Caching policies

## 🚨 Troubleshooting

### Common Issues

**1. "API key not working"**
- Verify your API key is correct
- Check that the key starts with the right format
- Ensure you have an active TMDb account

**2. "No movies found"**
- Try different search terms
- Check your internet connection
- Verify API key is valid

**3. "Images not loading"**
- Check internet connection
- TMDb image service might be temporarily down
- Try refreshing the page

**4. "Deployment failed"**
- Check that all files are in the project folder
- Verify `netlify.toml` syntax
- Check Netlify build logs

### Debug Mode

Open browser developer tools (F12) and check:
- Console for JavaScript errors
- Network tab for API requests
- Application tab for stored API key

## 📊 API Information

### TMDb API
- **Base URL**: `https://api.themoviedb.org/3`
- **Rate Limits**: 40 requests per 10 seconds
- **Authentication**: API key required
- **Documentation**: https://developers.themoviedb.org/

### Endpoints Used
- `/search/movie` - Search for movies
- `/movie/{id}` - Get movie details

## 🔒 Security

### Data Protection
- **No server storage**: All data processed client-side
- **Local storage**: API keys stored in browser only
- **HTTPS**: Secure connections for all API calls
- **CORS**: Proper cross-origin request handling

### Privacy
- **No tracking**: No analytics or user tracking
- **No cookies**: No persistent cookies used
- **Local only**: All data stays in your browser

## 🎨 Design Features

### Visual Elements
- **Gradient backgrounds**: Modern gradient design
- **Card layouts**: Clean movie card design
- **Smooth animations**: Hover effects and transitions
- **Responsive images**: Optimized for all devices

### User Experience
- **Intuitive navigation**: Easy to use interface
- **Loading states**: Visual feedback during searches
- **Error handling**: Clear error messages
- **Accessibility**: Keyboard navigation support

## 📱 Mobile Support

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Touch-friendly**: Large buttons and touch targets
- **Flexible layouts**: Adapts to different screen sizes
- **Fast loading**: Optimized for mobile networks

## 🚀 Performance

### Optimization Features
- **Minimal JavaScript**: Lightweight code
- **Efficient API calls**: Only necessary data fetched
- **Image optimization**: Responsive image sizing
- **Caching**: Browser caching for better performance

## 📈 Future Enhancements

### Possible Features
- **Favorites**: Save favorite movies
- **Watchlist**: Create personal watchlists
- **Reviews**: Read and write movie reviews
- **Recommendations**: Get movie suggestions
- **Social sharing**: Share movies on social media
- **Offline support**: Work without internet

### Advanced Features
- **User accounts**: Personal profiles
- **Movie collections**: Organize movies
- **Advanced filters**: Filter by genre, year, rating
- **Export data**: Save search results
- **Dark mode**: Toggle between themes

## 📄 License

This project is for educational purposes. Please respect TMDb's terms of service when using their API.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Verify your API key is correct
3. Check your internet connection
4. Review browser console for errors
5. Test with different search terms

---

**Happy Movie Searching! 🎬🍿**

## 🎯 Quick Deployment Checklist

- [ ] All files in project folder
- [ ] TMDb API key obtained
- [ ] Netlify account created
- [ ] Files uploaded to Netlify
- [ ] Site tested and working
- [ ] Custom domain configured (optional)

**Your movie search web app is ready to go live! 🚀**
