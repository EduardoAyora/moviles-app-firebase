interface Medico {
  nombre: string;
  imagen: string;
}

interface Paciente {
  nombre: string;
}

interface Cita {
  fecha: string;
  estado: boolean;
  paciente: Paciente;
  medico: Medico;
}
