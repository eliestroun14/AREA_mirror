# Mobile Variables & Source Selection Implementation

## Overview
This document describes the implementation of source selection and mustache variables feature on the React Native mobile version, matching the functionality already present in the web version.

## Features Implemented

### 1. Source Step Selection
Users can now select which step (trigger or previous action) to use as the data source for variables in the current action being configured.

**Components:**
- `StepSourceSelector` - Allows users to select the source step from available previous steps
- Located in: `front_end/React-Native/AREA/components/molecules/step-source-selector/`

**Key Features:**
- Displays all available steps that come before the current action
- Shows trigger and previous actions as options
- Auto-selects the trigger as default source
- Uses a modal bottom sheet for selection
- Styled with the service's brand color

### 2. Mustache Variables Insertion
Users can insert variables from the selected source step into action fields using mustache syntax `{{variable_name}}`.

**Components:**
- `VariableSelector` - Modal component for selecting and inserting variables
- Located in: `front_end/React-Native/AREA/components/molecules/variable-selector/`

**Key Features:**
- Fetches variables from the selected source step
- Displays variable name, type, and mustache syntax
- Allows clicking to insert variable into the current field
- Shows "No variables available" message when source has no variables
- Dynamically fetches trigger or action variables based on source type

### 3. Action Field Card Enhancement
The `ActionFieldCard` component has been enhanced to support variable insertion.

**Key Features:**
- Each field shows a "+ Insert Variable" button when variables are available
- Clicking the button opens the variable selector modal
- Selected variables are appended to the field value in mustache format
- Works with all field types: string, textarea, and select

### 4. Page Layout Improvements
The action fields page has been redesigned to match the web version's UX.

**Key Improvements:**
- **Scrollable Layout**: Entire page is now properly scrollable
- **Card-Based Design**: Content is organized into white cards with shadows
  - Header section with service color background
  - Source step selection card
  - Action fields card
- **Better Visual Hierarchy**: Clear separation between sections
- **Improved Typography**: Better font sizes, weights, and colors
- **Modern Styling**: Rounded corners, proper spacing, shadows

## Files Modified

### Main Page
```
front_end/React-Native/AREA/app/action-fields-page/[id].tsx
```
- Restructured layout with separate header and card sections
- Added source selection card
- Added fields card with proper styling
- Improved button positioning and styling

### Components

#### StepSourceSelector
```
front_end/React-Native/AREA/components/molecules/step-source-selector/step-source-selector.tsx
```
- Fetches available steps from the API
- Filters steps to only show previous steps
- Handles auto-selection of trigger as default
- Fixed TypeScript errors with header types
- Improved modal styling (bottom sheet)

#### VariableSelector
```
front_end/React-Native/AREA/components/molecules/variable-selector/variable-selector.tsx
```
- Fetches variables based on source step type (trigger/action)
- Displays variables in a modal list
- Handles variable insertion
- Fixed TypeScript errors with header types
- Improved modal styling (bottom sheet)

#### ActionFieldCard
```
front_end/React-Native/AREA/components/molecules/action-field-card/action-field-card.tsx
```
- Updated styling to match new card-based design
- Better input field styling with borders
- Improved field title colors (now dark text on white background)
- Uses flexible min-height instead of fixed height

## How It Works

### Flow for Source Selection:
1. User navigates to action fields page
2. `StepSourceSelector` fetches all steps from `/zaps/{zapId}/steps`
3. Component filters to show only previous steps (lower step_order)
4. Trigger is auto-selected as default source
5. User can tap to open modal and select different source
6. Selected source ID is stored in `selectedFromStepId` state
7. This ID is passed to `ActionFieldCard` and `VariableSelector`

### Flow for Variable Insertion:
1. Each field displays a "+ Insert Variable" button
2. When clicked, `VariableSelector` opens as a modal
3. Component determines if source is trigger or action
4. Fetches appropriate variables:
   - Trigger: `/zaps/{zapId}/trigger`
   - Action: `/zaps/{zapId}/actions/{sourceStepId}`
5. Variables are displayed with name, type, and mustache syntax
6. User taps a variable to insert it
7. Variable is appended to field value as `{{variable_name}}`
8. Modal closes automatically

### Data Flow:
```
ActionFieldsPage
├── selectedFromStepId (state)
├── StepSourceSelector
│   └── onSelectFromStep(id) → updates selectedFromStepId
└── ActionFieldCard (for each field)
    ├── receives sourceStepId
    └── VariableSelector
        ├── fetches variables based on sourceStepId
        └── onInsertVariable(name) → appends to field
```

## API Integration

The implementation uses the following API endpoints (matching web version):

1. **GET /zaps/{zapId}/trigger** - Fetch the trigger step
2. **GET /zaps/{zapId}/actions** - Fetch all action steps  
3. **GET /zaps/{zapId}/actions/{actionId}** - Fetch specific action with variables

**Important**: There is NO `/zaps/{zapId}/steps` endpoint. The mobile implementation fetches trigger and actions separately, then combines them client-side, matching the web implementation pattern.

## Styling Consistency

The mobile implementation now matches the web version's design:
- White cards with shadows and rounded corners
- Service color for header background and accents
- Dark text on white backgrounds (improved readability)
- Bottom sheet modals for selections
- Consistent spacing and typography
- Professional, modern appearance

## TypeScript Improvements

Fixed all TypeScript errors:
- Properly typed headers as `Record<string, string>`
- Added explicit types for sort function parameters (`StepInfo`)
- Ensured type safety throughout all components

## Testing Recommendations

1. **Source Selection:**
   - Test with trigger only (no previous actions)
   - Test with multiple previous actions
   - Verify correct steps are shown based on step_order

2. **Variable Insertion:**
   - Test inserting variables from trigger
   - Test inserting variables from previous actions
   - Verify mustache syntax is correct `{{variable_name}}`
   - Test with different field types (string, textarea, select)

3. **Visual Testing:**
   - Test on different screen sizes
   - Verify scrolling works properly
   - Check that modals display correctly
   - Ensure service colors are applied properly

## Future Enhancements

Possible improvements for the future:
1. Add variable preview/tooltip showing variable type and description
2. Support for nested object properties in variables
3. Add variable validation before submission
4. Show variable examples in the selector
5. Add search/filter for variables when list is long

## Comparison with Web Version

The mobile implementation now has feature parity with the web version:

| Feature | Web | Mobile |
|---------|-----|--------|
| Source step selection | ✅ | ✅ |
| Variable insertion | ✅ | ✅ |
| Mustache syntax | ✅ | ✅ |
| Dynamic variable fetching | ✅ | ✅ |
| Card-based layout | ✅ | ✅ |
| Scrollable page | ✅ | ✅ |
| Service color theming | ✅ | ✅ |

The main UI difference is the use of bottom sheet modals on mobile (more native feel) vs. popovers on web.
