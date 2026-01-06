# Plan de Implementación: Sincronización Offline

## 📋 Resumen

Sistema completo de sincronización offline para el lector de códigos que permite:
- Guardar códigos escaneados en localStorage cuando no hay conexión
- Sincronización automática cuando vuelve la conexión
- Interfaz visual para mostrar estado de conexión y cola pendiente
- Manejo robusto de errores y reintentos

---

## 🏗️ Arquitectura

### Componentes Principales

1. **OfflineQueue Service** (`src/services/offlineQueue.ts`)
   - Gestiona cola de requests pendientes
   - Persistencia en localStorage
   - Prevención de duplicados
   - Límites de tamaño de cola

2. **OfflineSync Service** (`src/services/offlineSync.ts`)
   - Sincronización automática de cola
   - Retry logic con exponential backoff
   - Progreso de sincronización

3. **useNetworkStatus Hook** (`src/hooks/useNetworkStatus.ts`)
   - Detección de estado de conexión
   - Verificación activa de conectividad
   - Eventos de cambio de estado

4. **fetchJson Modificado** (`src/services/fetchJson.ts`)
   - Intercepta requests cuando está offline
   - Agrega requests a cola automáticamente
   - Manejo de errores de red

5. **OfflineSyncStatus Component** (`src/components/OfflineSyncStatus/OfflineSyncStatus.tsx`)
   - UI para mostrar estado de conexión
   - Indicador de códigos pendientes
   - Botón de sincronización manual

---

## 🔄 Flujo de Funcionamiento

### Escaneo Normal (Online)

```
1. Usuario escanea código
2. CommandInput recibe código
3. useCreateBox llama a createBox
4. createBox usa fetchJson
5. fetchJson detecta conexión → envía request
6. Backend procesa y responde
7. UI muestra resultado
```

### Escaneo Offline

```
1. Usuario escanea código
2. CommandInput recibe código
3. useCreateBox llama a createBox
4. createBox usa fetchJson
5. fetchJson detecta NO conexión → agrega a cola
6. Código se guarda en localStorage
7. UI muestra mensaje "Código guardado para sincronización"
8. OfflineSyncStatus muestra contador de pendientes
```

### Sincronización Automática

```
1. useNetworkStatus detecta que volvió la conexión
2. OfflineSyncStatus detecta cambio (wasOffline = true)
3. Automáticamente llama a offlineSync.syncAll()
4. Procesa cada request de la cola:
   - Intenta enviar request
   - Si éxito → elimina de cola
   - Si falla → incrementa retry count
   - Si max retries → elimina de cola
5. Muestra progreso en UI
6. Notifica resultado (éxitos/fallidos)
```

---

## 📦 Estructura de Datos

### QueuedRequest

```typescript
interface QueuedRequest {
  id: string;           // ID único generado del request
  url: string;          // URL del endpoint
  options: RequestInit; // Opciones del fetch (method, body, headers)
  timestamp: number;    // Timestamp de cuando se agregó
  retryCount: number;   // Número de intentos fallidos
  lastRetry?: number;   // Timestamp del último intento
}
```

### Storage Key

- **Key**: `offline_queue`
- **Formato**: JSON array de `QueuedRequest[]`
- **Límite**: 1000 requests máximo
- **Persistencia**: localStorage (sobrevive recargas de página)

---

## ⚙️ Configuración

### Parámetros Ajustables

En `offlineQueue.ts`:
- `MAX_QUEUE_SIZE`: 1000 (máximo de requests en cola)
- `MAX_RETRIES`: 5 (intentos máximos antes de descartar)
- `INITIAL_RETRY_DELAY`: 1000ms (delay inicial entre reintentos)
- `MAX_RETRY_DELAY`: 30000ms (delay máximo con exponential backoff)

En `useNetworkStatus.ts`:
- Intervalo de verificación: 10 segundos
- Timeout de health check: 3 segundos

---

## 🎨 Interfaz de Usuario

### OfflineSyncStatus Component

**Ubicación**: Esquina inferior derecha (fixed position)

**Estados Visuales**:

1. **Online + Sin Pendientes**
   - No se muestra (oculto)

2. **Online + Con Pendientes**
   - Fondo verde
   - Icono WiFi
   - Texto: "X códigos pendientes"
   - Botón "Sincronizar"

3. **Sincronizando**
   - Fondo verde
   - Icono WiFi
   - Texto: "Sincronizando... X/Y"
   - Barra de progreso

4. **Offline**
   - Fondo rojo
   - Icono WiFiOff
   - Texto: "Sin conexión - X códigos guardados"

5. **Sincronización Completada**
   - Fondo verde
   - Icono CheckCircle
   - Texto: "Sincronizado: X códigos"
   - Desaparece después de 3 segundos

