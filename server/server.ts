import express, { Request, Response } from 'express';

import mongoose from 'mongoose';

import cors from 'cors';

import dotenv from 'dotenv';
 
dotenv.config();
 
const app = express();

const PORT = process.env.PORT || 3001;
 
// Middlewares

app.use(cors());

app.use(express.json());
 
// MongoDB Connection

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ejercicio1-db';
 
mongoose.connect(MONGODB_URI)

  .then(() => console.log('✅ Conectado exitosamente a MongoDB'))

  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));
 
// ==================== SCHEMAS Y MODELOS ====================
 
// Schema de Producto

const productoSchema = new mongoose.Schema({

  nombre: {

    type: String,

    required: [true, 'El nombre es requerido'],

    trim: true,

    minlength: [3, 'El nombre debe tener al menos 3 caracteres']

  },

  precio: {

    type: Number,

    required: [true, 'El precio es requerido'],

    min: [0, 'El precio no puede ser negativo']

  },

  categoria: {

    type: String,

    required: [true, 'La categoría es requerida'],

    enum: ['Electrónica', 'Ropa', 'Alimentos', 'Hogar', 'Deportes', 'Otros'],

    default: 'Otros'

  },

  stock: {

    type: Number,

    required: [true, 'El stock es requerido'],

    min: [0, 'El stock no puede ser negativo'],

    default: 0

  },

  descripcion: {

    type: String,

    maxlength: [500, 'La descripción no puede exceder 500 caracteres']

  },

  activo: {

    type: Boolean,

    default: true

  },

  createdAt: {

    type: Date,

    default: Date.now

  },

  updatedAt: {

    type: Date,

    default: Date.now

  }

}, {

  timestamps: true

});
 
const Producto = mongoose.model('Producto', productoSchema);
 
// ==================== RUTAS - PRODUCTOS ====================
 
// GET - Obtener todos los productos

app.get('/api/productos', async (req: Request, res: Response) => {

  try {

    const { categoria, activo, minPrecio, maxPrecio } = req.query;

    // Construir filtros dinámicos

    const filtros: any = {};

    if (categoria) filtros.categoria = categoria;

    if (activo !== undefined) filtros.activo = activo === 'true';

    if (minPrecio || maxPrecio) {

      filtros.precio = {};

      if (minPrecio) filtros.precio.$gte = Number(minPrecio);

      if (maxPrecio) filtros.precio.$lte = Number(maxPrecio);

    }
 
    const productos = await Producto.find(filtros).sort({ createdAt: -1 });

    res.json({

      success: true,

      count: productos.length,

      data: productos

    });

  } catch (error) {

    console.error('Error al obtener productos:', error);

    res.status(500).json({

      success: false,

      message: 'Error al obtener productos',

      error: error instanceof Error ? error.message : 'Error desconocido'

    });

  }

});
 
// GET - Obtener un producto por ID

app.get('/api/productos/:id', async (req: Request, res: Response) => {

  try {

    const producto = await Producto.findById(req.params.id);

    if (!producto) {

      return res.status(404).json({

        success: false,

        message: 'Producto no encontrado'

      });

    }
 
    res.json({

      success: true,

      data: producto

    });

  } catch (error) {

    console.error('Error al obtener producto:', error);

    res.status(500).json({

      success: false,

      message: 'Error al obtener producto',

      error: error instanceof Error ? error.message : 'Error desconocido'

    });

  }

});
 
// POST - Crear un nuevo producto

app.post('/api/productos', async (req: Request, res: Response) => {

  try {

    const { nombre, precio, categoria, stock, descripcion, activo } = req.body;
 
    // Validación básica

    if (!nombre || precio === undefined || !categoria) {

      return res.status(400).json({

        success: false,

        message: 'Nombre, precio y categoría son requeridos'

      });

    }
 
    const nuevoProducto = new Producto({

      nombre,

      precio,

      categoria,

      stock: stock || 0,

      descripcion,

      activo: activo !== undefined ? activo : true

    });
 
    const productoGuardado = await nuevoProducto.save();
 
    res.status(201).json({

      success: true,

      message: 'Producto creado exitosamente',

      data: productoGuardado

    });

  } catch (error) {

    console.error('Error al crear producto:', error);

    if (error instanceof mongoose.Error.ValidationError) {

      return res.status(400).json({

        success: false,

        message: 'Error de validación',

        errors: Object.values(error.errors).map(err => err.message)

      });

    }

    res.status(500).json({

      success: false,

      message: 'Error al crear producto',

      error: error instanceof Error ? error.message : 'Error desconocido'

    });

  }

});
 
