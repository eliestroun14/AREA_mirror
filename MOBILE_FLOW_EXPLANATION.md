# Mobile App Flows - Old vs New

## Problem Identified

You're testing with OneDrive trigger → Discord action, but **not seeing the source selection and variable insertion buttons**. This is because there are **TWO different flows** in the mobile app:

### 1. Old Flow (Create Tab) - **WITHOUT variables**
```
/(tabs)/create
  ↓
Select trigger service
  ↓
Select trigger
  ↓
Select action service (NO zapId passed)
  ↓
Select action
  ↓
action-fields-page (NO zapId - variables disabled)
  ↓
Back to /(tabs)/create
  ↓
Finish button → Creates zap with all steps at once
```

**Issue**: In this flow, `zapId` is NOT passed to action-fields-page because the zap doesn't exist yet. Without `zapId`, the source selector and variable buttons cannot work.

### 2. New Flow (Trigger Fields) - **WITH variables**
```
Select trigger service
  ↓
Select trigger
  ↓
trigger-fields-page
  ↓
Continue → Creates zap immediately with trigger
  ↓
select-action-service (zapId IS passed)
  ↓
create-action-service (zapId passed through)
  ↓
action-fields-page (HAS zapId - variables enabled!)
  ↓
Back to select more actions OR finish
```

**Solution**: In this flow, the zap is created in `trigger-fields-page`, so `zapId` exists and is passed all the way to action-fields-page, enabling variables!

---

## Current Code Analysis

### CreateCard Component
**Location**: `components/molecules/create-card/create-card.tsx`

**Problem at line 64-72**:
```tsx
router.push({
  pathname: "/select-action-service",
  params: {
    triggerId: trigger.id,
    serviceTriggerId: serviceTrigger.id,
    // ❌ zapId is MISSING!
  },
});
```

**Why**: The CreateCard is used in `/(tabs)/create` where the zap hasn't been created yet.

---

## How to Test Variables Feature

### ✅ CORRECT WAY (Use Trigger Fields Flow):

1. **Start from scratch** - Don't use the create tab
2. **Navigate to**: Services list
3. **Select OneDrive** service
4. **Select a trigger** (e.g., "New file in folder")
5. **You'll see trigger-fields-page** with fields to configure
6. **Click Continue** - This creates the zap
7. **Select Discord** as action service
8. **Select "Send message"** action
9. **NOW you'll see action-fields-page WITH**:
   - ✅ Source Step card (white card)
   - ✅ Source selector dropdown
   - ✅ Action Fields card
   - ✅ "+ Insert Variable" button under each field

### ❌ INCORRECT WAY (Create Tab - Old Flow):

