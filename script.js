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
        const castSearchInput = document.getElementById('cast-search');
        const castSearchBtn = document.getElementById('cast-search-btn');
        
        // Movie search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchMovies();
            }
        });
        
        searchBtn.addEventListener('click', () => {
            this.searchMovies();
        });
        
        // Cast search
        castSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchCast();
            }
        });
        
        castSearchBtn.addEventListener('click', () => {
            this.searchCast();
        });
        
        // Search tabs
        const searchTabs = document.querySelectorAll('.search-tab');
        searchTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchSearchType(tab.dataset.type);
            });
        });
        
        // API key modal
        const apiKeyBtn = document.getElementById('api-key-btn');
        const apiModal = document.getElementById('api-modal');
        const closeApiModal = document.getElementById('close-api-modal');
        const saveApiKey = document.getElementById('save-api-key');
        
        apiKeyBtn.addEventListener('click', () => {
            this.showModal('api-modal');
        });
        
        closeApiModal.addEventListener('click', () => {
            this.hideModal('api-modal');
        });
        
        saveApiKey.addEventListener('click', () => {
            this.saveApiKey();
        });
        
        // Movie details modal
        const movieModal = document.getElementById('movie-modal');
        const closeModal = document.getElementById('close-modal');
        
        closeModal.addEventListener('click', () => {
            this.hideModal('movie-modal');
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });
        
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
    
    switchSearchType(type) {
        const movieTab = document.querySelector('[data-type="movie"]');
        const castTab = document.querySelector('[data-type="cast"]');
        const movieSearchBox = document.getElementById('movie-search-box');
        const castSearchBox = document.getElementById('cast-search-box');
        
        if (type === 'movie') {
            movieTab.classList.add('active');
            castTab.classList.remove('active');
            movieSearchBox.style.display = 'flex';
            castSearchBox.style.display = 'none';
        } else if (type === 'cast') {
            castTab.classList.add('active');
            movieTab.classList.remove('active');
            castSearchBox.style.display = 'flex';
            movieSearchBox.style.display = 'none';
        }
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
    
    async searchCast() {
        const query = document.getElementById('cast-search').value.trim();
        
        if (!query) {
            this.showError('Please enter an actor/actress name to search.');
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
            // First, find the person ID
            const person = await this.findPersonByName(query);
            if (person) {
                // Then get their movies
                const movies = await this.fetchMoviesByCast(person.id);
                this.displayMoviesByCast(movies, person.name);
            } else {
                this.showError('No actor/actress found with that name. Try a different search term.');
            }
        } catch (error) {
            console.error('Cast search error:', error);
            this.showError('Failed to search for movies by cast. Please check your API key and try again.');
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
    
    async findPersonByName(name) {
        const url = `${this.baseUrl}/search/person`;
        const params = new URLSearchParams({
            api_key: this.apiKey,
            query: name,
            language: 'en-US',
            page: 1
        });
        
        const response = await fetch(`${url}?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results && data.results.length > 0 ? data.results[0] : null;
    }
    
    async fetchMoviesByCast(personId) {
        const url = `${this.baseUrl}/person/${personId}/movie_credits`;
        const params = new URLSearchParams({
            api_key: this.apiKey,
            language: 'en-US'
        });
        
        const response = await fetch(`${url}?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // Sort by release date (most recent first) and limit to 20 movies
        const movies = data.cast || [];
        return movies
            .filter(movie => movie.release_date) // Only movies with release dates
            .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
            .slice(0, 20);
    }
    
    async fetchCastDetails(personId) {
        const url = `${this.baseUrl}/person/${personId}`;
        const params = new URLSearchParams({
            api_key: this.apiKey,
            language: 'en-US',
            append_to_response: 'movie_credits'
        });
        
        const response = await fetch(`${url}?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
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
    
    displayMoviesByCast(movies, actorName) {
        this.hideLoading();
        
        if (movies.length === 0) {
            this.showError(`No movies found for ${actorName}. Try a different actor/actress.`);
            return;
        }
        
        const resultsSection = document.getElementById('results-section');
        const resultsTitle = document.getElementById('results-title');
        const resultsCount = document.getElementById('results-count');
        const resultsGrid = document.getElementById('results-grid');
        
        resultsTitle.textContent = `Movies featuring ${actorName}`;
        resultsCount.textContent = `${movies.length} movie(s) found`;
        
        resultsGrid.innerHTML = '';
        
        movies.forEach(movie => {
            const movieCard = this.createMovieCard(movie);
            resultsGrid.appendChild(movieCard);
        });
        
        resultsSection.style.display = 'block';
    }
    
    createCastCard(person) {
        const card = document.createElement('div');
        card.className = 'cast-card';
        card.addEventListener('click', () => this.showCastDetails(person.id));
        
        const photoUrl = person.profile_path 
            ? `${this.imageBaseUrl}${person.profile_path}`
            : 'https://via.placeholder.com/300x450?text=No+Photo';
        
        const popularity = person.popularity ? Math.round(person.popularity) : 0;
        const knownFor = person.known_for ? person.known_for.slice(0, 3).map(movie => movie.title || movie.name).join(', ') : 'Unknown';
        
        card.innerHTML = `
            <img src="${photoUrl}" alt="${person.name}" class="cast-photo" loading="lazy">
            <div class="cast-info">
                <h3 class="cast-name">${person.name}</h3>
                <p class="cast-character">Known for: ${knownFor}</p>
                <p class="cast-popularity">Popularity: ${popularity}</p>
                <p class="cast-bio">${person.known_for_department || 'Actor/Actress'}</p>
            </div>
        `;
        
        return card;
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
        const mainCast = movie.credits?.cast?.slice(0, 5).map(actor => actor.name) || [];
        
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
                    ${mainCast.length > 0 ? `
                        <div class="movie-details-cast">
                            <h4 class="cast-title">Main Cast</h4>
                            <p class="cast-list">${mainCast.join(', ')}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        this.showModal('movie-modal');
    }
    
    async showCastDetails(personId) {
        this.showLoading();
        
        try {
            const person = await this.fetchCastDetails(personId);
            this.displayCastDetails(person);
        } catch (error) {
            console.error('Cast details error:', error);
            this.hideLoading();
            this.showError('Failed to load cast details. Please try again.');
        }
    }
    
    displayCastDetails(person) {
        this.hideLoading();
        
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        modalTitle.textContent = person.name;
        
        const photoUrl = person.profile_path 
            ? `${this.imageBaseUrl}${person.profile_path}`
            : 'https://via.placeholder.com/300x450?text=No+Photo';
        
        const birthday = person.birthday ? new Date(person.birthday).toLocaleDateString() : 'Unknown';
        const placeOfBirth = person.place_of_birth || 'Unknown';
        const popularity = person.popularity ? Math.round(person.popularity) : 0;
        
        // Get filmography
        const filmography = person.movie_credits?.cast || [];
        const recentMovies = filmography.slice(0, 10).map(movie => movie.title).join(', ');
        
        modalBody.innerHTML = `
            <div class="cast-details">
                <img src="${photoUrl}" alt="${person.name}" class="cast-details-photo">
                <div class="cast-details-info">
                    <h2>${person.name}</h2>
                    <div class="cast-details-meta">
                        <span>🎂 ${birthday}</span>
                        <span>📍 ${placeOfBirth}</span>
                        <span>⭐ Popularity: ${popularity}</span>
                    </div>
                    <div class="cast-details-bio">
                        <h4>Biography</h4>
                        <p>${person.biography || 'No biography available.'}</p>
                    </div>
                    ${recentMovies ? `
                        <div class="cast-filmography">
                            <h4 class="filmography-title">Recent Movies</h4>
                            <p class="filmography-list">${recentMovies}</p>
                        </div>
                    ` : ''}
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
    new MovieSearchApp();
});
