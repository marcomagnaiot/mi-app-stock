# Mi App Base

## Descripción
Base técnica limpia y reutilizable para proyectos React con las siguientes tecnologías configuradas.

## Stack Tecnológico

- **Frontend**: React 19+ con Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Backend-as-a-Service)
- **Deployment**: Vercel (configurado)

## Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas principales de la aplicación
├── hooks/         # Hooks personalizados
├── context/       # Contextos de React
├── assets/        # Archivos estáticos
├── App.jsx        # Componente principal
├── main.jsx       # Punto de entrada con rutas
├── index.css      # Estilos globales (Tailwind)
├── App.css        # Estilos personalizados (usar solo si es necesario)
└── supabaseClient.js  # Cliente único de Supabase
```

## Configuración

### Variables de Entorno
Copia el archivo `.env` y configura tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Características Incluidas

- ✅ Cliente de Supabase configurado
- ✅ Estructura de carpetas organizada
- ✅ Hook básico de autenticación
- ✅ Routing con React Router DOM
- ✅ Componente App limpio y responsivo
- ✅ CSS base funcional (Tailwind CSS se puede agregar posteriormente)
- ✅ Variables de entorno configuradas
- ✅ Listo para deployment en Vercel
- ✅ Aplicación funcionando correctamente

## Próximos Pasos

1. Configura tu proyecto en Supabase
2. Actualiza las variables de entorno en `.env`
3. Define tu brief del proyecto
4. Crea los componentes específicos en `src/components/`
5. Crea las páginas específicas en `src/pages/`
6. Implementa la lógica de negocio

## Patrones Recomendados

- Usar componentes funcionales únicamente
- Preferir hooks (useState, useEffect, useContext)
- Usar clases de Tailwind CSS en lugar de CSS personalizado
- Todas las llamadas a Supabase deben ser asíncronas con manejo de errores
- Importar el cliente de Supabase desde `src/supabaseClient.js`

## Deployment

El proyecto está configurado para deployment automático en Vercel. Solo conecta tu repositorio de GitHub y configura las variables de entorno en el dashboard de Vercel.
