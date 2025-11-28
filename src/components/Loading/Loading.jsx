function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <span className="ms-2">Cargando...</span>
    </div>
  );
}

export default Loading;