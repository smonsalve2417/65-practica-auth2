// API de la práctica. Está bien: los bugs están en src/, no aquí.
//
//   POST /api/auth/login     { email, password } → { usuario } + cookies
//   GET  /api/auth/me        el usuario de la sesión
//   POST /api/auth/refresh   renueva la cookie access_token
//   POST /api/auth/logout    cierra la sesión y borra las cookies
//   GET  /api/resumen        totales para el inicio
//   GET  /api/usuarios       la lista; solo admin y editor

import http from 'node:http';
import crypto from 'node:crypto';

const PUERTO = 3000;
const ORIGEN = 'http://localhost:5173';
const DURA_ACCESS = 60;               // segundos: corto a propósito
const DURA_REFRESH = 60 * 60 * 24;
const CLAVE = 'clase123';

const usuarios = [
  { id: '1', nombre: 'Ana Torres', email: 'ana@demo.co',   rol: 'admin',  activo: true },
  { id: '2', nombre: 'Beto Ruiz',  email: 'beto@demo.co',  rol: 'editor', activo: true },
  { id: '3', nombre: 'Carla Díaz', email: 'carla@demo.co', rol: 'viewer', activo: true },
  { id: '4', nombre: 'Diego Peña', email: 'diego@demo.co', rol: 'viewer', activo: false },
  { id: '5', nombre: 'Elena Mora', email: 'elena@demo.co', rol: 'editor', activo: true },
];

const sesionesAccess = new Map();     // token → { id, vence }
const sesionesRefresh = new Map();

function crearToken(sesiones, id, segundos) {
  const token = crypto.randomBytes(24).toString('base64url');
  sesiones.set(token, { id, vence: Date.now() + segundos * 1000 });
  return token;
}

function usuarioDe(sesiones, token) {
  const sesion = token && sesiones.get(token);
  if (!sesion || sesion.vence < Date.now()) return null;
  return usuarios.find((u) => u.id === sesion.id) ?? null;
}

function leerCookies(req) {
  const cookies = {};
  for (const par of (req.headers.cookie ?? '').split(';')) {
    const i = par.indexOf('=');
    if (i > 0) cookies[par.slice(0, i).trim()] = par.slice(i + 1).trim();
  }
  return cookies;
}

function cookie(nombre, valor, segundos, path) {
  return `${nombre}=${valor}; HttpOnly; SameSite=Lax; Path=${path}; Max-Age=${segundos}`;
}

function responder(res, status, cuerpo, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  res.end(cuerpo === undefined ? undefined : JSON.stringify(cuerpo));
}

async function leerCuerpo(req) {
  let texto = '';
  for await (const parte of req) texto += parte;
  try { return JSON.parse(texto || '{}'); } catch { return {}; }
}

http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ORIGEN);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  await new Promise((r) => setTimeout(r, 300));    // que se note la red

  const ruta = req.url.split('?')[0];
  const cookies = leerCookies(req);
  const yo = usuarioDe(sesionesAccess, cookies.access_token);

  if (ruta === '/api/auth/login' && req.method === 'POST') {
    const { email, password } = await leerCuerpo(req);
    const usuario = usuarios.find((u) => u.email === email && u.activo);
    if (!usuario || password !== CLAVE) {
      return responder(res, 401, { error: 'Email o contraseña incorrectos' });
    }
    return responder(res, 200, { usuario }, {
      'Set-Cookie': [
        cookie('access_token', crearToken(sesionesAccess, usuario.id, DURA_ACCESS), DURA_ACCESS, '/'),
        cookie('refresh_token', crearToken(sesionesRefresh, usuario.id, DURA_REFRESH), DURA_REFRESH, '/api/auth'),
      ],
    });
  }

  if (ruta === '/api/auth/me' && req.method === 'GET') {
    return yo ? responder(res, 200, yo) : responder(res, 401, { error: 'Sin sesión' });
  }

  if (ruta === '/api/auth/refresh') {
    if (req.method !== 'POST') return responder(res, 405, { error: 'Método no permitido' }, { Allow: 'POST' });
    const usuario = usuarioDe(sesionesRefresh, cookies.refresh_token);
    if (!usuario) return responder(res, 401, { error: 'Sin sesión' });
    return responder(res, 204, undefined, {
      'Set-Cookie': cookie('access_token', crearToken(sesionesAccess, usuario.id, DURA_ACCESS), DURA_ACCESS, '/'),
    });
  }

  if (ruta === '/api/auth/logout' && req.method === 'POST') {
    sesionesAccess.delete(cookies.access_token);
    sesionesRefresh.delete(cookies.refresh_token);
    return responder(res, 204, undefined, {
      'Set-Cookie': [
        cookie('access_token', '', 0, '/'),
        cookie('refresh_token', '', 0, '/api/auth'),
      ],
    });
  }

  if (ruta === '/api/resumen' && req.method === 'GET') {
    if (!yo) return responder(res, 401, { error: 'Sin sesión' });
    const contar = (rol) => usuarios.filter((u) => u.rol === rol).length;
    return responder(res, 200, {
      total:   usuarios.length,
      activos: usuarios.filter((u) => u.activo).length,
      porRol:  { admin: contar('admin'), editor: contar('editor'), viewer: contar('viewer') },
    });
  }

  if (ruta === '/api/usuarios' && req.method === 'GET') {
    if (!yo) return responder(res, 401, { error: 'Sin sesión' });
    if (yo.rol === 'viewer') return responder(res, 403, { error: 'No tienes permiso' });
    return responder(res, 200, usuarios);
  }

  responder(res, 404, { error: 'No existe' });
}).listen(PUERTO, () => console.log(`  API en http://localhost:${PUERTO}/api`));
