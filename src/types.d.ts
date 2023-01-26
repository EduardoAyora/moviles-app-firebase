interface Medico {
  nombre: string;
  imagen: string;
  email: string;
  direccion: string;
  especialidades: string;
}

interface Paciente {
  nombre: string;
}

interface Cita {
  id: string;
  fecha: any;
  estado: boolean;
  paciente: Paciente;
  medico: Medico;
  idPaciente: string;
  nombrePaciente: string;
  atendida: boolean;
  cancelado: boolean;
  fotoPaciente: string;
}
