# Análisis del Codebase - Sistema Lomas Altas

## 📋 Resumen Ejecutivo

El sistema está compuesto por dos aplicaciones principales:

1. **Frontend (lector-codigos-desktop-packing)**: Aplicación React/TypeScript para terminales de control en fábrica
2. **Backend (LambdaLomasAltas)**: API serverless en AWS Lambda con arquitectura Clean Architecture

### Propósito del Sistema
Sistema de gestión de inventario para rastrear cajas de huevos, pallets, carritos y órdenes de venta a través de múltiples ubicaciones en una fábrica de producción de huevos.

---

## 🏗️ Arquitectura General

### Frontend (React + TypeScript + Vite)

**Stack Tecnológico:**
- **Framework**: React 19.1.0 con TypeScript
- **Build Tool**: Vite 7.0.0
- **Routing**: React Router DOM 7.6.3
- **Animaciones**: Framer Motion 12.23.0
- **Iconos**: Lucide React 0.525.0
- **Fechas**: date-fns 4.1.0
- **Estilos**: CSS Modules + Sistema de diseño centralizado (vanilla CSS)

**Estructura del Proyecto:**
```
src/
├── components/          # Componentes reutilizables
│   ├── Cards/          # BoxCard, PalletCard
│   ├── CommandInput/   # Input para comandos de terminal
│   ├── Dashboard/      # Dashboard principal
│   ├── Forms/          # Formularios (CreatePalletForm)
│   ├── ui/             # Componentes UI base (Button, Container, etc.)
│   └── Widgets/        # Widgets especializados
├── hooks/              # Custom hooks (useActivePallets, useCreateBox, etc.)
├── services/           # Servicios de API (boxService, palletService, etc.)
├── styles/             # Sistema de diseño centralizado
│   ├── designSystem.css
│   ├── designSystem.ts
│   └── theme.ts
├── types/              # Definiciones TypeScript
├── utils/              # Utilidades (codeUtils, sound, etc.)
└── views/              # Vistas principales
    ├── MainTerminal/   # Terminal principal
    └── CreatePallet/   # Vista de creación de pallets
```

**Características Principales:**
- ✅ Arquitectura modular y limpia
- ✅ Separación de concerns (hooks, services, components)
- ✅ Sistema de diseño centralizado (no Tailwind)
- ✅ TypeScript para type safety
- ✅ CSS Modules para estilos encapsulados
- ✅ Optimizado para touchscreens (44px mínimo)

### Backend (AWS Lambda + DynamoDB)

**Stack Tecnológico:**
- **Runtime**: Node.js 22.x
- **Cloud**: AWS Lambda (serverless)
- **Base de Datos**: AWS DynamoDB
- **API**: API Gateway REST
- **Arquitectura**: Clean Architecture (Domain → Application → Infrastructure → Interface)

**Estructura del Proyecto:**
```
LambdaLomasAltas/
├── config/              # Configuración (schemas, mappings)
│   ├── schemas/         # box.js, pallet.js, cart.js
│   └── fieldMappings.js  # Mapeo de campos para display
├── models/              # Modelos DynamoDB
│   ├── boxes.js
│   ├── pallets.js
│   ├── carts.js
│   └── ...
├── src/
│   ├── domain/          # Capa de dominio (entidades, value objects)
│   │   ├── entities/   # Box, Pallet, Cart, Customer, Sale, Issue
│   │   ├── errors/      # DomainError, ValidationError, etc.
│   │   ├── repositories/ # Interfaces de repositorios
│   │   └── value-objects/ # PalletStatus
│   ├── application/     # Casos de uso (use cases)
│   │   ├── inventory/   # Boxes, Pallets, Carts, CartFormats
│   │   ├── sales/       # Orders, Customers
│   │   ├── admin/       # Issues, Audits, Bulk Operations
│   │   └── reports/     # Reportes y métricas
│   ├── infrastructure/  # Implementaciones concretas
│   │   ├── database/    # DynamoBoxRepository, DynamoPalletRepository
│   │   └── api/         # Dependency injection, handlers
│   └── interface-adapters/ # Controllers, Presenters
├── utils/               # Utilidades compartidas
└── scripts/             # Scripts de setup y mantenimiento
```

**Características Principales:**
- ✅ Clean Architecture bien implementada
- ✅ Separación clara de capas
- ✅ Domain entities con lógica de negocio
- ✅ Dependency Injection para testabilidad
- ✅ Warm start optimization (cached dependencies)
- ✅ Manejo centralizado de errores

