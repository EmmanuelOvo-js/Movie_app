const global = {
	currentPath: window.location.pathname,
	search: {
		term: '',
		type: '',
		page: 1,
		totalpages: 1,
		totalResults: 0,
	},
	api: {
		apiKey: '5d712d45d9561864ea774a0ff665ebc3',
		apiUrl: 'https://api.themoviedb.org/3/',
	},
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
												? `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
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
										? `<img src="https://image.tmdb.org/t/p/w500/${tv.poster_path}" class="card-img-top" alt="${tv.title}" />`
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
					? `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
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

//Display TV Deatils
dislayTVDetails = async () => {
	const tvShowId = location.search.split('=')[1];

	const tv = await fetchAPIData(`tv/${tvShowId}`);

	//Display Background Image
	displayBackgroundImage('tvShow', tv.backdrop_path);

	const div = document.createElement('div');

	div.innerHTML = `
		  <div class="details-top">
          <div>
		  ${
				//ternary operator
				tv.poster_path
					? `<img src="https://image.tmdb.org/t/p/w500/${tv.poster_path}"
                    class="card-img-top" alt="${tv.title}" />`
					: `<img src="images/no-image.jpg" class="card-img-top" alt="${tv.title}"/>`
			}
          </div>
          <div>
            <h2>${tv.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${tv.vote_average.toFixed()} / 10
            </p>
            <p class="text-muted">Release Date: ${tv.last_air_date}</p>
            <p>
              ${tv.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${tv.genres.map((genre) => `<li>- ${genre.name}</li>`).join('')}
            </ul>
            <a href="${
							tv.homepage
						}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
							tv.last_episode_to_air.episode_number
						}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
								tv.last_episode_to_air.name
							}
            </li>
            <li><span class="text-secondary">Status:</span> ${tv.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${tv.production_companies
						.map((company) => `<span>${company.name}, </span>`)
						.join('')}</div>
        </div>
      `;

	document.querySelector('#show-details').appendChild(div);
};

//Search Movies or Tv Shows
search = async () => {
	const queryString = location.search;
	const urlParams = new URLSearchParams(queryString);

	global.search.type = urlParams.get('type');
	global.search.term = urlParams.get('search-term');

	if (global.search.term !== '' && global.search.term !== null) {
		const { results, total_pages, page, total_results } = await searchAPIData();

		global.search.page = page;
		global.search.totalpages = total_pages;
		global.search.totalResults = total_results;

		if (results.length === 0) {
			showAlert('No results found');
			return;
		}

		displaySearchResults(results);

		//clear input
		document.querySelector('#search-term').value = '';
	} else {
		showAlert('Please Enter a Search Term');
	}
};

displaySearchResults = (results) => {
	//Clear Previous results
	//Added this because pagination function creates a new result for every Click
	document.querySelector('#search-results').innerHTML = '';
	document.querySelector('#search-results-heading').innerHTML = '';
	document.querySelector('#pagination').innerHTML = '';

	results.forEach((result) => {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
					<a href="${global.search.type}-details.html?id=${result.id}">
                    ${
											//ternary operator
											result.poster_path
												? `<img src="https://image.tmdb.org/t/p/w500/${
														result.poster_path
												  }"
			class="card-img-top" alt="${
				global.search.type === 'movie' ? result.title : result.name
			}" />`
												: `<img src="images/no-image.jpg" class="card-img-top" alt="${
														global.search.type === 'movie'
															? result.title
															: result.name
												  }"/>`
										}
                    
                    </a>

					<div class="card-body">
						<h5 class="card-title">${
							global.search.type === 'movie' ? result.title : result.name
						}</h5>
						<p class="card-text">
							<small class="text-muted">Release: ${
								global.search.type === 'movie'
									? result.release_date
									: result.first_air_date
							}</small>
						</p>
					</div>
                `;
		document.querySelector('#search-results-heading').innerHTML = `
		<h2>${results.length} of ${global.search.totalResults} 
		Result for <span style="color: red">${global.search.term}</span></h2>`;

		document.querySelector('#search-results').appendChild(div);
	});

	displayPagination();
};

// Create and Display Pagination for search page
displayPagination = () => {
	const div = document.createElement('div');
	div.classList.add('pagination');
	div.innerHTML = `
	<button class="btn btn-primary" id="prev">Prev</button>
	<button class="btn btn-primary" id="next">Next</button>

	<div class="page-counter">${global.search.page} of ${global.search.totalpages}</div>`;

	document.querySelector('#pagination').appendChild(div);

	//Disable prev btn if on first page
	if (global.search.page === 1) {
		document.querySelector('#prev').disabled = true;
	}

	if (global.search.page === global.search.totalpages) {
		document.querySelector('#next').disabled = true;
	}

	//Next page Click pagination
	document.querySelector('#next').addEventListener('click', async () => {
		//Increment
		global.search.page++;
		const { results, total_pages } = await searchAPIData();
		displaySearchResults(results);
	});

	//Prev page Click pagination
	document.querySelector('#prev').addEventListener('click', async () => {
		//Decrement
		global.search.page--;
		const { results, total_pages } = await searchAPIData();
		displaySearchResults(results);
	});
};

// .......................................................................................................

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
	/* Only do this for development or small projects. You should store your key
	and make request from server */
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;

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

//Make Request to Search
searchAPIData = async () => {
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;

	//adds spinner loading effect
	showSpinner();

	const res = await fetch(
		`${API_URL}search/${global.search.type}?api_key=${API_KEY}&
		language=en-US&query=${global.search.term}&page=${global.search.page}`
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

//Movie page Display Slider
displaySlider = async () => {
	const { results } = await fetchAPIData('movie/now_playing');
	results.forEach((movie) => {
		const div = document.createElement('div');
		div.classList.add('swiper-slide');
		div.innerHTML = `
		<a href="movie-details.html?id=${movie.id}">
							${
								movie.poster_path
									? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />`
									: `<img src="./images/no-image.jpg" alt="${movie.title}" />`
							}
						</a>
						<h4 class="swiper-rating">
							<i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed()} / 10
						</h4>`;

		initSwiper();

		document.querySelector('.swiper-wrapper').appendChild(div);
	});
};

//Tv Shows page Display Slider
TvDisplaySlider = async () => {
	const { results } = await fetchAPIData('tv/airing_today');
	results.forEach((tv) => {
		const div = document.createElement('div');
		div.classList.add('swiper-slide');
		div.innerHTML = `
		<a href="tv-details.html?id=${tv.id}">
							${
								tv.poster_path
									? `<img src="https://image.tmdb.org/t/p/w500${tv.poster_path}" alt="${tv.name}" />`
									: `<img src="./images/no-image.jpg" alt="${tv.name}" />`
							}
						</a>
						<h4 class="swiper-rating">
							<i class="fas fa-star text-secondary"></i> ${tv.vote_average.toFixed()} / 10
						</h4>`;

		initSwiper();

		document.querySelector('.swiper-wrapper').appendChild(div);
	});
};

//Show Alert
showAlert = (message, className = 'error') => {
	const alertElement = document.createElement('div');
	alertElement.classList.add('alert', className);
	alertElement.appendChild(document.createTextNode(message));
	//add into alert div
	document.querySelector('#alert').appendChild(alertElement);

	//Time out for alert div
	setTimeout(() => alertElement.remove(), 3000);
};

initSwiper = () => {
	const swiper = new Swiper('.swiper', {
		slidesPerView: 1,
		spaceBetween: 30,
		freeMode: true,
		loop: true,
		autoplay: {
			delay: 4000,
			disableOnInteraction: false,
		},
		breakpoints: {
			500: {
				slidesPerView: 2,
			},
			700: {
				slidesPerView: 3,
			},
			1200: {
				slidesPerView: 4,
			},
		},
	});
};

init = () => {
	switch (global.currentPath) {
		case '/':
		case '/index.html':
			displaySlider();
			displayPopularMovies();
			break;
		case '/shows.html':
			TvDisplaySlider();
			displayTvShows();
			break;
		case '/search.html':
			search();
			break;
		case '/movie-details.html':
			dislayMovieDetails();
			break;
		case '/tv-details.html':
			dislayTVDetails();
			break;

		default:
			break;
	}
	highlightActiveLink();
};

document.addEventListener('DOMContentLoaded', init);
