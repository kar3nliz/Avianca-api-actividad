import { useState, useEffect } from 'react';
import { productosAPI, Producto, Estadisticas } from '../api/productos';

const CATEGORIAS = ['Electrónica', 'Ropa', 'Alimentos', 'Hogar', 'Deportes', 'Otros'] as const;

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    categoria: 'Otros' as Producto['categoria'],
    stock: '',
    descripcion: '',
    activo: true
  });

  // Filtros
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [filtroActivo, setFiltroActivo] = useState<string>('');

  useEffect(() => {
    cargarProductos();
    cargarEstadisticas();
  }, [filtroCategoria, filtroActivo]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filtros: any = {};
      if (filtroCategoria) filtros.categoria = filtroCategoria;
      if (filtroActivo) filtros.activo = filtroActivo === 'true';
      
      const response = await productosAPI.obtenerProductos(filtros);
      if (response.success && response.data) {
        setProductos(response.data);
      }
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await productosAPI.obtenerEstadisticas();
      if (response.success && response.data) {
        setEstadisticas(response.data);
      }
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.precio || !formData.categoria) {
      setError('Nombre, precio y categoría son requeridos');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const productoData = {
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        categoria: formData.categoria,
        stock: parseInt(formData.stock) || 0,
        descripcion: formData.descripcion,
        activo: formData.activo
      };

      if (productoEditando) {
        await productosAPI.actualizarProducto(productoEditando._id!, productoData);
      } else {
        await productosAPI.crearProducto(productoData);
      }
      
      limpiarFormulario();
      await cargarProductos();
      await cargarEstadisticas();
      setMostrarFormulario(false);
    } catch (err: any) {
      setError(err.message || 'Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (producto: Producto) => {
    setProductoEditando(producto);
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio.toString(),
      categoria: producto.categoria,
      stock: producto.stock.toString(),
      descripcion: producto.descripcion || '',
      activo: producto.activo !== false
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      setLoading(true);
      setError(null);
      await productosAPI.eliminarProducto(id);
      await cargarProductos();
      await cargarEstadisticas();
    } catch (err) {
      setError('Error al eliminar producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      precio: '',
      categoria: 'Otros',
      stock: '',
      descripcion: '',
      activo: true
    });
    setProductoEditando(null);
  };

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>
        📦 Gestión de Productos
      </h1>

      {error && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fee', 
          color: '#c00',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #fcc'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Estadísticas */}
      {estadisticas && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '8px',
            border: '2px solid #2196f3'
          }}>
            <div style={{ fontSize: '14px', color: '#666' }}>Total Productos</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2196f3' }}>
              {estadisticas.totalProductos}
            </div>
          </div>
          
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#e8f5e9', 
            borderRadius: '8px',
            border: '2px solid #4caf50'
          }}>
            <div style={{ fontSize: '14px', color: '#666' }}>Productos Activos</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4caf50' }}>
              {estadisticas.productosActivos}
            </div>
          </div>
          
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#fff3e0', 
            borderRadius: '8px',
            border: '2px solid #ff9800'
          }}>
            <div style={{ fontSize: '14px', color: '#666' }}>Valor Inventario</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>
              {formatearPrecio(estadisticas.valorInventario)}
            </div>
          </div>
        </div>
      )}

      {/* Filtros y Botón Nuevo */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filtroActivo}
          onChange={(e) => setFiltroActivo(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        >
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>

        <button
          onClick={() => {
            limpiarFormulario();
            setMostrarFormulario(!mostrarFormulario);
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginLeft: 'auto'
          }}
        >
          {mostrarFormulario ? '❌ Cancelar' : '➕ Nuevo Producto'}
        </button>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <form onSubmit={handleSubmit} style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '25px', 
          borderRadius: '8px',
          marginBottom: '30px',
          border: '2px solid #dee2e6'
        }}>
          <h2 style={{ marginTop: 0 }}>
            {productoEditando ? '✏ Editar Producto' : '➕ Nuevo Producto'}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Nombre *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Precio * (COP)
              </label>
              <input
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Categoría *
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value as any })}
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
                required
              >
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
                min="0"
              />
            </div>
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
                minHeight: '80px',
                resize: 'vertical'
              }}
              maxLength={500}
            />
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: 'bold' }}>Producto activo</span>
            </label>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: loading ? '#ccc' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              {loading ? '⏳ Guardando...' : productoEditando ? '💾 Actualizar' : '✅ Crear'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                limpiarFormulario();
                setMostrarFormulario(false);
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de Productos */}
      <h2>📋 Lista de Productos ({productos.length})</h2>
      
      {loading && <p>⏳ Cargando...</p>}

      <div style={{ display: 'grid', gap: '15px' }}>
        {productos.map((producto) => (
          <div
            key={producto._id}
            style={{
              border: '2px solid #dee2e6',
              padding: '20px',
              borderRadius: '8px',
              backgroundColor: producto.activo ? '#fff' : '#f8f9fa',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              gap: '20px'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, color: '#333' }}>{producto.nombre}</h3>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: producto.activo ? '#d4edda' : '#f8d7da',
                  color: producto.activo ? '#155724' : '#721c24'
                }}>
                  {producto.activo ? '✓ Activo' : '✗ Inactivo'}
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2'
                }}>
                  {producto.categoria}
                </span>
              </div>
              
              <p style={{ margin: '8px 0', color: '#666', fontSize: '14px' }}>
                {producto.descripcion || 'Sin descripción'}
              </p>
              
              <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                <div>
                  <strong>Precio:</strong> {formatearPrecio(producto.precio)}
                </div>
                <div>
                  <strong>Stock:</strong> {producto.stock} unidades
                </div>
                <div>
                  <strong>Valor total:</strong> {formatearPrecio(producto.precio * producto.stock)}
                </div>
              </div>
              
              <small style={{ color: '#999', display: 'block', marginTop: '10px' }}>
                Creado: {producto.createdAt && new Date(producto.createdAt).toLocaleString('es-CO')}
              </small>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button
                onClick={() => handleEditar(producto)}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffc107',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                ✏ Editar
              </button>
              <button
                onClick={() => producto._id && handleEliminar(producto._id)}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                🗑 Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {productos.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '2px dashed #dee2e6'
        }}>
          <p style={{ fontSize: '18px', margin: '0' }}>
            📦 No hay productos. ¡Crea el primero!
          </p>
        </div>
      )}
    </div>
  );
}