# Implementation Guide: BoxCard & PalletCard Components

## Quick Start

### BoxCard Usage

```tsx
import { BoxCard } from '../components/Cards';
import type { UnassignedBox } from '../types';

// Basic usage
<BoxCard 
  box={boxData} 
  variant="default" 
/>

// With selection handling
<BoxCard 
  box={boxData}
  variant="compact"
  onSelect={(box) => handleBoxSelection(box)}
  isSelected={selectedBox?.codigo === boxData.codigo}
/>

// Detailed view with all information
<BoxCard 
  box={boxData}
  variant="detailed"
  showActions={true}
/>
```

### PalletCard Usage

```tsx
import { PalletCard } from '../components/Cards';
import type { Pallet } from '../types';

// Basic usage with progress bar
<PalletCard 
  pallet={palletData}
  showProgress={true}
  maxBoxes={100}
/>

// Compact view for lists
<PalletCard 
  pallet={palletData}
  variant="compact"
  onSelect={(pallet) => handlePalletSelection(pallet)}
  isSelected={selectedPallet?.id === palletData.id}
/>

// Detailed view with metrics
<PalletCard 
  pallet={palletData}
  variant="detailed"
  showProgress={true}
  maxBoxes={150} // Custom capacity
/>
```

## Component Props

### BoxCard Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| box | `UnassignedBox` | required | Box data to display |
| variant | `'default' \| 'compact' \| 'detailed'` | `'default'` | Display variant |
| onSelect | `(box: UnassignedBox) => void` | undefined | Selection handler |
| isSelected | `boolean` | `false` | Selection state |
| showActions | `boolean` | `true` | Show action buttons |

### PalletCard Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| pallet | `Pallet` | required | Pallet data to display |
| variant | `'default' \| 'compact' \| 'detailed'` | `'default'` | Display variant |
| onSelect | `(pallet: Pallet) => void` | undefined | Selection handler |
| isSelected | `boolean` | `false` | Selection state |
| showProgress | `boolean` | `true` | Show capacity progress bar |
| maxBoxes | `number` | `100` | Maximum box capacity |

## Integration Examples

### Replacing Simple Lists

**Before:**
```tsx
<ul>
  {boxes.map((box) => (
    <li key={box.codigo}>{box.codigo}</li>
  ))}
</ul>
```

**After:**
```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  {boxes.map((box) => (
    <BoxCard 
      key={box.codigo}
      box={box}
      variant="compact"
      onSelect={handleBoxSelect}
    />
  ))}
</div>
```

### Adding Search & Filter

```tsx
const [searchQuery, setSearchQuery] = useState('');
const [selectedBoxes, setSelectedBoxes] = useState<string[]>([]);

const filteredBoxes = useMemo(() => {
  return boxes.filter(box => 
    box.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    box.operario?.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [boxes, searchQuery]);

return (
  <>
    <input 
      type="text"
      placeholder="Buscar cajas..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {filteredBoxes.map((box) => (
        <BoxCard 
          key={box.codigo}
          box={box}
          variant="default"
          onSelect={(box) => {
            setSelectedBoxes(prev => 
              prev.includes(box.codigo)
                ? prev.filter(c => c !== box.codigo)
                : [...prev, box.codigo]
            );
          }}
          isSelected={selectedBoxes.includes(box.codigo)}
        />
      ))}
    </div>
  </>
);
```

### Modal Integration

```tsx
import Modal from '../components/Modal';
import { PalletCard } from '../components/Cards';

<Modal
  isOpen={showPalletDetails}
  onClose={() => setShowPalletDetails(false)}
  title="Detalles del Pallet"
  size="large"
>
  <PalletCard 
    pallet={selectedPallet}
    variant="detailed"
    showProgress={true}
  />
  
  {/* Additional pallet actions */}
  <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
    <Button onClick={handleClosePallet}>Cerrar Pallet</Button>
    <Button variant="secondary" onClick={handlePrintLabel}>
      Imprimir Etiqueta
    </Button>
  </div>
</Modal>
```

## Best Practices

### 1. Always Use Theme Variables
```tsx
// ❌ Don't hardcode colors
<div style={{ backgroundColor: '#F5F5F7' }}>

// ✅ Use theme variables
<div style={{ backgroundColor: theme.colors.background.primary }}>
```

### 2. Handle Loading States
```tsx
{loading ? (
  <div style={{ textAlign: 'center', padding: '32px' }}>
    <Spinner />
    <p>Cargando cajas...</p>
  </div>
) : (
  boxes.map(box => <BoxCard key={box.codigo} box={box} />)
)}
```

### 3. Provide Empty States
```tsx
{boxes.length === 0 ? (
  <div style={{ textAlign: 'center', padding: '48px' }}>
    <Package size={48} style={{ opacity: 0.3 }} />
    <p>No hay cajas disponibles</p>
  </div>
) : (
  boxes.map(box => <BoxCard key={box.codigo} box={box} />)
)}
```

### 4. Use Memoization for Performance
```tsx
const expensiveCalculation = useMemo(() => {
  return pallets.reduce((acc, pallet) => {
    return acc + pallet.cantidadCajas;
  }, 0);
}, [pallets]);

const sortedPallets = useMemo(() => {
  return [...pallets].sort((a, b) => b.cantidadCajas - a.cantidadCajas);
}, [pallets]);
```

### 5. Accessibility First
```tsx
// Always provide keyboard navigation
<BoxCard 
  box={box}
  onSelect={handleSelect}
  // Card already handles keyboard events internally
/>

// Add descriptive labels
<button aria-label={`Seleccionar caja ${box.codigo}`}>
  Seleccionar
</button>
```

## Common Patterns

### Bulk Selection
```tsx
const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

const toggleSelection = (id: string) => {
  setSelectedItems(prev => {
    const next = new Set(prev);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    return next;
  });
};

const selectAll = () => {
  setSelectedItems(new Set(items.map(item => item.id)));
};

const clearSelection = () => {
  setSelectedItems(new Set());
};
```

### Real-time Updates
```tsx
// Use polling or websockets for real-time data
useEffect(() => {
  const interval = setInterval(() => {
    refetchPallets();
  }, 5000); // Update every 5 seconds

  return () => clearInterval(interval);
}, []);

// Show update indicator
{isRefetching && (
  <div style={{ position: 'absolute', top: 8, right: 8 }}>
    <Spinner size="small" />
  </div>
)}
```

## Migration Checklist

When updating existing components:

- [ ] Replace simple lists with appropriate Card components
- [ ] Add loading and empty states
- [ ] Implement search/filter where appropriate
- [ ] Ensure 44px minimum touch targets
- [ ] Test with keyboard navigation
- [ ] Verify color contrast meets WCAG AA
- [ ] Add proper ARIA labels
- [ ] Test on actual touch devices
- [ ] Measure performance impact
- [ ] Update documentation

## Troubleshooting

### Cards not rendering
- Ensure data matches type definitions
- Check for required props
- Verify import paths

### Performance issues
- Use React.memo for list items
- Implement virtual scrolling for large lists
- Debounce search inputs
- Use pagination when possible

### Touch not working
- Check minimum target sizes (44px)
- Ensure no overlapping elements
- Test with browser touch emulation
- Verify z-index stacking

## Resources

- [Component Documentation](./UI_UX_IMPROVEMENTS.md)
- [Design System](./src/styles/designSystem.css)
- [Theme Configuration](./src/styles/theme.ts)
- [Type Definitions](./src/types/index.ts)