import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import NotFoundPage from '../pages/404';
import { setJwtLoginToken } from '../redux/pages/Login';

interface Product {
  sif_product: string;
  naziv: string;
  price: number;
  categoryName: string;
  imgsrc: string;
  description: string;
}

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwtLoginToken = useSelector((state: RootState) => state.routerLogin.jwtLoginToken);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (!jwtLoginToken) {
      navigate('/'); // Ako nije ulogovan, nazad na login
    }else {
      handleSearch(); // Učitavamo sve proizvode na početku (searchTerm je prazan)
    }
  }, [jwtLoginToken, navigate]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const url = `http://localhost/zadatak/Products.php?search=${encodeURIComponent(searchTerm)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtLoginToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        setProducts([]);
        setNotFound(true);
        setIsLoading(false);
        return;
      } else {
        setNotFound(false);
      }
      if (!response.ok) {
        throw new Error(`Greška servera: ${response.status}`);
      }


      const data = await response.json();

      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.warn('Nevalidan format podataka:', data);
      }
    } catch (error) {
      console.error('Greška prilikom preuzimanja proizvoda:', error);
    }finally {
      setIsLoading(false);   
    }
  };

  const handleLogout = () => {
    dispatch(setJwtLoginToken(''));
    navigate('/');
  };



  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Lista proizvoda</h2>
      <button onClick={handleLogout} style={styles.logoutButton}>Odjavi se</button>

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Pretraži po imenu ili kategoriji..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>Pretraži</button>
      </div>

      {isLoading ? (
        <p style={{textAlign: 'center', fontSize: '1.2rem', padding: '2rem'}}>Učitavanje podataka...</p>
      ) : notFound ? (
        <NotFoundPage />
      ) : (
        <div style={styles.grid}>
          {products.map((p) => (
            <div key={p.sif_product} style={styles.card} onClick={() => navigate(`/product/${p.sif_product}`)}>
              <img src={p.imgsrc} alt={p.naziv} style={styles.image} />
              <h3 style={styles.title}>{p.naziv}</h3>
              <p style={styles.price}>{p.price.toFixed(2)} RSD</p>
              <div style={styles.description} dangerouslySetInnerHTML={{ __html: p.description ?? '' }} />
              <p style={styles.category}>{p.categoryName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  input: {
    padding: '.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    minWidth: '250px',
  },
  button: {
    padding: '.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  logoutButton: {
    padding: '.4rem 1rem',
    fontSize: '0.9rem',
    borderRadius: '4px',
    border: '1px solid #dc3545',
    backgroundColor: '#f8d7da',
    color: '#dc3545',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  image: {
    maxWidth: '100%',
    height: '200px',
    objectFit: 'contain',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '.5rem',
  },
  price: {
    color: '#007bff',
    fontWeight: 500,
    marginBottom: '.25rem',
  },
  category: {
    fontSize: '.9rem',
    color: '#666',
  },
  description: {
    fontSize: '.85rem',
    color: '#444',
    marginBottom: '.5rem',
  },
};

export default ProductList;
