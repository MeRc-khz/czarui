# Drag Direction Fix - LZ-Dial Component

## Problem
When users dragged between icons on the outer circle (not directly on an icon), the dial would spin in the **opposite direction** from what they expected.

## Root Cause
The drag rotation calculations were using the **screen center** as the pivot point:
```javascript
let cx = window.innerWidth / 2;
let cy = window.innerHeight / 2;
let currentAngle = Math.atan2(y - cy, x - cx);
```

This worked fine when the dial was centered on screen, but when using `justify="left"` or `justify="right"`, the FAB (and visual rotation center) was **not** at screen center, causing incorrect angle calculations.

## Solution
Changed the rotation pivot point to use the **FAB center** instead of screen center:

```javascript
// Get FAB center for rotation calculations
const rect = this.els.trigger.getBoundingClientRect();
const fabCx = rect.left + rect.width / 2;
const fabCy = rect.top + rect.height / 2;
let currentAngle = Math.atan2(y - fabCy, x - fabCx);
```

## Changes Made

### 1. `start` handler (lines 294-316)
- Moved FAB center calculation outside the inner ring check
- Changed `lastAngle` calculation to use FAB center instead of screen center
- Added clarifying comments

### 2. `move` handler (lines 395-414)
- Changed angle calculation to use FAB center instead of screen center
- Ensures consistent rotation behavior throughout the drag operation

## Testing
A test page has been created: `components/test-drag-fix.html`

### Test Cases:
1. **Left Justified** - FAB on left edge
2. **Center** - FAB in center (default)
3. **Right Justified** - FAB on right edge

### What to Test:
- ✅ Drag ON an icon → should rotate
- ✅ Drag BETWEEN icons (on outer ring) → should rotate in CORRECT direction
- ✅ Drag on inner ring → should rotate
- ✅ Swipe up/down on icon → should snap to next/prev

### Expected Behavior:
- Dragging **clockwise** → dial rotates **clockwise**
- Dragging **counter-clockwise** → dial rotates **counter-clockwise**
- Direction should be correct **regardless** of where you click on the ring

## Technical Details

### Before:
```javascript
// In start handler
let cx = window.innerWidth / 2;
let cy = window.innerHeight / 2;
this.lastAngle = Math.atan2(y - cy, x - cx);

// In move handler
let cx = window.innerWidth / 2;
let cy = window.innerHeight / 2;
let currentAngle = Math.atan2(y - cy, x - cx);
```

### After:
```javascript
// In start handler
const rect = this.els.trigger.getBoundingClientRect();
const fabCx = rect.left + rect.width / 2;
const fabCy = rect.top + rect.height / 2;
this.lastAngle = Math.atan2(y - fabCy, x - fabCx);

// In move handler
const rect = this.els.trigger.getBoundingClientRect();
const fabCx = rect.left + rect.width / 2;
const fabCy = rect.top + rect.height / 2;
let currentAngle = Math.atan2(y - fabCy, x - fabCx);
```

## Impact
- ✅ Fixes incorrect rotation direction when dragging between icons
- ✅ Works correctly with all justify positions (left, center, right)
- ✅ No breaking changes to existing functionality
- ✅ Maintains all other interaction patterns (icon swipe, inner ring, etc.)

## Files Modified
- `components/lz-dial.js` - Fixed drag rotation calculations

## Files Created
- `components/test-drag-fix.html` - Test page for verification
- `components/DRAG_FIX.md` - This documentation
