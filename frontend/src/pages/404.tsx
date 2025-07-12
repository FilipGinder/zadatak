import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <img
        src="https://image.freepik.com/free-vector/404-error-page-found-concept-illustration_114360-1962.jpg"
        alt="404 Not Found"
        style={styles.image}
      />
      <h1 style={styles.title}>404</h1>
      <p style={styles.message}>Proizvod ili kategorija nije pronađena.</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
    textAlign: 'center',
    color: '#555',
  },
  image: {
    width: '150px',
    marginBottom: '1rem',
    opacity: 0.7,
  },
  title: {
    fontSize: '4rem',
    margin: '0.5rem 0',
    color: '#d9534f', // crvena nijansa za grešku
  },
  message: {
    fontSize: '1.2rem',
  },
};

export default NotFoundPage;
