# 🚀 Guía Definitiva: Migración de PHP/MySQL a un Stack Moderno

## 📖 Introducción: El Nuevo Paradigma de Desarrollo Web

Esta guía está diseñada para desarrolladores con experiencia en PHP y MySQL que desean migrar a un stack moderno. Si estás acostumbrado a XAMPP, phpMyAdmin y deployment vía FTP, esta transición te llevará a un flujo de trabajo más eficiente y poderoso.

### 🎯 Filosofía del Cambio

El desarrollo web moderno se basa en la **separación de responsabilidades**:
- **Frontend:** Se encarga de la interfaz de usuario (React).
- **Backend:** Proporciona datos y lógica de negocio (APIs).
- **Base de datos:** Almacena información (PostgreSQL).
- **Deployment:** Automatizado y escalable (Vercel).

### 🎉 Objetivos de Aprendizaje

Al completar esta guía, dominarás:
- ✅ **React** para crear interfaces dinámicas.
- ✅ **Supabase** como Backend-as-a-Service.
- ✅ **Autenticación completa** (email + OAuth).
- ✅ **Control de versiones** con Git.
- ✅ **Deployment automático** con Vercel.
- ✅ **Arquitecturas escalables** modernas.

---

## 🏗️ PARTE 1: COMPARACIÓN DE ARQUITECTURAS

### 📊 Evolución del Desarrollo Web

#### 🏠 ARQUITECTURA TRADICIONAL (LAMP/WAMP)
```
Navegador → Servidor Web → PHP → MySQL → HTML Generado
```
- **Modelo:** Server-Side Rendering (SSR). El servidor construye la página completa en cada petición.
- **Ventajas:** Simple, buen SEO inicial, hosting económico.
- **Desventajas:** Experiencia de usuario lenta (recargas), escalabilidad limitada, acoplamiento tecnológico.

#### 🌐 ARQUITECTURA MODERNA (JAMstack/SPA)
```
React App (en Navegador) → API Gateway → Microservicios/Funciones → Base de Datos → JSON
```
- **Modelo:** Client-Side Rendering (CSR). El navegador recibe datos (JSON) y construye la interfaz.
- **Ventajas:** Experiencia de usuario fluida (sin recargas), alta escalabilidad, separación de equipos (frontend/backend).
- **Desventajas:** Complejidad inicial mayor, SEO requiere técnicas adicionales.

### 🤔 ¿Por Qué Migrar?

La transición a una arquitectura moderna, aunque inicialmente compleja, ofrece beneficios significativos:
- **📈 Demanda del Mercado:** Habilidades en React/Vue/Angular son altamente cotizadas.
- **⚡ Ventajas Técnicas:** Aplicaciones más rápidas, mantenibles y colaborativas.
- **💰 Beneficios Comerciales:** Costos optimizados, escalabilidad flexible y desarrollo más rápido.

### 🏠 Opciones de Arquitectura

Es común preguntarse si es necesario separar el frontend y el backend. Si bien la arquitectura distribuida es la tendencia, existen modelos unificados:

#### **🔧 VPS Tradicional (Hostinger, DigitalOcean):**
Un servidor único donde instalas Node.js, la base de datos y sirves tanto el frontend compilado como las APIs.
- **Pros:** Control total, costo fijo, arquitectura familiar.
- **Contras:** Configuración manual, escalabilidad limitada, mantenimiento a cargo del desarrollador.

#### **🔧 Plataforma Unificada (Railway, Heroku):**
Plataformas que simplifican el modelo "todo en uno", detectando y desplegando los servicios necesarios (frontend, backend, DB) bajo un mismo paraguas.
- **Pros:** Simplicidad, deployment automático, escalabilidad gestionada.
- **Contras:** Menos control granular, dependencia de la plataforma.

#### **🔧 Arquitectura Distribuida (Vercel + Supabase):**
El enfoque de esta guía. Cada parte de la aplicación es un servicio especializado y optimizado.
- **Pros:** Máxima especialización y performance, escalabilidad casi infinita, servicios administrados.
- **Contras:** Arquitectura distribuida, requiere gestionar la comunicación entre múltiples servicios.

---

## 🛠️ PARTE 2: PREPARANDO EL ENTORNO DE DESARROLLO

### 🧰 Herramientas Indispensables

