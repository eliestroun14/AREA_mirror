# Mobile API Fix - Steps Endpoint Issue

## Problem

The mobile app was calling a non-existent API endpoint:
```
GET /zaps/{zapId}/steps
```

This endpoint **does not exist** in the backend, causing the error:
```
ERROR Error fetching steps: [Error: Failed to fetch steps]
```

## Root Cause

The mobile implementation was incorrectly assuming a unified `/steps` endpoint existed. The backend API actually uses **separate endpoints** for triggers and actions:

- `GET /zaps/{zapId}/trigger` - Returns the trigger step
- `GET /zaps/{zapId}/actions` - Returns all action steps

## Solution

Updated both mobile components to match the web implementation pattern:

### 1. StepSourceSelector Fix

**Before (INCORRECT):**
```typescript
// ❌ Non-existent endpoint
const response = await fetch(`${apiUrl}/zaps/${zapId}/steps`, {
  headers
});
```

**After (CORRECT):**
```typescript
// ✅ Fetch trigger
const triggerResponse = await fetch(`${apiUrl}/zaps/${zapId}/trigger`, {
  headers
});

// ✅ Fetch actions
const actionsResponse = await fetch(`${apiUrl}/zaps/${zapId}/actions`, {
  headers
});

// Combine and filter client-side
```

### 2. VariableSelector Fix

**Before (INCORRECT):**
```typescript
// ❌ Fetch all steps first to determine type
const stepResponse = await fetch(`${apiUrl}/zaps/${zapId}/steps`, {
  headers
});
const steps = await stepResponse.json();
const sourceStep = steps.find((step: any) => step.id === sourceStepId);

if (sourceStep.step_type === 'TRIGGER') {
  // fetch trigger variables
} else {
  // fetch action variables
}
```

**After (CORRECT):**
```typescript
// ✅ Check if source is trigger by fetching trigger directly
let isTrigger = false;
const triggerResponse = await fetch(`${apiUrl}/zaps/${zapId}/trigger`, {
  headers
});

if (triggerResponse.ok) {
  const triggerData = await triggerResponse.json();
  if (triggerData.step?.id === sourceStepId) {
    isTrigger = true;
  }
}

// Then fetch appropriate variables
if (isTrigger) {
  // fetch from /zaps/{zapId}/trigger
} else {
  // fetch from /zaps/{zapId}/actions/{sourceStepId}
}
```

## Files Modified

1. `front_end/React-Native/AREA/components/molecules/step-source-selector/step-source-selector.tsx`
   - Changed from single `/steps` call to separate `/trigger` and `/actions` calls
   - Combines and filters results client-side
   - Matches web implementation logic

2. `front_end/React-Native/AREA/components/molecules/variable-selector/variable-selector.tsx`
   - Removed dependency on `/steps` endpoint
   - Determines trigger vs action by checking trigger endpoint directly
   - More efficient - one less API call

3. Updated documentation:
   - `MOBILE_VARIABLES_IMPLEMENTATION.md`
   - `QUICK_REFERENCE_MOBILE.md`

## Testing

After this fix, the mobile app should:
1. ✅ Successfully fetch available steps for source selection
2. ✅ Display trigger and previous actions in the dropdown
3. ✅ Auto-select trigger as default source
4. ✅ Fetch variables correctly from selected source
5. ✅ Allow variable insertion into fields

## Why This Happened

The original implementation likely assumed a convenience endpoint existed that would return all steps together. However, the backend API design separates triggers and actions:

- **Triggers**: Always only one per zap, at step_order 0
- **Actions**: Multiple per zap, at step_order 1, 2, 3...

The web implementation handles this by fetching both separately and combining them client-side, which is the pattern we now follow on mobile.

## Backend API Structure (Reference)

```
GET /zaps/{zapId}/trigger
Response: {
  step: { id, step_type: 'TRIGGER', step_order, ... },
  trigger: { id, name, ... },
  service: { ... },
  connection: { ... }
}

GET /zaps/{zapId}/actions
Response: [
  {
    step: { id, step_type: 'ACTION', step_order, ... },
    action: { id, name, ... },
    service: { ... },
    connection: { ... }
  },
  ...
]

GET /zaps/{zapId}/actions/{actionId}
Response: {
  step: { ... },
  action: { id, name, variables: {...}, ... },
  service: { ... },
  connection: { ... }
}
```

## Next Steps

Test the complete flow:
1. Navigate to trigger-fields page
2. Fill trigger fields and click Continue (creates zap)
3. Select an action service and action
4. On action-fields page, you should now see:
   - ✅ Source Step card with dropdown
   - ✅ Trigger selected by default
   - ✅ "+ Insert Variable" buttons
   - ✅ Variables modal opens when clicked
   - ✅ Variables are fetched and displayed
   - ✅ Variables insert correctly into fields

The error `Failed to fetch steps` should be completely resolved.
