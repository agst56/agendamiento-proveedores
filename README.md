# Agendamiento Proveedores - Guía de Producción Local

Este documento proporciona instrucciones detalladas para buildear y ejecutar la aplicación en modo producción de forma local.

## 📋 Requisitos Previos

- **Node.js**: versión 18.x o superior
- **npm**: versión 9.x o superior
- **Angular CLI**: versión 17.x o superior

Verificar versiones instaladas:
```bash
node --version
npm --version
ng version
```

## 🔧 Instalación de Dependencias

1. **Clonar el repositorio** (si no lo tienes):
```bash
git clone <repository-url>
cd agendamiento-proveedores
```

2. **Instalar dependencias**:
```bash
npm install
```

## 🏗️ Build para Producción

```bash
ng build --configuration=production
```

## 🚀 Servir la Aplicación en Modo Producción

### Opción 1: Usando Angular CLI (Desarrollo con optimizaciones)
```bash
ng serve --configuration=production --host 0.0.0.0 --port 4200
```

### Opción 2: Usando un Servidor Web Local

#### Con http-server (Recomendado)
1. **Instalar http-server globalmente**:
```bash
npm install -g http-server
```

2. **Servir la aplicación**:
```bash
# Después del build
cd dist/agendamiento-proveedores
http-server -p 8080 -a 0.0.0.0 -c-1 --cors
```

3. **Acceder a la aplicación**:
```
http://localhost:8080
```

#### Con serve
1. **Instalar serve globalmente**:
```bash
npm install -g serve
```

2. **Servir la aplicación**:
```bash
# Después del build
serve -s dist/agendamiento-proveedores -l 8080
```

### Opción 3: Usando Python (si tienes Python instalado)
```bash
# Python 3
cd dist/agendamiento-proveedores
python -m http.server 8080

# Python 2
cd dist/agendamiento-proveedores
python -M SimpleHTTPServer 8080
```

## ⚡ Optimizaciones de Producción

La aplicación incluye las siguientes optimizaciones en modo producción:

- ✅ **Minificación** de JavaScript y CSS
- ✅ **Tree-shaking** para eliminar código no utilizado
- ✅ **AOT Compilation** (Ahead of Time)
- ✅ **Lazy loading** de módulos
- ✅ **Optimización de imágenes**
- ✅ **Compresión gzip** (si el servidor lo soporta)


## 🌐 Configuración de Red Local

Para acceder desde otros dispositivos en la red local:

1. **Obtener tu IP local**:
```bash
# En macOS/Linux
ifconfig | grep inet
# En Windows
ipconfig
```

2. **Servir con la IP específica**:
```bash
ng serve --configuration=production --host 0.0.0.0 --port 4200
# O con http-server
http-server dist/agendamiento-proveedores -p 8080 -a 0.0.0.0
```

3. **Acceder desde otros dispositivos**:
```
http://[tu-ip-local]:4200
# Ejemplo: http://192.168.1.100:4200
```

## 🗂️ Persistencia de Datos

La aplicación utiliza **cookies del navegador** para persistir datos:

- ✅ **Proveedores**: Almacenados en cookie `proveedores`
- ✅ **Productos**: Almacenados en cookie `productos`
- ✅ **Jaulas**: Almacenados en cookie `jaulas`
- ✅ **Turnos**: Almacenados en cookie `turnos`

**Nota**: Los datos persisten entre sesiones y reinicios del navegador.

## 🔧 Troubleshooting

### Problema: Error de memoria durante el build
```bash
# Aumentar memoria de Node.js
node --max_old_space_size=4096 ./node_modules/@angular/cli/bin/ng build --configuration=production
```

### Problema: Puerto en uso
```bash
# Usar un puerto diferente
ng serve --configuration=production --port 4201
```

### Problema: Permisos en macOS/Linux
```bash
sudo ng serve --configuration=production --host 0.0.0.0 --port 80
```

## 📊 Monitoreo de Performance

Para monitorear el rendimiento en producción:

1. **Abrir DevTools** en el navegador
2. **Ir a la pestaña Lighthouse**
3. **Ejecutar auditoría** para PWA/Performance
4. **Revisar métricas** como:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)

## 🔒 Consideraciones de Seguridad

Para un entorno de producción real, considera:

- 🔐 Implementar HTTPS
- 🛡️ Configurar Content Security Policy (CSP)
- 🚫 Configurar headers de seguridad
- 🔍 Implementar logging y monitoreo
- 💾 Migrar de cookies a una base de datos real

## 📞 Soporte

Si encuentras problemas durante el build o deployment:

1. Verificar que todas las dependencias estén instaladas
2. Limpiar node_modules y reinstalar: `rm -rf node_modules && npm install`
3. Limpiar cache de Angular: `ng cache clean`
4. Verificar compatibilidad de versiones de Node.js y Angular

---

**Última actualización**: Septiembre 2025  
**Versión Angular**: 17.x  
**Modo de persistencia**: Cookies del navegador
