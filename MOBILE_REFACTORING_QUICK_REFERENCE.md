# Mobile Refactoring - Quick Reference

## New Files Created

### Hooks (`hooks/`)
- ✅ `useActionData.ts` - Fetch service and action data
- ✅ `useFormData.ts` - Manage form state
- ✅ `index.ts` - Export all hooks

### Components - Atoms (`components/atoms/`)
- ✅ `loading-view/` - Loading indicator
- ✅ `error-view/` - Error display  
- ✅ `primary-button/` - Styled button
- ✅ `index.ts` - Export all atoms

### Components - Molecules (`components/molecules/`)
- ✅ `action-fields-page-header/` - Page header with service branding
- ✅ `source-selection-card/` - Source step selection UI
- ✅ `action-fields-card/` - Fields container
- ✅ `index.ts` - Export all molecules (includes existing ones)

### Utils (`utils/`)
- ✅ `formValidation.ts` - Validation and conversion functions

### Documentation
- ✅ `MOBILE_CODE_REFACTORING.md` - Detailed refactoring guide
- ✅ `MOBILE_REFACTORING_QUICK_REFERENCE.md` - This file

## Usage Examples

### Using Custom Hooks

```typescript
import { useActionData, useFormData } from '@/hooks';

const MyPage = () => {
  // Fetch data
  const { service, action, loading, error } = useActionData({
    serviceActionId: '123',
    actionId: '456'
  });

  // Manage form
  const { formData, handleFieldChange, initializeFormData } = useFormData();
  
  useEffect(() => {
    if (action) initializeFormData(action);
  }, [action]);
};
```

### Using Atom Components

```typescript
import { LoadingView, ErrorView, PrimaryButton } from '@/components/atoms';

// Loading state
if (loading) return <LoadingView message="Loading..." />;

// Error state
if (error) return <ErrorView message={error} type="error" />;

// Button
<PrimaryButton
  title="Continue"
  onPress={handleContinue}
  backgroundColor="#075eec"
/>
```

### Using Molecule Components

```typescript
import {
  ActionFieldsPageHeader,
  SourceSelectionCard,
  ActionFieldsCard
} from '@/components/molecules';

// Header
<ActionFieldsPageHeader service={service} action={action} />

// Source selection
<SourceSelectionCard
  zapId={zapId}
  selectedFromStepId={selectedFromStepId}
  onSelectFromStep={setSelectedFromStepId}
  serviceColor={service.services_color}
/>

// Fields
<ActionFieldsCard
  fields={fieldsArray}
  zapId={zapId}
  sourceStepId={selectedFromStepId}
  serviceColor={service.services_color}
  formData={formData}
  onFieldChange={handleFieldChange}
/>
```

### Using Validation Utils

```typescript
import { validateRequiredFields, convertFieldsToArray } from '@/utils/formValidation';

// Validate
const validation = validateRequiredFields(action, formData);
if (!validation.isValid) {
  alert(validation.missingFields.join(', '));
}

// Convert fields
const fieldsArray = convertFieldsToArray(action);
```

## Component Props Reference

### LoadingView
```typescript
{
  message?: string;  // Default: "Loading..."
}
```

### ErrorView
```typescript
{
  message: string;
  type?: 'error' | 'warning' | 'info';  // Default: 'error'
}
```

### PrimaryButton
```typescript
{
  title: string;
  onPress: () => void;
  backgroundColor?: string;  // Default: '#075eec'
  disabled?: boolean;        // Default: false
}
```

### ActionFieldsPageHeader
```typescript
{
  service: Service;
  action: Action;
}
```

### SourceSelectionCard
```typescript
{
  zapId: number;
  selectedFromStepId: number | null;
  onSelectFromStep: (fromStepId: number | null) => void;
  serviceColor: string;
}
```

### ActionFieldsCard
```typescript
{
  fields: FieldWithId[];  // Array of fields with fieldId
  zapId?: number;
  sourceStepId: number | null;
  serviceColor: string;
  formData: Record<string, string>;
  onFieldChange: (fieldName: string, value: string) => void;
}
```

## File Size Comparison

| File | Before | After | Reduction |
|------|--------|-------|-----------|
| action-fields-page/[id].tsx | 280 lines | 100 lines | **64%** |

## Benefits Summary

✅ **Maintainable** - Clear separation of concerns  
✅ **Reusable** - Components and hooks work everywhere  
✅ **Testable** - Each unit can be tested independently  
✅ **Readable** - Clean, organized code structure  
✅ **Scalable** - Easy to extend and modify  
✅ **Type-safe** - Full TypeScript support  

## When to Use What

| Need | Use |
|------|-----|
| Fetch service/action data | `useActionData` |
| Manage form state | `useFormData` |
| Validate form | `validateRequiredFields` |
| Show loading | `LoadingView` |
| Show error | `ErrorView` |
| Action button | `PrimaryButton` |
| Page header | `ActionFieldsPageHeader` |
| Source selection UI | `SourceSelectionCard` |
| Fields container | `ActionFieldsCard` |

## Migration Checklist

When refactoring another page:

- [ ] Extract data fetching to custom hook
- [ ] Extract state management to custom hook
- [ ] Move validation logic to utils
- [ ] Extract UI sections into components
- [ ] Use atoms for basic UI (loading, errors, buttons)
- [ ] Use molecules for composite UI
- [ ] Add TypeScript types
- [ ] Add JSDoc comments
- [ ] Test each piece independently
- [ ] Update imports to use index files

## Common Patterns

### Pattern 1: Data + Form Page
```typescript
const MyPage = () => {
  // 1. Data fetching
  const { data, loading, error } = useMyData();
  
  // 2. Form management
  const { formData, handleFieldChange } = useFormData();
  
  // 3. Validation
  const handleSubmit = () => {
    const validation = validateMyForm(formData);
    if (!validation.isValid) return;
    // Submit...
  };
  
  // 4. Render
  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} />;
  
  return (
    <>
      <MyHeader data={data} />
      <MyForm formData={formData} onChange={handleFieldChange} />
      <PrimaryButton title="Submit" onPress={handleSubmit} />
    </>
  );
};
```

### Pattern 2: Conditional Components
```typescript
// Always check states in this order:
if (loading) return <LoadingView />;
if (error) return <ErrorView message={error} />;
if (!data) return <ErrorView message="No data found" />;

// Then render main content
return <MainContent data={data} />;
```

### Pattern 3: Styled Components
```typescript
// Pass service color for theming
<MyComponent
  serviceColor={service.services_color}
  // ... other props
/>
```

## Tips

💡 **Import Organization**: Group imports by type (hooks, utils, components)  
💡 **Component Size**: Keep components under 150 lines  
💡 **Hook Naming**: Use `use` prefix for custom hooks  
💡 **Props Interface**: Always define TypeScript interfaces for props  
💡 **Error Handling**: Always handle loading, error, and empty states  
💡 **Comments**: Add JSDoc for public APIs  

## Need Help?

- See `MOBILE_CODE_REFACTORING.md` for detailed explanation
- Check existing components for examples
- Follow atomic design principles
- Keep components focused and reusable
