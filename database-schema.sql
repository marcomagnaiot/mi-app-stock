-- ================================================
-- BASE DE DATOS PARA SISTEMA DE NOTAS CON AUTH
-- ================================================

-- Crear tabla para notas de usuario
CREATE TABLE IF NOT EXISTS public.notas_usuario (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    contenido TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at automático
CREATE TRIGGER trigger_notas_updated_at
    BEFORE UPDATE ON public.notas_usuario
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

-- Activar Row Level Security (RLS)
ALTER TABLE public.notas_usuario ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver sus propias notas
CREATE POLICY "Users can only access their own notes" 
    ON public.notas_usuario 
    FOR ALL 
    USING (auth.uid() = user_id);

-- Política específica para INSERT
CREATE POLICY "Users can insert their own notes" 
    ON public.notas_usuario 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Política específica para UPDATE
CREATE POLICY "Users can update their own notes" 
    ON public.notas_usuario 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Política específica para DELETE
CREATE POLICY "Users can delete their own notes" 
    ON public.notas_usuario 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- ================================================
-- DATOS DE PRUEBA (OPCIONAL)
-- ================================================

-- Función para crear notas de prueba para un usuario
CREATE OR REPLACE FUNCTION crear_notas_prueba(usuario_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.notas_usuario (user_id, titulo, contenido) VALUES
    (usuario_id, 'Mi primera nota', 'Esta es mi primera nota en el sistema. ¡Funciona perfectamente!'),
    (usuario_id, 'Lista de tareas', 'Tareas pendientes:
- Terminar el proyecto
- Revisar código
- Hacer deployment'),
    (usuario_id, 'Reunión importante', 'Notas de la reunión:
- Discutir nuevas funcionalidades
- Revisar timeline del proyecto
- Asignar responsabilidades');
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- CONFIGURACIÓN DE AUTENTICACIÓN
-- ================================================

-- Configurar templates de email (ejecutar en SQL Editor)
-- Nota: Estos se pueden personalizar desde Supabase Dashboard

-- Vista para obtener información del usuario con sus notas
CREATE OR REPLACE VIEW vista_usuario_notas AS
SELECT 
    u.id as user_id,
    u.email,
    u.created_at as usuario_created_at,
    COUNT(n.id) as total_notas,
    MAX(n.updated_at) as ultima_actividad
FROM auth.users u
LEFT JOIN public.notas_usuario n ON u.id = n.user_id
GROUP BY u.id, u.email, u.created_at;

-- ================================================
-- FUNCIONES ÚTILES
-- ================================================

-- Función para obtener estadísticas del usuario
CREATE OR REPLACE FUNCTION obtener_estadisticas_usuario(usuario_id UUID)
RETURNS TABLE (
    total_notas INTEGER,
    nota_mas_reciente TIMESTAMP WITH TIME ZONE,
    nota_mas_antigua TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_notas,
        MAX(created_at) as nota_mas_reciente,
        MIN(created_at) as nota_mas_antigua
    FROM public.notas_usuario
    WHERE user_id = usuario_id;
END;
$$ LANGUAGE plpgsql;

-- Función para buscar notas por texto
CREATE OR REPLACE FUNCTION buscar_notas(usuario_id UUID, texto_busqueda TEXT)
RETURNS TABLE (
    id BIGINT,
    titulo TEXT,
    contenido TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.titulo,
        n.contenido,
        n.created_at,
        n.updated_at
    FROM public.notas_usuario n
    WHERE n.user_id = usuario_id
    AND (
        n.titulo ILIKE '%' || texto_busqueda || '%' 
        OR n.contenido ILIKE '%' || texto_busqueda || '%'
    )
    ORDER BY n.updated_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- INSTRUCCIONES DE USO
-- ================================================

/*
PASOS PARA CONFIGURAR:

1. Ejecutar este script completo en Supabase SQL Editor
2. Ir a Authentication → Settings:
   - Enable email confirmations: ON
   - Confirm email change: ON
   - Enable email change confirmations: ON
3. Configurar Site URL y Redirect URLs
4. Para Google OAuth: Configurar en Authentication → Providers
5. Para crear notas de prueba: SELECT crear_notas_prueba('user-uuid-aqui');

EJEMPLOS DE USO:

-- Crear nota
INSERT INTO notas_usuario (user_id, titulo, contenido) 
VALUES (auth.uid(), 'Título', 'Contenido');

-- Obtener notas del usuario actual
SELECT * FROM notas_usuario WHERE user_id = auth.uid();

-- Buscar notas
SELECT * FROM buscar_notas(auth.uid(), 'palabra clave');

-- Obtener estadísticas
SELECT * FROM obtener_estadisticas_usuario(auth.uid());

-- Actualizar nota
UPDATE notas_usuario 
SET titulo = 'Nuevo título', contenido = 'Nuevo contenido'
WHERE id = 1 AND user_id = auth.uid();

-- Eliminar nota
DELETE FROM notas_usuario 
WHERE id = 1 AND user_id = auth.uid();
*/
