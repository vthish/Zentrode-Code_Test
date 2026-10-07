import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=10&skip=0")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Products load karanna bari una.");
        setLoading(false);
      });
  }, []);

  // URL validation
  const isValidUrl = (url) => {
    try {
      const parsedUrl = new URL(url);

      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Title validation
  const isValidTitle = (title) => {
    return title.trim().length > 0;
  };

  const handleTitleChange = (id, newTitle) => {
    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              title: newTitle,
            }
          : product,
      ),
    );
  };

  const handleThumbnailChange = (id, newThumbnail) => {
    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              thumbnail: newThumbnail,
            }
          : product,
      ),
    );
  };

  if (loading) {
    return (
      <div className="message">
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="message error-message">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Product Editor</h1>

        <p>Edit product titles and thumbnail images dynamically</p>
      </div>

      <div className="product-grid">
        {products.map((product) => {
          const titleValid = isValidTitle(product.title);
          const thumbnailValid = isValidUrl(product.thumbnail);

          return (
            <div className="product-card" key={product.id}>
              <div className="product-id">Product #{product.id}</div>

              <div className="image-container">
                {thumbnailValid ? (
                  <img
                    src={product.thumbnail}
                    alt={titleValid ? product.title : "Product"}
                    className="product-image"
                  />
                ) : (
                  <div className="image-error">Invalid Thumbnail URL</div>
                )}
              </div>

              <h2 className="product-title">
                {titleValid ? product.title : "Product title is required"}
              </h2>

              <div className="form-group">
                <label>Product Title *</label>

                <input
                  type="text"
                  value={product.title}
                  onChange={(event) =>
                    handleTitleChange(product.id, event.target.value)
                  }
                  className={titleValid ? "" : "input-error"}
                  placeholder="Enter product title"
                  required
                />

                {!titleValid && (
                  <p className="validation-error">Product title is required.</p>
                )}
              </div>

              <div className="form-group">
                <label>Thumbnail URL *</label>

                <input
                  type="url"
                  value={product.thumbnail}
                  onChange={(event) =>
                    handleThumbnailChange(product.id, event.target.value)
                  }
                  className={thumbnailValid ? "" : "input-error"}
                  placeholder="https://example.com/image.jpg"
                  required
                />

                {!thumbnailValid && (
                  <p className="validation-error">
                    Please enter a valid HTTP or HTTPS URL.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
