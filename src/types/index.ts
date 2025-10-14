export interface Pallet {
    id: string;
    codigo: string;
    cantidadCajas?: number; // Optional: may be undefined for legacy data
    estado: string;
    ubicacion: string;
    fechaCreacion: string;
    cajas?: string[]; // Optional: may be boxes instead
    boxes?: string[]; // Alternative field name from API
    fechaCalibreFormato?: string;
    calibre?: string;
    formato?: string;
    maxBoxes?: number;
    fechaCierre?: string | null;
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

  export interface ApiEnvelope<T = unknown> {
    status: 'success' | 'fail' | 'error';
    data?: T | null;
    message?: string;
    meta?: {
      requestId?: string;
      timestamp?: string;
    };
  }

  // Consolidated API response types
  export interface ConsolidatedResponse<T> {
    success: boolean;
    data: T;
    error?: {
      code: string;
      message: string;
    };
  }

  export interface PaginatedData<T> {
    items: T[];
    count: number;
    nextKey?: string | null;
  }
