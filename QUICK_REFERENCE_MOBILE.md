# Quick Reference - Mobile Variables & Source Selection

## For Developers

### Key Files Modified
```
front_end/React-Native/AREA/
├── app/action-fields-page/[id].tsx              ← Main page (restructured)
└── components/molecules/
    ├── action-field-card/
    │   └── action-field-card.tsx                ← Updated styling
    ├── step-source-selector/
    │   └── step-source-selector.tsx             ← Fixed types, improved UI
    └── variable-selector/
        └── variable-selector.tsx                ← Fixed types, improved UI
```

### State Management
```typescript
// In action-fields-page/[id].tsx
const [selectedFromStepId, setSelectedFromStepId] = useState<number | null>(null);
const [formData, setFormData] = useState<Record<string, string>>({});

// selectedFromStepId flows to:
// - StepSourceSelector (for display)
// - ActionFieldCard (for each field)
// - VariableSelector (fetches variables)
```

### API Calls
```typescript
// Get trigger step
GET /zaps/{zapId}/trigger

// Get all action steps
GET /zaps/{zapId}/actions

// Get specific action with variables  
GET /zaps/{zapId}/actions/{actionId}
```

**Note**: There is no `/zaps/{zapId}/steps` endpoint. Trigger and actions are fetched separately and combined client-side.

### Key Props

#### StepSourceSelector
```typescript
interface StepSourceSelectorProps {
  zapId: number;
  currentStepId?: number | null;       // For edit mode
  selectedFromStepId: number | null;   // Current selection
  onSelectFromStep: (id: number) => void;
  serviceColor?: string;               // For theming
}
```

#### VariableSelector
```typescript
interface VariableSelectorProps {
  zapId: number;
  sourceStepId: number | null;         // Which step's variables to show
  onInsertVariable: (name: string) => void;
  serviceColor?: string;
  buttonText?: string;
}
```

#### ActionFieldCard
```typescript
type Props = {
  item: TriggerField;
  zapId?: number;
  sourceStepId?: number | null;        // For VariableSelector
  serviceColor?: string;
  onFieldChange?: (fieldName: string, value: string) => void;
  value?: string;
};
```

---

## For Users

### How to Use Source Selection

1. **Navigate to Action Configuration**
   - Create/edit a zap
   - Select an action
   - See "Complete action fields" page

2. **Select Variable Source**
   - Look for "Source Step" card (white card near top)
   - Tap the dropdown showing current source
   - Modal opens with available sources
   - Tap to select trigger or previous action
   - Modal closes automatically

3. **Insert Variables**
   - Fill in action fields
   - See "+ Insert Variable" button under each field
   - Tap button to open variables modal
   - Tap any variable to insert it
   - Variable appears as `{{variable_name}}`
   - Can type around it or insert multiple variables

4. **Complete & Continue**
   - Fill all required fields (marked with *)
   - Tap "Continue" button
   - Zap is created with variable mappings

### Visual Guide

```
┌────────────────────────────────────┐
│  🎨 Header                         │  ← Service color
│  Action name and description       │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  Source Step                       │  ← White card
│  Choose your variable source...    │
│  ┌──────────────────────────────┐  │
│  │ Trigger (Step 0)        ▼   │  │  ← Tap to change
│  └──────────────────────────────┘  │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  Action Fields                     │  ← White card
│                                    │
│  Email Address *                   │
│  ┌──────────────────────────────┐  │
│  │ {{sender_email}}             │  │  ← Input with variable
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ + Insert Variable            │  │  ← Tap to insert
│  └──────────────────────────────┘  │
│                                    │
│  Message *                         │
│  ┌──────────────────────────────┐  │
│  │ You received: {{subject}}    │  │  ← Multiple variables OK
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ + Insert Variable            │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│          Continue                  │  ← Service color button
└────────────────────────────────────┘
```

---

## Common Scenarios

