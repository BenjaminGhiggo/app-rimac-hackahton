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
    } catch (error) {
      console.error(`Error en ${endpoint}:`, error);
      throw error;
    }
  }

  // Triaje
  async realizarTriaje(data: TriajeRequest): Promise<TriajeResponse> {
    return this.fetchApi<TriajeResponse>('/triaje', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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
    return this.fetchApi('/emergencias/activar', {
      method: 'POST',
      body: JSON.stringify({ usuarioId, sintomas, descripcion }),
    });
  }

  // Usuario
  async obtenerDatosUsuario(usuarioId: string) {
    return this.fetchApi(`/usuarios/${usuarioId}`);
  }

  // Citas (se implementarán cuando se cree el backend)
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

  // Onboarding (se implementará cuando se cree el backend)
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

