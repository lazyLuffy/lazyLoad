import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const loader = useRef(null);

  useEffect(() => {
    const loadMoreItems = async () => {
      setIsLoading(true);
      const response = await fetch(`https://randomuser.me/api/?page=${page}`);
      const data = await response.json();
      setItems([...items, data.results]);
      setPage(page + 1);
      setIsLoading(false);
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        loadMoreItems();
      }
    }, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [isLoading, items, page]);

  const handleName = (data) => {
    console.log(data, "after filter data");
    const filterData = items.filter((v) => {
      console.log(v, "nnerfiltermap ");
      return v[0].name.first.toLowerCase().includes(data.toLowerCase());
    });
    console.log(filterData, "filterData");
    setItems(filterData);
    console.log(items, "after settingData");
  };

  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            COZMO <p className="text-success">Power</p>
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <form class="d-flex ms-auto">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Search"
                onChange={(e) => handleName(e.target.value)}
                aria-label="Search"
              />
            </form>
          </div>
        </div>
      </nav>

      <div className="container-fluid bg-dark py-3 d-flex align-items-center flex-row flex-wrap justify-content-between">
        {items.map((item) => (
          <div className="col-4 col-md-3 bg-success m-3">
            <img src={item[0].picture.large} className="img-fluid col-12" />
            <ul className="text-center list-unstyle">
              <li key={item[0].phone} className="p-0 m-0 text-light">
                {item[0].name.first}
              </li>
            </ul>
          </div>
        ))}
      </div>

      <div ref={loader}>Loading...</div>
    </div>
  );
}

export default App;
