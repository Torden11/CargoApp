import { useState } from "react";
import { useContext, useEffect } from "react";
import Home from "../../Contexts/Home";
import Line from "./Line";

const sortData = [
  { value: "default", title: "Default" },
  { value: "price_asc", title: "Price 1-9" },
  { value: "price_desc", title: "Price 9-1" },
  { value: "rate_asc", title: "Rating 1-9" },
  { value: "rate_desc", title: "Rating 9-1" },
];

function List() {
  const { movies, setMovies, filterOn, filterWhat } = useContext(Home);
  const [sortBy, setSortBy] = useState("default");
  const [stats, setStats] = useState({movieCount: null});

  const resetFilter = () => {
    setMovies((m) => m.map((mo) => ({ ...mo, show: true })));
    filterOn.current = false;
    filterWhat.current = null;
  };

  useEffect (() => {
    if(null === movies) {
        return;
    }
    setStats(s => ({...s, movieCount: movies.length}));
  }, [movies]);

  useEffect(() => {
    switch (sortBy) {
      case "price_asc":
        setMovies((m) => [...m].sort((a, b) => a.price - b.price));
        break;
      case "price_desc":
        setMovies((m) => [...m].sort((b, a) => a.price - b.price));
        break;
      case "rate_asc":
        setMovies((m) => [...m].sort((a, b) => a.rating - b.rating));
        break;
      case "rate_desc":
        setMovies((m) => [...m].sort((b, a) => a.rating - b.rating));
        break;
      default:
        setMovies((m) => [...m ?? []].sort((a, b) => a.row - b.row));
    }
  }, [sortBy, setMovies]);

  return (
    <>
      <div className="card m-4">
        <h5 className="card-header">Sort</h5>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Sort by</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortData.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="card m-4">
        <h5 className="card-header">
          Movies List  <small onClick={resetFilter}>Show all movies</small>
          <span>Total number of movies: ({stats.movieCount})</span>
        </h5>
        <div className="card-body">
          <ul className="list-group">
            {movies?.map((m) =>
              m.show ? <Line key={m.id} movie={m} /> : null
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default List;
