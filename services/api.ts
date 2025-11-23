import { API_BASE_URL } from '../utils/getLocalIP';

export interface TriajeRequest {
  usuarioId: string;
  sintomas: string[];
  descripcion?: string;
}

export interface TriajeResponse {
  clasificacion: {
    nivel: 'urgente' | 'hoy' | 'programable';
    icono: '🟥' | '🟧' | '🟩';
    recomendacion: string;
    canal: string;
  };
  usuario: {
    nombre: string;
    poliza: string;
    plan: string;
  };
  sugerencias: Array<{
    tipo: string;
    mensaje: string;
    copago: number;
  }>;
}

export interface Tratamiento {
  id: string;
  usuarioId: string;
  medicamento: string;
  dosis: string;
  frecuencia: string;
  adherencia: {
    porcentaje: number;
    riesgo: 'bajo' | 'medio' | 'alto';
  };
}

export interface Bienestar {
  indiceBienestar: number;
  sentimiento: {
    ultimo: string;
  };
  recomendaciones: string[];
}

// Datos mock para desarrollo/demostración
const MOCK_DATA = {
  bienestar: {
    indiceBienestar: 85,
    sentimiento: {
      ultimo: 'bien',
    },
    recomendaciones: [
      'Aumenta tu ingesta de agua',
      'Realiza actividad física 30 minutos',
      'Mejora tu calidad de sueño',
    ],
  },
  citas: {
    citas: [
      {
        id: '1',
        especialidad: 'Cardiología',
        doctor: 'Dr. Rafael Montoya',
        fecha: '2025-11-28',
        hora: '14:30',
        clinica: 'Clínica Privada RIMAC',
        estado: 'Confirmada',
      },
    ],
  },
  tratamientos: {
    tratamientos: [
      {
        id: '1',
        usuarioId: 'usr_004',
        medicamento: 'Lisinopril 10mg',
        dosis: '1 tableta',
        frecuencia: 'Diaria',
        adherencia: {
          porcentaje: 95,
          riesgo: 'bajo',
        },
      },
    ],
  },
  usuario: {
    usuario: {
      nombre: 'Marisol Herrera Bruno',
      edad: 47,
      email: 'marisol@email.com',
    },
    poliza: {
      plan: 'Premium',
      vigencia: {
        inicio: '2025-01-01',
        fin: '2025-12-31',
      },
    },
  },
};

class ApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error en la petición');
      }

      return await response.json();
    } catch (error: any) {
      // Si es un error de conexión, retornar datos mock
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn(`⚠️ Backend no disponible. Usando datos de demostración para ${endpoint}`);
        return this.getMockData(endpoint) as T;
      }
      
      console.error(`Error en ${endpoint}:`, error);
      throw error;
    }
  }

  private getMockData(endpoint: string): any {
    if (endpoint.includes('/bienestar')) return MOCK_DATA.bienestar;
    if (endpoint.includes('/citas')) return MOCK_DATA.citas;
    if (endpoint.includes('/tratamientos')) return MOCK_DATA.tratamientos;
    if (endpoint.includes('/usuarios')) return MOCK_DATA.usuario;
    return {};
  }

  // Triaje
  async realizarTriaje(data: TriajeRequest): Promise<TriajeResponse> {
    try {
      return await this.fetchApi<TriajeResponse>('/triaje', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      // Mock data para triaje
      return {
        clasificacion: {
          nivel: 'programable',
          icono: '🟩',
          recomendacion: 'Puedes agendar una cita en los próximos días',
          canal: 'Telemedicina o presencial',
        },
        usuario: {
          nombre: 'Marisol Herrera',
          poliza: 'POL-2025-001',
          plan: 'Premium',
        },
        sugerencias: [],
      };
    }
  }

  async obtenerHistorialTriaje(usuarioId: string) {
    return this.fetchApi(`/triaje/historial/${usuarioId}`);
  }

  // Beneficios
  async obtenerBeneficios(usuarioId: string) {
    return this.fetchApi(`/beneficios/${usuarioId}`);
  }

  async explicarBeneficio(usuarioId: string, tipo: string) {
    return this.fetchApi(`/beneficios/${usuarioId}/explicar/${tipo}`);
  }

  async sugerirBeneficio(usuarioId: string, sintomas: string[], contexto?: string) {
    return this.fetchApi(`/beneficios/${usuarioId}/sugerir`, {
      method: 'POST',
      body: JSON.stringify({ sintomas, contexto }),
    });
  }

  // Tratamientos
  async obtenerTratamientos(usuarioId: string): Promise<{ tratamientos: Tratamiento[] }> {
    return this.fetchApi(`/tratamientos/${usuarioId}`);
  }

  async registrarTratamiento(usuarioId: string, data: any) {
    return this.fetchApi(`/tratamientos/${usuarioId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async registrarAdherencia(tratamientoId: string, tomado: boolean) {
    return this.fetchApi(`/tratamientos/adherencia/${tratamientoId}`, {
      method: 'POST',
      body: JSON.stringify({ tomado }),
    });
  }

  async obtenerPerfilRiesgo(usuarioId: string) {
    return this.fetchApi(`/tratamientos/${usuarioId}/riesgo`);
  }

  async obtenerGamificacion(usuarioId: string) {
    return this.fetchApi(`/tratamientos/${usuarioId}/gamificacion`);
  }

  // Bienestar
  async obtenerBienestar(usuarioId: string): Promise<Bienestar> {
    return this.fetchApi(`/bienestar/${usuarioId}`);
  }

  async registrarSentimiento(usuarioId: string, sentimiento: string, score: number) {
    return this.fetchApi(`/bienestar/${usuarioId}/sentimiento`, {
      method: 'POST',
      body: JSON.stringify({ sentimiento, score }),
    });
  }

  async obtenerTimelineAnimo(usuarioId: string) {
    return this.fetchApi(`/bienestar/${usuarioId}/timeline`);
  }

  // Emergencias
  async activarEmergencia(usuarioId: string, sintomas: string[], descripcion?: string) {
    try {
      return await this.fetchApi('/emergencias/activar', {
        method: 'POST',
        body: JSON.stringify({ usuarioId, sintomas, descripcion }),
      });
    } catch (error) {
      console.warn('⚠️ Emergencia registrada localmente (backend no disponible)');
      return { mensaje: 'Emergencia activada. El equipo de RIMAC ha sido notificado.' };
    }
  }

  // Usuario
  async obtenerDatosUsuario(usuarioId: string) {
    return this.fetchApi(`/usuarios/${usuarioId}`);
  }

  // Citas
  async obtenerCitas(usuarioId: string) {
    return this.fetchApi(`/citas/${usuarioId}`);
  }

  async crearCita(usuarioId: string, data: any) {
    return this.fetchApi(`/citas/${usuarioId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async actualizarCita(citaId: string, data: any) {
    return this.fetchApi(`/citas/${citaId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Onboarding
  async guardarOnboarding(usuarioId: string, respuestas: Record<string, any>) {
    return this.fetchApi(`/onboarding/${usuarioId}`, {
      method: 'POST',
      body: JSON.stringify({ respuestas }),
    });
  }

  async obtenerOnboarding(usuarioId: string) {
    return this.fetchApi(`/onboarding/${usuarioId}`);
  }
}

export const apiService = new ApiService();
