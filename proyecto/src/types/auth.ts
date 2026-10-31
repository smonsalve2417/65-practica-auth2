export interface Usuario {
  id:     string;
  nombre: string;
  email:  string;
  rol:    'admin' | 'editor' | 'viewer';
  activo: boolean;
}

export interface LoginPayload {
  email:    string;
  password: string;
}
