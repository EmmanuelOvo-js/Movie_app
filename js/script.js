const global = {
	currentPath: window.location.pathname,
};

//Movies page
displayPopularMovies = async () => {
	const { results } = await fetchAPIData('movie/popular');
	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
					<a href="movie-details.html?id=${movie.id}">
                    ${
											//ternary operator
											movie.poster_path
												? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    class="card-img-top" alt="${movie.title}" />`
												: `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}"/>`
										}
                    
                    </a>

					<div class="card-body">
						<h5 class="card-title">${movie.title}</h5>
						<p class="card-text">
							<small class="text-muted">Release: ${movie.release_date}</small>
						</p>
					</div>
                `;
		document.querySelector('#popular-movies').appendChild(div);
	});
};

//Tv Show page
displayTvShows = async () => {
	const { results } = await fetchAPIData('tv/popular');
	results.forEach((tv) => {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
					<a href="tv-details.html?id=${tv.id}">
		            ${
									//ternary operator
									tv.poster_path
										? `<img src="https://image.tmdb.org/t/p/w500${tv.poster_path}" class="card-img-top" alt="${tv.title}" />`
										: `<img src="images/no-image.jpg" class="card-img-top" alt="${tv.title}" />`
								}
		            </a>
					<div class="card-body">
						<h5 class="card-title">${tv.name}</h5>
						<p class="card-text">
							<small class="text-muted">Aired: ${tv.first_air_date}</small>
						</p>
					</div>
		        `;
		document.querySelector('#popular-shows').appendChild(div);
	});
};

//Display Movie Deatils
dislayMovieDetails = async () => {
	const movieId = location.search.split('=')[1];

	const movie = await fetchAPIData(`movie/${movieId}`);

	//Display Background Image
	displayBackgroundImage('movie', movie.backdrop_path);

	const div = document.createElement('div');

	div.innerHTML = `
	<div class="details-top">
          <div>
		  ${
				//ternary operator
				movie.poster_path
					? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    class="card-img-top" alt="${movie.title}" />`
					: `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}"/>`
			}
                    
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres
								.map((genre) => `<li>- ${genre.name}</li>`)
								.join('')}
            </ul>
            <a href="${
							movie.homepage
						}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
							movie.budget
						)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
							movie.revenue
						)}</li>
            <li><span class="text-secondary">Runtime:</span> ${
							movie.runtime
						} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies
						.map((p_company) => `<span>${p_company.name}, </span>`)
						.join('')}</div>
        </div>`;

	document.querySelector('#movie-details').appendChild(div);
};

//Display Background Image
displayBackgroundImage = (type, backgroundPath) => {
	const overlayDiv = document.createElement('div');
	overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
	overlayDiv.style.backgroundSize = 'cover';
	overlayDiv.style.backgroundPosition = 'center';
	overlayDiv.style.backgroundRepeat = 'no-repeat';
	overlayDiv.style.height = '100vh';
	overlayDiv.style.width = '100vw';
	overlayDiv.style.position = 'absolute';
	overlayDiv.style.top = '0';
	overlayDiv.style.left = '0';
	overlayDiv.style.zIndex = '-1';
	overlayDiv.style.opacity = '0.1';

	if (type === 'movie') {
		document.querySelector('#movie-details').appendChild(overlayDiv);
	} else {
		document.querySelector('#show-details').appendChild(overlayDiv);
	}
};

//Fetch data from TMDB API
fetchAPIData = async (endpoint) => {
	const API_KEY = '5d712d45d9561864ea774a0ff665ebc3';
	const API_URL = 'https://api.themoviedb.org/3/';

	//adds spinner loading effect
	showSpinner();

	const res = await fetch(
		`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
	);

	const data = await res.json();
	//remove spinner loading effect
	removeSpinner();

	return data;
};

// Spinner loading effect
showSpinner = () => {
	document.querySelector('.spinner').classList.add('show');
};

removeSpinner = () => {
	document.querySelector('.spinner').classList.remove('show');
};

// Hightlight active link
highlightActiveLink = () => {
	const links = document.querySelectorAll('.nav-link');

	links.forEach((link) => {
		if (link.getAttribute('href') === global.currentPath) {
			link.classList.add('active');
		}
	});
};

addCommasToNumber = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

init = () => {
	switch (global.currentPath) {
		case '/':
		case '/index.html':
			displayPopularMovies();
			break;
		case '/shows.html':
			displayTvShows();
			break;
		case '/search.html':
			console.log('search');
			break;
		case '/movie-details.html':
			dislayMovieDetails();
			break;
		case '/tv-details.html':
			console.log('tv-details');
			break;

		default:
			break;
	}
	highlightActiveLink();
};

document.addEventListener('DOMContentLoaded', init);