---

## 🔑 Conceptos de Dominio

### Entidades Principales

#### 1. **Box (Caja)**
- **Código**: 16 dígitos numéricos
- **Estructura del código**:
  ```
  [DíaSemana(1)][Semana(2)][Año(2)][Operario(2)][Empacador(1)][Turno(1)][Calibre(2)][Formato(1)][Empresa(1)][Contador(3)]
  ```
- **Propiedades clave**:
  - `calibre`: Tamaño del huevo (01-07)
  - `formato`: Formato de la caja
  - `empresa`: Código de empresa
  - `ubicacion`: PACKING, TRANSITO, BODEGA, etc.
  - `palletId`: ID del pallet asignado (o "UNASSIGNED")
  - `horarios`: Array de hasta 3 horarios permitidos

#### 2. **Pallet (Pallet)**
- **Código**: 14 dígitos numéricos
- **Estructura del código**:
  ```
  [DíaSemana(1)][Semana(2)][Año(2)][Turno(1)][Calibre(2)][Formato(1)][Empresa(2)][Sufijo(3)]
  ```
- **Estados**: OPEN, CLOSED
- **Propiedades clave**:
  - `calibre`: Debe coincidir con las cajas asignadas
  - `formato`: Debe coincidir con las cajas asignadas
  - `empresa`: Debe coincidir con las cajas asignadas
  - `maxBoxes`: Capacidad máxima (máximo 60)
  - `boxes`: Array de códigos de cajas asignadas
  - `horarios`: Array de hasta 3 horarios permitidos

#### 3. **Cart (Carrito)**
- Sistema de carritos para transporte
- Relacionado con CartFormats (formatos predefinidos)

#### 4. **Sale (Orden de Venta)**
- Estados: DRAFT → CONFIRMED → DISPATCHED → COMPLETED
- Puede cancelarse desde CONFIRMED
- Vincula pallets/cajas con clientes

### Reglas de Negocio Clave

#### Compatibilidad Box-Pallet
Una caja puede asignarse a un pallet si:
1. **Mismo Calibre**: Box y pallet tienen el mismo calibre
2. **Misma Ubicación**: Ambos en la misma ubicación
3. **Pallet Abierto**: Estado del pallet es "OPEN"
4. **Capacidad Disponible**: Pallet no está lleno
5. **Horarios Compatibles**: El horario de la caja debe estar en los horarios permitidos del pallet

#### Ubicaciones Válidas
- `PACKING`: Área de empaque
- `TRANSITO`: En tránsito entre áreas
- `BODEGA`: Bodega de almacenamiento
- `PREVENTA`: Preparado para venta
- `VENTA`: En proceso de venta
- `RECHAZO`: Rechazado/Descartado
- `CUARENTENA`: En cuarentena
- `UNSUBSCRIBED`: Dado de baja

---

## 🔌 API y Comunicación

### Endpoints Consolidados

El backend usa endpoints consolidados con formato unificado:

**POST /inventory**
```json
{
  "resource": "box|pallet|cart|cartFormat",
  "action": "get|create|update|delete|move|...",
  "params": { /* parámetros específicos */ }
}
```

**POST /sales**
```json
{
  "resource": "order|customer",
  "action": "get|create|update|...",
  "params": { /* parámetros específicos */ }
}
```

**POST /admin**
```json
{
  "resource": "issue|reports|bulk|audit",
  "action": "get|create|...",
  "params": { /* parámetros específicos */ }
}
```

### Formato de Respuesta

**Success:**
```json
{
  "status": "success",
  "data": { /* datos */ },
  "message": "Operation completed",
  "meta": {
    "requestId": "...",
    "timestamp": "..."
  }
}
```

**Error:**
```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción"
  }
}
```

---

## 🎨 Sistema de Diseño Frontend

### Arquitectura de Estilos

El proyecto usa **vanilla CSS con sistema centralizado** (no Tailwind):

1. **designSystem.css**: Variables CSS globales
2. **designSystem.ts**: Constantes TypeScript para acceso programático
3. **theme.ts**: Configuración de tema (colores, espaciado, tipografía)
4. **CSS Modules**: Estilos encapsulados por componente

### Componentes UI Base

- `Container`: Contenedor con max-width y padding
- `Button`: Botón con variantes y tamaños
- `MacWindow`: Ventana estilo macOS
- `BoxCard`: Tarjeta para mostrar cajas
- `PalletCard`: Tarjeta para mostrar pallets

### Características UX

