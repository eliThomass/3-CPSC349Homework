import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentSearch, setCurrentSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentFilter, setCurrentFilter] = useState('');

  const [movies, setMovies] = useState([]);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  console.log(API_KEY)
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  const PLACEHOLDER_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';

  const getSortQuery = (filterValue) => {
    const filterMap = {
      'Release Date (Asc)': 'primary_release_date.asc',
      'Release Date (Desc)': 'primary_release_date.desc',
      'Rating (Asc)': 'vote_average.asc',
      'Rating (Desc)': 'vote_average.desc'
    };
    return filterMap[filterValue]; 
  };

  const handleSearch = (event) => {
    const newSearchTerm = event.target.value;
    setCurrentSearch(newSearchTerm);
    setCurrentPage(1); 
    setCurrentFilter('');
  }

  const handleFilter = (event) => {
    const newFilterValue = event.target.value;
    setCurrentFilter(newFilterValue);
    setCurrentPage(1); 
    setCurrentSearch(''); 
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const handleNext= () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const fetchAndDisplayMovies = async () => {
    let url = "";
    if(currentSearch) {
      url = `https://api.themoviedb.org/3/search/movie?query=${currentSearch}&language=en-US&page=${currentPage}&api_key=${API_KEY}`;
    }
    else if (currentFilter && currentFilter !== 'Sort By'){
      const sortQuery = getSortQuery(currentFilter);
      url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&page=${currentPage}&sort_by=${sortQuery}&api_key=${API_KEY}`;
    }
    else {
      url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${currentPage}&api_key=${API_KEY}`;
    }

    try {
        const res = await fetch(url);
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setMovies(data.results);
        setTotalPages(data.total_pages);
        
    } catch (err) {
        console.error('Fetch Error:', err);
        setMovies([]);
    }
  };

  useEffect(() => {
    fetchAndDisplayMovies();
  }, [currentPage, currentSearch, currentFilter]);

  const renderMovies = () => {
    if (!movies || movies.length === 0) {
        return <p>No movies found.</p>;
    }

    return movies.map(movie => {
        const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : PLACEHOLDER_IMAGE_URL;
        const altText = movie.poster_path ? `${movie.title} Poster` : 'No poster available';
        
        return (
            <div className="movie-card" key={movie.id}>
                <img src={posterUrl} alt={altText} />
                <h3>{movie.title}</h3>
                <p>Release Date: {movie.release_date || 'N/A'}</p>
                <p>Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}</p>
            </div>
        );
    });
  }

  return (
    <div>
      <header className="header">
          <h1>Movie Explorer</h1>
      </header>
      <nav className="navbar">
          <input id="searchmovie" type="search" placeholder="Search for a movie..." onChange={handleSearch}></input> 
          <select id="filter" disabled={currentSearch.length > 0} value={currentFilter} onChange={handleFilter}> 
              <option value="Sort By">Sort By</option>
              <option value="Release Date (Asc)">Release Date (Asc)</option>
              <option value="Release Date (Desc)">Release Date (Desc)</option>
              <option value="Rating (Asc)">Rating (Asc)</option>
              <option value="Rating (Desc)">Rating (Desc)</option>
          </select>
      </nav>
      <div id="json-output" className="movie-grid"> 
          {renderMovies()}
      </div>
      <nav className="pagenav">
          <button id="prevPageBtn" onClick={handlePrev}>Previous</button>
          <p id="pageInfo">Page {currentPage} of {totalPages}</p>
          <button id="nextPageBtn" onClick={handleNext}>Next</button>
      </nav>
    </div>
  )
}

export default App
