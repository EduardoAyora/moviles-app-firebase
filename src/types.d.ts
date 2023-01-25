interface Usuario {
  username: string;
  password: string;
  confirmPassword?: string;
}

interface Cliente {
  id: number;
  tipoIdentificacion: string;
  identificacionNumero: string;
  nombre: string;
  direccion: string;
  telefono: string;
  correoElectronico: string;
}

interface Servicio {
  id: number;
  descripcion: string,
  precioUnitario: number,
  usuarioId: number
}

interface DetalleFactura {
  cantidad: number;
  precioUnitario: number;
  total: number;
  servicioId: number;
  servicio?: { descripcion: string }
}

interface Factura {
  id: number;
  fechaDeEmision: string;
  subtotal: number;
  impuesto: number;
  total: number;
  clienteId: number;
  usuarioId: number;
  detalles: DetalleFactura[]
  cliente?: {
    id: number;
    tipoIdentificacion: string;
    identificacionNumero: string;
    nombre: string;
    direccion: string;
    telefono: string;
    correoElectronico: string;
  },
}