- ✅ **Touch-optimized**: Mínimo 44px para targets táctiles
- ✅ **Progressive Disclosure**: Información colapsable
- ✅ **Bulk Operations**: Selección múltiple de cajas
- ✅ **Advanced Filtering**: Filtros por calibre, operario, etc.
- ✅ **Real-time Updates**: Dashboard con actualizaciones en tiempo real
- ✅ **Visual Feedback**: Estados visuales claros (selección, loading, etc.)

---

## 🗄️ Base de Datos (DynamoDB)

### Tablas Principales

1. **Boxes**: Cajas de huevos
   - Partition Key: `codigo`
   - GSI: `ubicacion-fechaCreacion-index`
   - GSI: `palletId-index`

2. **Pallets**: Pallets de cajas
   - Partition Key: `codigo`
   - GSI: `ubicacion-estado-index`
   - GSI: `estado-fechaCreacion-index`

3. **Carts**: Carritos de transporte
4. **CartFormats**: Formatos predefinidos de carritos
5. **Customers**: Clientes
6. **SalesOrders**: Órdenes de venta
7. **Issues**: Issues y reportes de problemas
8. **AdminLogs**: Logs de auditoría
9. **Metrics**: Métricas agregadas (caché de reportes)
10. **SystemConfig**: Configuración del sistema

### Estrategias de Optimización

- **GSI estratégicos** para queries frecuentes
- **Caché incremental** para reportes (tabla Metrics)
- **Paginación** en todos los listados
- **Batch operations** para operaciones masivas

---

## 🔄 Flujos Principales

### 1. Flujo de Creación de Caja

```
1. Operario escanea código de caja (16 dígitos)
2. Frontend llama POST /inventory { resource: "box", action: "create" }
3. Backend parsea código y extrae información
4. Backend crea Box entity
5. Backend busca pallets compatibles (mismo calibre, formato, ubicación)
6. Si hay pallet compatible y con espacio:
   - Asigna caja al pallet automáticamente
   - Actualiza contador de cajas del pallet
7. Si no hay pallet compatible:
   - Caja queda como "UNASSIGNED"
8. Retorna respuesta con información de la caja
```

### 2. Flujo de Creación de Pallet

```
1. Usuario crea pallet desde UI
2. Frontend llama POST /inventory { resource: "pallet", action: "create" }
3. Backend genera código de pallet (14 dígitos)
4. Backend crea Pallet entity con estado OPEN
5. Retorna pallet creado
```

### 3. Flujo de Asignación Manual

```
1. Usuario selecciona cajas no asignadas
2. Usuario selecciona pallet destino
3. Frontend llama POST /inventory { resource: "box", action: "move-between-pallets" }
4. Backend valida compatibilidad:
   - Mismo calibre
   - Misma ubicación
   - Pallet abierto
   - Capacidad disponible
   - Horarios compatibles
5. Si válido:
   - Mueve caja(s) al pallet
   - Actualiza contadores
6. Retorna resultado
```

### 4. Flujo de Cierre de Pallet

```
1. Usuario cierra pallet desde UI
2. Frontend llama POST /inventory { resource: "pallet", action: "close" }
3. Backend valida:
   - Pallet está abierto
   - Tiene al menos una caja
4. Cambia estado a CLOSED
5. Establece fechaCierre
6. Retorna pallet cerrado
```

---

## 🧪 Testing y Calidad

### Frontend
- ESLint configurado
- TypeScript para type checking
- No se observan tests unitarios (área de mejora)

### Backend
- Jest configurado
- Scripts de test disponibles
- Tests de entidades (Box.test.js)
- Scripts de validación y auditoría

### Scripts Útiles

**Backend:**
```bash
npm run format              # Formatear código
npm run validate:imports     # Validar imports
npm run check-env           # Verificar entorno
npm test                    # Ejecutar tests
```

**Frontend:**
```bash
npm run dev                 # Desarrollo
npm run build              # Build producción
npm run lint               # Linter
```

---

## 📊 Métricas y Reportes

### Sistema de Métricas

- **Tabla Metrics**: Caché de métricas agregadas
- **Cálculo diario**: EventBridge scheduled event
- **Backfill**: Script para poblar métricas históricas
- **Reportes disponibles**:
  - Producción (por día, semana, mes)
  - Inventario (snapshot por fecha)
  - Flujo de movimientos
  - Exportación a Excel

---

## 🔒 Seguridad y Auditoría

### Auditoría
- **AdminLogs**: Tabla para registrar todas las operaciones administrativas
- **Request IDs**: Tracking de requests para debugging
- **Timestamps**: Todas las operaciones tienen timestamps

