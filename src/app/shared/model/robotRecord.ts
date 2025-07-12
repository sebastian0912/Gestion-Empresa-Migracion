export interface RobotRecord {
  cola: number;
  nombre: string;
  estado: 'Activo' | 'Inactivo' | 'Pendiente';
  nombreRobot: string;
  fecha: Date;
  hora: string;
  pagina: 'Adres' | 'Policivo' | 'OFAC' | 'Contraloria' | 'Sisben' | 'Procuraduria' | 'Pension' | 'Union';
  id: number;
}