#### **1. Node.js y npm**
- **Analogía:** Node.js es tu nuevo motor (como Apache + PHP). npm es tu gestor de paquetes (como Composer).
- **Instalación:** Descarga la versión LTS desde [nodejs.org](https://nodejs.org). npm se instala automáticamente.
- **Verificación:** Abre una terminal y ejecuta `node --version` y `npm --version`.

#### **2. Git**
- **Analogía:** Tu sistema de control de versiones, reemplazando el FTP y las carpetas `_v2_final`.
- **Instalación:** Descarga desde [git-scm.com](https://git-scm.com).

#### **3. Visual Studio Code**
- **Analogía:** Tu editor de código (como PhpStorm o Sublime Text), optimizado para JavaScript.
- **Extensiones Recomendadas:** `ES7+ React/Redux/React-Native snippets`, `Prettier - Code formatter`, `Tailwind CSS IntelliSense`.

### 🔑 Cuentas Esenciales

#### **1. GitHub**
- **Analogía:** Tu repositorio de código en la nube, donde guardas el historial de tu proyecto.
- **Acción:** Crea una cuenta en [github.com](https://github.com).

#### **2. Supabase**
- **Analogía:** Tu MySQL + phpMyAdmin + lógica de autenticación, todo en un servicio.
- **Acción:** Crea una cuenta en [supabase.com](https://supabase.com), preferiblemente usando tu cuenta de GitHub.

#### **3. Vercel**
- **Analogía:** Tu servicio de hosting moderno, conectado directamente a Git.
- **Acción:** Crea una cuenta en [vercel.com](https://vercel.com), usando tu cuenta de GitHub.

---

## 🧠 PARTE 3: CREANDO EL FRONTEND CON REACT Y VITE

### 🏗️ Creando el Proyecto

```bash
# 1. Crea el proyecto con la plantilla de React
npm create vite@latest mi-app-stock -- --template react

# 2. Navega a la carpeta del proyecto
cd mi-app-stock

# 3. Instala las dependencias (equivalente a 'composer install')
npm install

# 4. Inicia el servidor de desarrollo
npm run dev
```
Abre la URL que aparece en la terminal (ej. `http://localhost:5173`).

### 🛣️ Configurando las Rutas (Páginas)

**Analogía:** `react-router-dom` es tu nuevo `.htaccess` con `mod_rewrite`, pero se ejecuta en el navegador.

```bash
# Instala la librería de ruteo
npm install react-router-dom
```

**Configuración en `src/main.jsx`:**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa tus componentes de página
import App from './App.jsx';
// import LoginPage from './pages/LoginPage.jsx';
// import DashboardPage from './pages/DashboardPage.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
```

---

## 🗃️ PARTE 4: CONFIGURANDO EL BACKEND CON SUPABASE

### 🔧 Creación y Conexión del Proyecto

#### **Paso 1: Crear un Proyecto en Supabase**
1. En tu dashboard de Supabase, haz clic en **"New project"**.
2. Asígnale un nombre (ej. `mi-app-stock`).
3. Genera una contraseña segura para la base de datos y guárdala.
4. Elige la región más cercana a tus usuarios.
5. Haz clic en **"Create new project"**.

#### **Paso 2: Obtener Credenciales de API**
1.  En el panel de tu proyecto, busca el ícono de engranaje (⚙️) en el menú lateral izquierdo (**Settings**).
2.  Haz clic en **"API"**.
3.  En la sección **"Project API keys"**, copia estos dos valores:
    *   **Project URL:** La URL única de tu backend.
    *   **anon (public):** La clave pública y segura para usar en el frontend.

**¡Atención!** Nunca uses la clave `service_role` (secreta) en tu código de frontend.

#### **Paso 3: Conectar la App React con Supabase**
```bash
# Instala el cliente de Supabase
npm install @supabase/supabase-js
```

**Crea el archivo `src/supabaseClient.js`:**
```javascript
import { createClient } from '@supabase/supabase-js';

// Obtiene las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Crea y exporta el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 🔐 Configurando Variables de Entorno

**Analogía:** El archivo `.env` es tu nuevo `config.php` que nunca subes a Git.

1.  **Crea un archivo `.env`** en la raíz de tu proyecto.
2.  **Añade tus claves de Supabase:**
    ```env
    VITE_SUPABASE_URL=URL_DE_TU_PROYECTO_SUPABASE
    VITE_SUPABASE_ANON_KEY=TU_ANON_PUBLIC_KEY
    ```
3.  **Asegúrate de que `.env` esté en tu `.gitignore`**. Si no está, añádelo:
    ```gitignore
    # Local environment variables
    .env
    ```

---

## 📊 PARTE 5: DISEÑANDO LA BASE DE DATOS

### 🏗️ Creando Tablas con el Editor SQL

1.  En tu proyecto de Supabase, ve a **"SQL Editor"** (ícono de terminal).
2.  Haz clic en **"+ New query"**.
3.  Pega y ejecuta los siguientes scripts para crear tus tablas.

#### **Tabla de Productos:**
```sql
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Tabla de Ventas:**
```sql
CREATE TABLE sales (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 🔒 Implementando Seguridad (Row Level Security)

**Analogía:** Es como añadir `WHERE user_id = ?` a cada consulta en PHP, pero de forma automática y segura.

1.  **Habilita RLS** en tus tablas:
    ```sql
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
    ```
2.  **Crea políticas de acceso:**
    ```sql
    -- Cualquiera puede ver los productos
    CREATE POLICY "Products are viewable by everyone."
      ON products FOR SELECT USING (true);

    -- Solo usuarios autenticados pueden crear, ver, editar y borrar sus productos
    CREATE POLICY "Users can manage their own products."
      ON products FOR ALL USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    -- (Añade una columna user_id a tu tabla products para que esto funcione)
    -- ALTER TABLE products ADD COLUMN user_id UUID REFERENCES auth.users(id);
    ```

---

## 🚀 PARTE 6: DEPLOYMENT Y TROUBLESHOOTING

### 🔗 Configuración de Git y GitHub

1.  **Configura tu identidad en Git** (solo la primera vez):
    ```bash
    git config --global user.name "Tu Nombre"
    git config --global user.email "tu@email.com"
    ```
2.  **Inicializa el repositorio y haz tu primer commit:**
    ```bash
    git init
    git add .
    git commit -m "Initial commit: Project setup"
    ```
3.  **Crea un repositorio en GitHub** y conecta tu proyecto local:
    ```bash
    git remote add origin https://github.com/tu-usuario/tu-repo.git
    git push -u origin main
    ```

### 🚀 Deployment en Vercel

1.  **Importa tu proyecto desde GitHub** en el dashboard de Vercel.
2.  Vercel detectará la configuración de Vite automáticamente. **No cambies nada**.
3.  **Configura las Variables de Entorno:**
    *   Ve a **Settings > Environment Variables**.
    *   Añade `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con sus respectivos valores.
4.  Haz clic en **"Deploy"**.

### 🚨 Troubleshooting de Deployment

#### **Problema 1: Error 404 en las rutas de la SPA**
- **Síntoma:** La página principal carga, pero al navegar a `/login` o recargarla, aparece un 404.
- **Causa:** Vercel busca un archivo físico en esa ruta.
- **Solución:** Crea un archivo `vercel.json` en la raíz del proyecto para redirigir todas las peticiones al `index.html`.
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
- **Acción:** Haz commit y push de este archivo. Vercel hará un redeploy automático.

#### **Problema 2: Error "supabaseUrl is required" en producción**
- **Síntoma:** La app desplegada está en blanco y la consola muestra este error.
- **Causa:** Las variables de entorno no se configuraron en Vercel o tienen un nombre incorrecto.
- **Solución:**
    1.  Verifica en **Vercel > Settings > Environment Variables** que los nombres (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) sean exactos.
    2.  Asegúrate de que los valores no tengan espacios extra.
    3.  Si hiciste cambios, haz un redeploy manual desde el dashboard de Vercel.

---

## 🔑 PARTE 7: CONFIGURACIÓN DETALLADA DE GOOGLE OAUTH

### 🛠️ Pasos en Google Cloud Console

1.  **Crea un proyecto** en [console.cloud.google.com](https://console.cloud.google.com).
2.  **Configura la Pantalla de Consentimiento (OAuth consent screen):**
    *   Selecciona **"External"**.
    *   Rellena el nombre de la app, email de soporte y contacto.
3.  **Crea Credenciales:**
    *   Ve a **Credentials > + CREATE CREDENTIALS > OAuth 2.0 Client ID**.
    *   **Application type:** "Web application".
    *   **Authorized JavaScript origins:** Añade `http://localhost:5173` (para desarrollo) y tu URL de Vercel (ej. `https://mi-app.vercel.app`).
    *   **Authorized redirect URIs:** Añade la URL de callback de Supabase. La encuentras en **Supabase > Authentication > Providers > Google**. Tiene el formato: `https://<id-proyecto>.supabase.co/auth/v1/callback`.
4.  **Copia el Client ID y Client Secret**.

### 🔧 Pasos en Supabase

1.  Ve a **Authentication > Providers** y activa **Google**.
2.  Pega el **Client ID** y **Client Secret** que obtuviste de Google.
3.  Asegúrate de que la URL de redirección esté listada.
4.  Haz clic en **"Save"**.

### 🚨 Troubleshooting de OAuth

- **Error `redirect_uri_mismatch`:** Las URIs en Google Cloud Console no coinciden exactamente con las que envía Supabase. Revisa que no falte `https://` o una barra `/` al final.
- **Error `access_denied`:** El usuario denegó el permiso o la pantalla de consentimiento no está bien configurada.
- **Login con Google funciona pero no redirige bien:** Asegúrate de tener una ruta y un componente de `callback` en tu app React que maneje la sesión después de la redirección.

---

## 🏆 CONCLUSIÓN

¡Felicidades! Has completado la migración a un stack moderno. Ahora posees las habilidades para construir aplicaciones web robustas, escalables y con una experiencia de usuario de primer nivel.

### ✅ Resumen de Habilidades Adquiridas:
- **Desarrollo Frontend Moderno** con React y Vite.
- **Gestión de Backend como Servicio** con Supabase.
- **Implementación de Autenticación Segura** (Email y OAuth).
- **Flujo de Trabajo Profesional** con Git, GitHub y CI/CD.
- **Resolución de Problemas Comunes** de deployment y configuración.

**¡Bienvenido al futuro del desarrollo web!** 🚀