---

## 🔧 Características Técnicas

### Detección de Conexión

1. **Navegador**: `navigator.onLine` (eventos online/offline)
2. **Verificación Activa**: Health check al endpoint `/health`
3. **Dual Check**: Combina ambos métodos para mayor confiabilidad

### Prevención de Duplicados

- Genera ID único basado en: `method:url:body`
- Verifica duplicados antes de agregar a cola
- Evita procesar el mismo código múltiples veces

### Retry Logic

- **Exponential Backoff**: Delay aumenta exponencialmente
  - Intento 1: 1 segundo
  - Intento 2: 2 segundos
  - Intento 3: 4 segundos
  - Intento 4: 8 segundos
  - Intento 5: 16 segundos
  - Máximo: 30 segundos

- **Max Retries**: Después de 5 intentos, se descarta el request

### Manejo de Errores

1. **Network Error**: Se detecta y se agrega a cola
2. **API Error (4xx/5xx)**: Se reintenta según retry logic
3. **Storage Full**: Se eliminan los items más antiguos
4. **Sync Cancelado**: Se puede cancelar sincronización en progreso

---

## 🚀 Uso

### Para el Usuario

1. **Escaneo Normal**: Funciona igual que antes
2. **Escaneo Offline**: 
   - Escanea códigos normalmente
   - Ve mensaje "Código guardado para sincronización"
   - Ve contador en esquina inferior derecha
3. **Cuando Vuelve Conexión**:
   - Sincronización automática
   - Ve progreso en tiempo real
   - Recibe notificación de resultado

### Para el Desarrollador

```typescript
// Ver estado de la cola
import { offlineQueue } from './services/offlineQueue';
const size = offlineQueue.size();
const stats = offlineQueue.getStats();

// Sincronizar manualmente
import { offlineSync } from './services/offlineSync';
const result = await offlineSync.syncAll();

// Suscribirse a cambios
const unsubscribe = offlineQueue.subscribe((count) => {
  console.log(`Queue size: ${count}`);
});
```

---

## ✅ Ventajas de esta Implementación

1. **Transparente**: No requiere cambios en código existente
2. **Automático**: Sincronización sin intervención del usuario
3. **Robusto**: Manejo de errores y reintentos inteligentes
4. **Persistente**: Sobrevive recargas de página
5. **Visual**: Feedback claro del estado
6. **Eficiente**: Prevención de duplicados y límites de cola
7. **Escalable**: Fácil ajustar parámetros

---

## 🔄 Alternativas Consideradas

### Service Worker (No implementado)
- **Ventaja**: Mejor control offline, puede cachear recursos
- **Desventaja**: Más complejo, requiere registro, puede ser overkill

### IndexedDB (No implementado)
- **Ventaja**: Más espacio que localStorage
- **Desventaja**: Más complejo, localStorage es suficiente para este caso

### Decisión Final
localStorage es suficiente porque:
- Los códigos son pequeños (16 dígitos)
- Límite de 1000 códigos es razonable
- Implementación más simple
- Mejor compatibilidad

---

## 📝 Mejoras Futuras (Opcionales)

1. **Service Worker**: Para mejor manejo offline y cache
2. **IndexedDB**: Si se necesita más espacio
3. **Compresión**: Comprimir requests en cola
4. **Priorización**: Priorizar ciertos tipos de requests
5. **Batch Sync**: Enviar múltiples códigos en un solo request
6. **Analytics**: Tracking de códigos offline vs online
7. **Notificaciones**: Notificaciones del sistema cuando se sincroniza

---

## 🧪 Testing

### Escenarios a Probar

1. ✅ Escanear código online → debe funcionar normal
2. ✅ Escanear código offline → debe guardarse en cola
3. ✅ Desconectar WiFi → debe mostrar estado offline
4. ✅ Reconectar WiFi → debe sincronizar automáticamente
5. ✅ Múltiples códigos offline → todos deben guardarse
6. ✅ Recargar página offline → cola debe persistir
7. ✅ Sincronización con errores → debe reintentar
8. ✅ Cola llena → debe eliminar más antiguos

---

## 📚 Archivos Creados/Modificados

### Nuevos Archivos
- `src/services/offlineQueue.ts`
- `src/services/offlineSync.ts`
- `src/hooks/useNetworkStatus.ts`
- `src/components/OfflineSyncStatus/OfflineSyncStatus.tsx`

### Archivos Modificados
- `src/services/fetchJson.ts` - Intercepta requests offline
- `src/hooks/useCreateBox.ts` - Maneja requests en cola
- `src/App.tsx` - Agrega componente OfflineSyncStatus

---

**Implementado**: Enero 2025
**Versión**: 1.0.0