// PUT - Actualizar un producto

app.put('/api/productos/:id', async (req: Request, res: Response) => {

  try {

    const { nombre, precio, categoria, stock, descripcion, activo } = req.body;
 
    const productoActualizado = await Producto.findByIdAndUpdate(

      req.params.id,

      { 

        nombre, 

        precio, 

        categoria, 

        stock, 

        descripcion, 

        activo,

        updatedAt: new Date()

      },

      { 

        new: true, 

        runValidators: true 

      }

    );
 
    if (!productoActualizado) {

      return res.status(404).json({

        success: false,

        message: 'Producto no encontrado'

      });

    }
 
    res.json({

      success: true,

      message: 'Producto actualizado exitosamente',

      data: productoActualizado

    });

  } catch (error) {

    console.error('Error al actualizar producto:', error);

    if (error instanceof mongoose.Error.ValidationError) {

      return res.status(400).json({

        success: false,

        message: 'Error de validación',

        errors: Object.values(error.errors).map(err => err.message)

      });

    }

    res.status(500).json({

      success: false,

      message: 'Error al actualizar producto',

      error: error instanceof Error ? error.message : 'Error desconocido'

    });

  }

});
 
// DELETE - Eliminar un producto

app.delete('/api/productos/:id', async (req: Request, res: Response) => {

  try {

    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
 
    if (!productoEliminado) {

      return res.status(404).json({

        success: false,

        message: 'Producto no encontrado'

      });

    }
 
    res.json({

      success: true,

      message: 'Producto eliminado exitosamente',

      data: productoEliminado

    });

  } catch (error) {

    console.error('Error al eliminar producto:', error);

    res.status(500).json({

      success: false,

      message: 'Error al eliminar producto',

      error: error instanceof Error ? error.message : 'Error desconocido'

    });

  }

});
 
// ==================== RUTAS ADICIONALES ====================
 
// GET - Estadísticas

app.get('/api/estadisticas', async (req: Request, res: Response) => {

  try {

    const totalProductos = await Producto.countDocuments();

    const productosActivos = await Producto.countDocuments({ activo: true });

    const valorInventario = await Producto.aggregate([

      {

        $group: {

          _id: null,

          total: { $sum: { $multiply: ['$precio', '$stock'] } }

        }

      }

    ]);

    const productosPorCategoria = await Producto.aggregate([

      {

        $group: {

          _id: '$categoria',

          cantidad: { $sum: 1 },

          valorTotal: { $sum: { $multiply: ['$precio', '$stock'] } }

        }

      }

    ]);
 
    res.json({

      success: true,

      data: {

        totalProductos,

        productosActivos,

        productosInactivos: totalProductos - productosActivos,

        valorInventario: valorInventario[0]?.total || 0,

        productosPorCategoria

      }

    });

  } catch (error) {

    console.error('Error al obtener estadísticas:', error);

    res.status(500).json({

      success: false,

      message: 'Error al obtener estadísticas',

      error: error instanceof Error ? error.message : 'Error desconocido'

    });

  }

});
 
// GET - Health check

app.get('/api/health', (req: Request, res: Response) => {

  res.json({

    success: true,

    message: 'API funcionando correctamente',

    timestamp: new Date().toISOString(),

    database: mongoose.connection.readyState === 1 ? 'Conectada' : 'Desconectada'

  });

});
 
// Ruta de bienvenida

app.get('/', (req: Request, res: Response) => {

  res.json({

    message: 'Bienvenido a la API de Productos',

    version: '1.0.0',

    endpoints: {

      productos: '/api/productos',

      estadisticas: '/api/estadisticas',

      health: '/api/health'

    }

  });

});
 
// Manejo de rutas no encontradas

app.use((req: Request, res: Response) => {

  res.status(404).json({

    success: false,

    message: 'Ruta no encontrada',

    path: req.path

  });

});
 
// Iniciar servidor

app.listen(PORT, () => {

  console.log(`\n🚀 ========================================`);

  console.log(`   Servidor corriendo en:`);

  console.log(`   http://localhost:${PORT}`);

  console.log(`========================================\n`);

  console.log(`📚 API Endpoints disponibles:`);

  console.log(`   GET    /api/productos`);

  console.log(`   GET    /api/productos/:id`);

  console.log(`   POST   /api/productos`);

  console.log(`   PUT    /api/productos/:id`);

  console.log(`   DELETE /api/productos/:id`);

  console.log(`   GET    /api/estadisticas`);

  console.log(`   GET    /api/health`);

  console.log(`========================================\n`);

});
 
export default app;
 