### Validaciones
- Validación de códigos (formato, longitud)
- Validación de compatibilidad Box-Pallet
- Validación de estados (no cerrar pallet cerrado, etc.)
- Validación de permisos (en producción)

---

## 🚀 Deployment

### Frontend
- Build con Vite
- Deploy a Vercel (vercel.json presente)
- Variables de entorno: `VITE_API_URL`

### Backend
- Deploy a AWS Lambda
- Script `deploy.sh` disponible
- Stages: `dev` y `main` (producción)
- Buildspec.yml para CI/CD

---

## 📝 Convenciones de Código

### Naming Conventions

**Frontend:**
- Componentes: PascalCase (`BoxCard.tsx`)
- Hooks: camelCase con prefijo `use` (`useActivePallets.ts`)
- Servicios: camelCase (`boxService.ts`)
- Tipos: PascalCase (`Pallet`, `UnassignedBox`)

**Backend:**
- Archivos: camelCase (`CreateBox.js`)
- Clases: PascalCase (`Box`, `Pallet`)
- Funciones: camelCase (`parseBoxCodeStrict`)
- Constantes: UPPER_SNAKE_CASE (`PalletStatus.OPEN`)

### Estructura de Archivos

**Componentes React:**
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.module.css
└── index.ts (opcional)
```

**Use Cases Backend:**
```
UseCaseName.js
- Constructor recibe dependencias
- Método execute() o método principal
- Lanza DomainErrors en caso de error
```

---

## ⚠️ Áreas de Mejora Identificadas

### Frontend
1. **Testing**: No hay tests unitarios ni de integración
2. **Error Handling**: Podría mejorarse el manejo de errores global
3. **Loading States**: Algunos componentes podrían tener mejor feedback de carga
4. **Accessibility**: Revisar ARIA labels y navegación por teclado
5. **Performance**: Considerar virtual scrolling para listas grandes

### Backend
1. **Documentación**: Algunos use cases podrían tener más comentarios
2. **Error Messages**: Algunos errores podrían ser más descriptivos
3. **Validation**: Centralizar validaciones comunes
4. **Caching**: Considerar más caché para queries frecuentes
5. **Monitoring**: Implementar métricas de performance y errores

### General
1. **CI/CD**: Mejorar pipeline de deployment
2. **Documentation**: Documentar APIs con OpenAPI/Swagger
3. **Environment Variables**: Centralizar y documentar todas las variables
4. **Logging**: Estandarizar formato de logs
5. **Rate Limiting**: Implementar rate limiting en API

---

## 🎯 Fortalezas del Sistema

1. ✅ **Arquitectura Limpia**: Clean Architecture bien implementada en backend
2. ✅ **Separación de Concerns**: Frontend y backend bien organizados
3. ✅ **Type Safety**: TypeScript en frontend, validaciones en backend
4. ✅ **Modularidad**: Componentes y módulos reutilizables
5. ✅ **UX Optimizada**: Touch-friendly, feedback visual claro
6. ✅ **Escalabilidad**: Serverless permite escalar automáticamente
7. ✅ **Mantenibilidad**: Código limpio y bien estructurado
8. ✅ **Documentación**: READMEs y guías de implementación presentes

---

## 📚 Recursos y Referencias

- **Backend README**: `/LambdaLomasAltas/README.md` - Documentación completa de API
- **Implementation Guide**: `/lector-codigos-desktop-packing/IMPLEMENTATION_GUIDE.md`
- **Improvements Summary**: `/lector-codigos-desktop-packing/IMPROVEMENTS_SUMMARY.md`
- **Technical Reference**: `/LambdaLomasAltas/docs/TECHNICAL_REFERENCE.md`
- **Metrics Documentation**: `/LambdaLomasAltas/docs/METRICS.md`

---

## 🔄 Flujo de Desarrollo Recomendado

1. **Nuevo Feature**:
   - Crear branch desde `main`
   - Implementar en backend (domain → application → infrastructure)
   - Implementar en frontend (services → hooks → components)
   - Testing manual
   - PR y code review

2. **Bug Fix**:
   - Identificar capa afectada
   - Fix en la capa correspondiente
   - Verificar no romper otras capas
   - Testing
   - PR

3. **Refactoring**:
   - Mantener interfaces públicas
   - Actualizar tests si existen
   - Documentar cambios significativos

---

**Última actualización**: Enero 2025
**Versión del sistema**: 2.0.0

