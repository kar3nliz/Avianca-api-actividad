const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
 
// Interfaces

export interface Producto {

  _id?: string;

  nombre: string;

  precio: number;

  categoria: 'Electrónica' | 'Ropa' | 'Alimentos' | 'Hogar' | 'Deportes' | 'Otros';

  stock: number;

  descripcion?: string;

  activo?: boolean;

  createdAt?: string;

  updatedAt?: string;

}
 
export interface ApiResponse<T> {

  success: boolean;

  data?: T;

  count?: number;

  message?: string;

  error?: string;

  errors?: string[];

}
 
export interface FiltrosProductos {

  categoria?: string;

  activo?: boolean;

  minPrecio?: number;

  maxPrecio?: number;

}
 
export interface Estadisticas {

  totalProductos: number;

  productosActivos: number;

  productosInactivos: number;

  valorInventario: number;

  productosPorCategoria: Array<{

    _id: string;

    cantidad: number;

    valorTotal: number;

  }>;

}
 
// Cliente API

class ProductosAPI {

  private baseUrl: string;
 
  constructor(baseUrl: string) {

    this.baseUrl = baseUrl;

  }
 
  private async request<T>(

    endpoint: string,

    options: RequestInit = {}

  ): Promise<ApiResponse<T>> {

    try {

      const response = await fetch(`${this.baseUrl}${endpoint}`, {

        headers: {

          'Content-Type': 'application/json',

          ...options.headers,

        },

        ...options,

      });
 
      const data = await response.json();
 
      if (!response.ok) {

        throw new Error(data.message || 'Error en la petición');

      }
 
      return data;

    } catch (error) {

      console.error('API Error:', error);

      throw error;

    }

  }
 
  // GET - Obtener todos los productos

  async obtenerProductos(filtros?: FiltrosProductos): Promise<ApiResponse<Producto[]>> {

    let url = '/productos';

    if (filtros) {

      const params = new URLSearchParams();

      if (filtros.categoria) params.append('categoria', filtros.categoria);

      if (filtros.activo !== undefined) params.append('activo', String(filtros.activo));

      if (filtros.minPrecio) params.append('minPrecio', String(filtros.minPrecio));

      if (filtros.maxPrecio) params.append('maxPrecio', String(filtros.maxPrecio));

      const queryString = params.toString();

      if (queryString) url += `?${queryString}`;

    }

    return this.request<Producto[]>(url);

  }
 
  // GET - Obtener un producto por ID

  async obtenerProductoPorId(id: string): Promise<ApiResponse<Producto>> {

    return this.request<Producto>(`/productos/${id}`);

  }
 
  // POST - Crear un nuevo producto

  async crearProducto(producto: Omit<Producto, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Producto>> {

    return this.request<Producto>('/productos', {

      method: 'POST',

      body: JSON.stringify(producto),

    });

  }
 
  // PUT - Actualizar un producto

  async actualizarProducto(id: string, producto: Partial<Producto>): Promise<ApiResponse<Producto>> {

    return this.request<Producto>(`/productos/${id}`, {

      method: 'PUT',

      body: JSON.stringify(producto),

    });

  }
 
  // DELETE - Eliminar un producto

  async eliminarProducto(id: string): Promise<ApiResponse<Producto>> {

    return this.request<Producto>(`/productos/${id}`, {

      method: 'DELETE',

    });

  }
 
  // GET - Obtener estadísticas

  async obtenerEstadisticas(): Promise<ApiResponse<Estadisticas>> {

    return this.request<Estadisticas>('/estadisticas');

  }
 
  // GET - Health check

  async healthCheck(): Promise<ApiResponse<{ message: string; timestamp: string; database: string }>> {

    return this.request('/health');

  }

}
 
export const productosAPI = new ProductosAPI(API_BASE_URL);

export default productosAPI;
 