1. Go to Create tab (`/(tabs)/create`)
2. Select trigger
3. Select action
4. Fill fields
5. Click Finish
6. ❌ No variables available (zap doesn't exist yet)

---

## Code Flow Comparison

### Old Flow Code Path:
```typescript
// /(tabs)/create.tsx
// No zap created yet
↓
// create-card.tsx
router.push({
  pathname: "/select-action-service",
  params: {
    // NO zapId
  }
})
↓
// action-fields-page/[id].tsx
const { zapId } = useLocalSearchParams(); // undefined!
if (!zapId) {
  return <Error>; // ❌ Shows error OR variables disabled
}
```

### New Flow Code Path:
```typescript
// trigger-fields-page/[id].tsx
const zapRes = await axios.post(`${apiUrl}/zaps`, ...); // ✅ Zap created!
const zapId = zapRes.data.id;

router.push({
  pathname: "/select-action-service",
  params: {
    zapId: zapId.toString() // ✅ zapId included
  }
})
↓
// select-action-service
// Receives zapId, passes it to create-action-service
↓
// create-action-service/[id].tsx
const { zapId } = useLocalSearchParams(); // ✅ Has value!
// Passes to ActionCard
↓
// ActionCard
router.push({
  pathname: "/action-fields-page/[id]",
  params: {
    zapId: zapId // ✅ Passed through
  }
})
↓
// action-fields-page/[id].tsx
const { zapId } = useLocalSearchParams(); // ✅ Has value!
if (zapId) {
  // ✅ Show source selector and variables!
}
```

---

## Quick Test Checklist

To verify variables are working:

```
□ NOT using /(tabs)/create page
□ Starting from service selection
□ Going through trigger-fields-page
□ Seeing "Continue" button after trigger selection
□ Seeing zap created in logs
□ zapId present in navigation params
□ action-fields-page shows white cards
□ Source Step card visible
□ Source selector dropdown visible
□ Action Fields card visible
□ "+ Insert Variable" button under each field
□ Can click button to see variables modal
□ Can select variables to insert
□ Variables inserted as {{variable_name}}
```

---

## Solution Options

### Option 1: Keep Both Flows (Recommended)
- **Old Flow**: Quick zap creation without variables (simple use cases)
- **New Flow**: Full-featured with variables (power users)
- **User Choice**: Different entry points for different needs

### Option 2: Migrate Create Tab to New Flow
Update `create-card.tsx` to create the zap earlier:

```typescript
// When user selects trigger
const handleTriggerSelected = async () => {
  // Create zap immediately
  const zapRes = await axios.post(`${apiUrl}/zaps`, {
    name: `Zap: ${trigger.name}`,
    description: 'Auto-created'
  });
  const zapId = zapRes.data.id;
  
  // Create trigger step
  await axios.post(`${apiUrl}/zaps/${zapId}/trigger`, {
    triggerId: trigger.id,
    accountIdentifier: connection.account_identifier,
    payload: {}
  });
  
  // Now navigate with zapId
  router.push({
    pathname: "/select-action-service",
    params: {
      triggerId: trigger.id,
      serviceTriggerId: serviceTrigger.id,
      zapId: zapId.toString() // ✅ Now included!
    }
  });
}
```

### Option 3: Conditional Variables
Keep old flow but disable variables feature when `zapId` is missing:

```typescript
// action-fields-page/[id].tsx
const hasZapId = !!zapId;

// Only show source selector if zapId exists
{hasZapId && (
  <View style={styles.sourceCard}>
    <StepSourceSelector ... />
  </View>
)}

// Only show variable buttons if zapId exists
{hasZapId && sourceStepId && (
  <VariableSelector ... />
)}
```

---

## Recommended Testing Steps

1. **Clear app cache/storage**
2. **Fresh login**
3. **Do NOT go to Create tab**
4. **Follow new flow**:
   ```
   Home → Browse Services → OneDrive → 
   Select Trigger → Fill trigger fields → Continue →
   zapId created →
   Select Discord → Select "Send Message" →
   ✅ See variables feature!
   ```

---

## Expected Behavior

When following the correct flow, you should see:

### Action Fields Page Layout:
```
┌─────────────────────────────────┐
│ 🎨 Discord Header (purple)      │
│ Send Message                    │
│ Post a message to a channel     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Source Step                     │  ← White card
│ Choose which step's data...     │
│ ┌─────────────────────────────┐ │
│ │ Trigger (Step 0)        ▼  │ │  ← Dropdown
│ └─────────────────────────────┘ │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Action Fields                   │  ← White card
│                                 │
│ Channel ID *                    │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ + Insert Variable           │ │  ← Button
│ └─────────────────────────────┘ │
│                                 │
│ Message *                       │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ + Insert Variable           │ │  ← Button
│ └─────────────────────────────┘ │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│         Continue                │  ← Purple button
└─────────────────────────────────┘
```

---

## Debug Commands

If still not working, check console logs for:

```typescript
// Should see:
console.log('[TriggerFields] Zap created with id:', zapId);
console.log('[ActionFields] zapId from params:', zapId);
console.log('[ActionFields] selectedFromStepId:', selectedFromStepId);
console.log('[StepSourceSelector] Available steps:', steps);
console.log('[VariableSelector] Variables loaded:', variables);
```

---

## Summary

**The feature IS working!** You just need to use the correct entry point:
- ❌ Don't use Create tab (`/(tabs)/create`)
- ✅ Use trigger-fields flow (creates zap first)
- ✅ Then you'll see all variable features

The confusion is because there are two different flows in the app, and only the newer one supports variables.
