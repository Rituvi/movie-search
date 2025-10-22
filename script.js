// Movie Search Web Application
class MovieSearchApp {
    constructor() {
        this.apiKey = localStorage.getItem('tmdb_api_key');
        this.baseUrl = 'https://api.themoviedb.org/3';
        this.imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
        this.currentPage = 1;
        this.totalPages = 1;
        this.currentQuery = '';
        
        this.initializeEventListeners();
        this.checkApiKey();
    }
    
    initializeEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('movie-search');
        const searchBtn = document.getElementById('search-btn');
        
        // Movie search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchMovies();
            }
        });
        
        searchBtn.addEventListener('click', () => {
            this.searchMovies();
        });
        
        // API key modal
        const apiKeyBtn = document.getElementById('api-key-btn');
        const apiModal = document.getElementById('api-modal');
        const closeApiModal = document.getElementById('close-api-modal');
        const saveApiKey = document.getElementById('save-api-key');
        
        if (apiKeyBtn) {
            apiKeyBtn.addEventListener('click', () => {
                this.showModal('api-modal');
            });
        }
        
        if (closeApiModal) {
            closeApiModal.addEventListener('click', () => {
                this.hideModal('api-modal');
            });
        }
        
        if (saveApiKey) {
            saveApiKey.addEventListener('click', () => {
                this.saveApiKey();
            });
        }
        
        // Retry button
        const retryBtn = document.getElementById('retry-btn');
        retryBtn.addEventListener('click', () => {
            this.hideError();
            this.searchMovies();
        });
    }
    
    checkApiKey() {
        if (!this.apiKey) {
            this.showApiKeyModal();
        }
    }
    
    showApiKeyModal() {
        setTimeout(() => {
            this.showModal('api-modal');
        }, 1000);
    }
    
    async searchMovies() {
        const query = document.getElementById('movie-search').value.trim();
        
        if (!query) {
            this.showError('Please enter a movie title to search.');
            return;
        }
        
        if (!this.apiKey) {
            this.showError('Please configure your API key first.');
            this.showModal('api-modal');
            return;
        }
        
        this.currentQuery = query;
        this.showLoading();
        this.hideError();
        
        try {
            const movies = await this.fetchMovies(query);
            this.displayResults(movies);
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Failed to search for movies. Please check your API key and try again.');
        }
    }
    
    async fetchMovies(query) {
        const url = `${this.baseUrl}/search/movie`;
        const params = new URLSearchParams({
            api_key: this.apiKey,
            query: query,
            language: 'en-US',
            page: this.currentPage
        });
        
        const response = await fetch(`${url}?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results || [];
    }
    
    async fetchMovieDetails(movieId) {
        const url = `${this.baseUrl}/movie/${movieId}`;
        const params = new URLSearchParams({
            api_key: this.apiKey,
            language: 'en-US',
            append_to_response: 'credits'
        });
        
        const response = await fetch(`${url}?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    displayResults(movies) {
        this.hideLoading();
        
        if (movies.length === 0) {
            this.showError('No movies found. Try a different search term.');
            return;
        }
        
        const resultsSection = document.getElementById('results-section');
        const resultsTitle = document.getElementById('results-title');
        const resultsCount = document.getElementById('results-count');
        const resultsGrid = document.getElementById('results-grid');
        
        resultsTitle.textContent = `Search Results for "${this.currentQuery}"`;
        resultsCount.textContent = `${movies.length} movie(s) found`;
        
        resultsGrid.innerHTML = '';
        
        movies.forEach(movie => {
            const movieCard = this.createMovieCard(movie);
            resultsGrid.appendChild(movieCard);
        });
        
        resultsSection.style.display = 'block';
    }
    
    createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.addEventListener('click', () => this.showMovieDetails(movie.id));
        
        const posterUrl = movie.poster_path 
            ? `${this.imageBaseUrl}${movie.poster_path}`
            : 'https://via.placeholder.com/300x450?text=No+Image';
        
        const releaseYear = movie.release_date 
            ? new Date(movie.release_date).getFullYear()
            : 'Unknown';
        
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        const stars = this.generateStars(movie.vote_average);
        
        card.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}" class="movie-poster" loading="lazy">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-year">${releaseYear}</p>
                <div class="movie-rating">
                    <span class="rating-stars">${stars}</span>
                    <span class="rating-value">${rating}/10</span>
                </div>
                <p class="movie-overview">${movie.overview || 'No overview available.'}</p>
            </div>
        `;
        
        return card;
    }
    
    generateStars(rating) {
        if (!rating) return '☆☆☆☆☆';
        
        const fullStars = Math.floor(rating / 2);
        const halfStar = rating % 2 >= 1;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + 
               (halfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }
    
    async showMovieDetails(movieId) {
        this.showLoading();
        
        try {
            const movie = await this.fetchMovieDetails(movieId);
            this.displayMovieDetails(movie);
        } catch (error) {
            console.error('Details error:', error);
            this.hideLoading();
            this.showError('Failed to load movie details. Please try again.');
        }
    }
    
    displayMovieDetails(movie) {
        this.hideLoading();
        
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        modalTitle.textContent = movie.title;
        
        const posterUrl = movie.poster_path 
            ? `${this.imageBaseUrl}${movie.poster_path}`
            : 'https://via.placeholder.com/300x450?text=No+Image';
        
        const releaseDate = movie.release_date 
            ? new Date(movie.release_date).toLocaleDateString()
            : 'Unknown';
        
        const runtime = movie.runtime ? `${movie.runtime} minutes` : 'Unknown';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        const voteCount = movie.vote_count || 0;
        
        const genres = movie.genres ? movie.genres.map(genre => genre.name) : [];
        const genreTags = genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('');
        
        const director = movie.credits?.crew?.find(person => person.job === 'Director');
        
        modalBody.innerHTML = `
            <div class="movie-details">
                <img src="${posterUrl}" alt="${movie.title}" class="movie-details-poster">
                <div class="movie-details-info">
                    <h2>${movie.title}</h2>
                    <div class="movie-details-meta">
                        <span>📅 ${releaseDate}</span>
                        <span>⏱️ ${runtime}</span>
                        <span>🌍 ${movie.original_language?.toUpperCase() || 'Unknown'}</span>
                    </div>
                    <div class="movie-details-rating">
                        <span class="rating-stars">${this.generateStars(movie.vote_average)}</span>
                        <span>${rating}/10 (${voteCount} votes)</span>
                    </div>
                    <div class="movie-details-genres">
                        ${genreTags}
                    </div>
                    ${director ? `<p><strong>Director:</strong> ${director.name}</p>` : ''}
                    <div class="movie-details-overview">
                        <h4>Plot Summary</h4>
                        <p>${movie.overview || 'No overview available.'}</p>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal('movie-modal');
    }
    
    saveApiKey() {
        const apiKeyInput = document.getElementById('api-key-input');
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            this.showApiKeyStatus('Please enter an API key.', 'error');
            return;
        }
        
        // Basic validation for TMDb API key format
        if (!apiKey.startsWith('api_') && apiKey.length < 20) {
            this.showApiKeyStatus('Please enter a valid TMDb API key.', 'error');
            return;
        }
        
        this.apiKey = apiKey;
        localStorage.setItem('tmdb_api_key', apiKey);
        this.showApiKeyStatus('API key saved successfully!', 'success');
        
        setTimeout(() => {
            this.hideModal('api-modal');
        }, 1500);
    }
    
    showApiKeyStatus(message, type) {
        const status = document.getElementById('api-key-status');
        status.textContent = message;
        status.className = `api-key-status ${type}`;
        status.style.display = 'block';
    }
    
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
    
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
    
    showLoading() {
        document.getElementById('loading-section').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';
        document.getElementById('error-section').style.display = 'none';
    }
    
    hideLoading() {
        document.getElementById('loading-section').style.display = 'none';
    }
    
    showError(message) {
        document.getElementById('error-message').textContent = message;
        document.getElementById('error-section').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';
        document.getElementById('loading-section').style.display = 'none';
    }
    
    hideError() {
        document.getElementById('error-section').style.display = 'none';
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.movieSearchApp = new MovieSearchApp();
    console.log('App initialized:', window.movieSearchApp);
});

// Also make sure it's available immediately
window.movieSearchApp = null;
