import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface Product {
  sif_product: string;
  naziv: string;
  price: number;
  categoryName: string;
  imgsrc: string;
  description: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const jwtLoginToken = useSelector((state: RootState) => state.routerLogin.jwtLoginToken);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const url = `http://localhost/zadatak/Products.php?id=${id}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtLoginToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Proizvod nije pronađen');
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (jwtLoginToken && id) {
      fetchProduct();
    }
  }, [jwtLoginToken, id]);

  if (!product) return <p style={{ padding: '2rem', textAlign: 'center' }}>Učitavanje proizvoda...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
      <h2>{product.naziv}</h2>
      <img
        src={product.imgsrc}
        alt={product.naziv}
        style={{ width: '100%', height: '300px', objectFit: 'contain', marginBottom: '1rem' }}
      />
      <p><strong>Cena:</strong> {product.price} RSD</p>
      <p><strong>Kategorija:</strong> {product.categoryName}</p>
      <div dangerouslySetInnerHTML={{ __html: product.description }} />

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: '2rem',
          padding: '0.6rem 1.2rem',
          fontSize: '1rem',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#007bff',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        ← Nazad
      </button>
    </div>
  );
};

export default ProductDetails;
