export interface Pallet {
    id: string;
    codigo: string;
    cantidadCajas: number;
    estado: string;
    ubicacion: string;
    fechaCreacion: string;
    cajas: [];
    fechaCalibreFormato: string;
  }
  
  export interface UnassignedBox {
    codigo: string;
    año?: string;
    calibre?: string;
    contador?: string;
    dia_semana?: string;
    empacador_id?: string;
    estado?: string;
    fecha_registro?: string;
    formato_caja?: string;
    horario_proceso?: string;
    operario?: string;
    palletId?: string;
    semana?: string;
    ubicacion?: string;
  }