### Scenario 1: Email notification from new issue
```
Trigger: GitHub - New Issue
Action: Gmail - Send Email

Source: Trigger (default)
Variables available:
  - {{issue_title}}
  - {{issue_body}}
  - {{issue_url}}
  - {{repository}}

Usage:
To: admin@example.com
Subject: New Issue: {{issue_title}}
Body: Issue in {{repository}}: {{issue_body}}
Link: {{issue_url}}
```

### Scenario 2: Chain multiple actions
```
Step 1 (Trigger): Discord - New Message
Step 2 (Action): OpenAI - Generate Response
Step 3 (Action): Discord - Send Message

For Step 3:
Source: Step 2 (Action 1 - OpenAI)
Variables available:
  - {{generated_text}}
  - {{model_used}}
  - {{tokens_used}}

Usage:
Message: {{generated_text}}
(Uses OpenAI's response, not original Discord message)
```

### Scenario 3: Transform data through actions
```
Step 1 (Trigger): HTTP Webhook - Receive Data
Step 2 (Action): JSON Parse
Step 3 (Action): Format Message
Step 4 (Action): Send Notification

Each step can use previous step's output
Source selection allows flexible data flow
```

---

## Troubleshooting

### Variables not showing?
1. Check that source is selected (not "Select source")
2. Verify source step has variables defined
3. Check network connection for API calls
4. Look at console for error messages

### Source selector empty?
1. Make sure trigger is configured first
2. Check that previous actions exist (for multi-action zaps)
3. Current action can't use itself or future actions as source

### Variable not inserted?
1. Ensure cursor is in the field
2. Tap the variable in the modal
3. Check that field allows text input (not select/dropdown)
4. Modal should close after selection

### Styling issues?
1. Clear app cache/restart
2. Check that service color is defined
3. Verify all components imported correctly

---

## Best Practices

### For Variable Usage
- ✅ Use descriptive variable names
- ✅ Test with real data before activating
- ✅ Handle missing/null variables gracefully
- ✅ Combine variables with static text for clarity
- ❌ Don't use variables from future steps
- ❌ Don't create circular dependencies

### For UI/UX
- ✅ Select trigger as default source
- ✅ Show all required fields clearly
- ✅ Provide helpful error messages
- ✅ Save form state on source change
- ❌ Don't allow invalid source selections
- ❌ Don't lose user input unnecessarily

### For Development
- ✅ Type all component props
- ✅ Handle loading and error states
- ✅ Validate API responses
- ✅ Use TypeScript strictly
- ❌ Don't ignore TypeScript errors
- ❌ Don't skip error handling

---

## Quick Debug Checklist

```
□ Is OAuth2 working? (Can create zaps)
□ Is trigger configured?
□ Does trigger have variables?
□ Is source selector showing options?
□ Is correct source selected?
□ Do variables load in modal?
□ Do variables insert correctly?
□ Is formData updated properly?
□ Does validation pass?
□ Does API call succeed?
```

---

## Performance Notes

- Variables fetched only when source changes
- Modal content lazy-loaded
- Smooth scrolling with proper key props
- No unnecessary re-renders
- Efficient state updates

---

## Security Considerations

- API calls use authentication tokens
- Variables sanitized before insertion
- No sensitive data in logs
- Proper CORS handling
- Secure token storage

---

## Future Roadmap

Possible enhancements:
1. Variable preview with sample data
2. Nested object property access
3. Variable transformation functions
4. Conditional variable display
5. Variable autocomplete in text fields
6. Drag & drop variable insertion
7. Variable usage analytics
8. Smart variable suggestions

---

## Support

For issues or questions:
1. Check console logs first
2. Verify API responses
3. Test on web version for comparison
4. Review this documentation
5. Check mobile-specific guides

---

## Version Info

- Implementation Date: November 2025
- Mobile Framework: React Native / Expo
- TypeScript: Strict mode
- API Version: v1
- Compatible with web version: Yes (feature parity)
