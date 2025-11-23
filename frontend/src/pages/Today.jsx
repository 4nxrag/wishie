const Today = () => {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Today's Events</h1>
      <div className="card">
        <p style={{ color: 'var(--gray-600)' }}>
          No events today. We'll build this next!
        </p>
      </div>
    </div>
  );
};

export default Today;
