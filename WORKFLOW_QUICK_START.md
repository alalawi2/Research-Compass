# 🚀 Quick Start Guide - Research Workflow

## How to Access

1. **From Homepage:**
   - Click the **"Start Workflow"** button (primary CTA)
   - Or click the **"Research Workflow"** card (marked with ★ FEATURED)

2. **Direct URL:**
   - Navigate to `/research-workflow`

## 📋 Step-by-Step Usage

### Phase 1: Research Question (ACTIVE ✅)

**Goal:** Define a clear, structured research question using PICO framework

**How to Use:**

1. **Conversational Mode** (Recommended for beginners):
   - AI guide asks 4 questions one at a time
   - Type your answer in the text area
   - Click "Continue" to move to next question
   - See your answers summarized below
   - Click "Review" after final question

2. **Form Mode** (For experienced researchers):
   - Click "Skip to form" at any time
   - Fill all fields at once:
     - Study Type (dropdown)
     - Population (P)
     - Intervention/Exposure (I/E)
     - Comparison (C)
     - Outcome (O)
     - Additional Notes
   - See PICO summary update in real-time

3. **Navigation:**
   - "Back" - Return to previous question
   - "Save Progress" - Save without completing
   - "Complete & Continue" - Move to Phase 2

**Example Research Question:**
```
Population: Adults with type 2 diabetes aged 40-65
Intervention: Intensive lifestyle modification program
Comparison: Standard care with medication only
Outcome: HbA1c levels and cardiovascular events

Generated: "In adults with type 2 diabetes aged 40-65, does 
intensive lifestyle modification program compared to standard 
care with medication only affect HbA1c levels and cardiovascular events?"
```

---

### Phase 4: Literature Synthesis (ACTIVE ✅)

**Goal:** Extract themes, create evidence tables, identify knowledge gaps

**How to Use:**

#### 1. Thematic Analysis

**Add a Theme:**
- Enter theme name (e.g., "Treatment Effectiveness")
- Describe what it encompasses
- Add key findings (optional, can add multiple)
- Click "Add Theme"

**Example:**
```
Theme: Medication Adherence Barriers
Description: Studies examining factors that reduce patient 
compliance with prescribed treatments
Key Findings:
- Cost is the #1 barrier across all studies
- Side effects lead to 40% discontinuation
- Complex regimens reduce adherence by 60%
```

**Manage Themes:**
- View all themes in expandable cards
- See key findings with checkmarks
- Remove themes with trash icon

#### 2. Evidence Summary Table

**Add Evidence Entry:**
- Study: "Smith et al., 2023"
- Design: "Randomized Controlled Trial"
- Sample Size: 500
- Quality: High/Moderate/Low
- Key Findings: Brief summary
- Click "Add Evidence"

**Example Entry:**
```
Study: Johnson et al., 2024
Design: Double-blind RCT
Sample Size: 1,200
Findings: Intervention reduced HbA1c by 1.2% (p<0.001) 
compared to control at 6 months
Quality: High
```

**View Evidence:**
- Publication-ready table format
- Color-coded quality badges
- Sortable columns
- Export-ready structure

#### 3. Knowledge Gaps

**Add Gap:**
- Type gap description in input field
- Press Enter or click "Add Gap"
- Gap appears in orange-themed card

**Examples:**
```
- No studies have examined long-term outcomes beyond 2 years
- Lack of data on cost-effectiveness in low-resource settings
- Limited research on adherence in elderly populations
- No trials comparing different program delivery methods
```

**Navigation:**
- "Save Progress" - Save without completing
- "Complete & Continue" - Move to Phase 5 (Rationale)

---

## 🎨 Visual Guide

### Progress Tracking

**Top Progress Bar:**
```
Overall Progress
[████████░░░░░░░░░░] 4 of 11 phases completed
```

**Phase Navigator (Left Sidebar):**
```
✓ Research Question        [Green - Completed]
○ Exploratory Review       [Gray - Not started]
○ Systematic Review        [Gray - Not started]
● Literature Synthesis     [Blue - Current]
🔒 Rationale               [Gray - Locked]
🔒 Study Design            [Gray - Locked]
... remaining phases locked
```

### Status Indicators

- **Completed:** Green background, checkmark icon
- **Current:** Primary blue, filled circle
- **Next:** Available to access
- **Locked:** Gray, lock icon (complete previous phases first)

---

## 💾 Data Persistence

### Auto-Save Features:
- ✅ All changes saved to localStorage automatically
- ✅ Data persists between browser sessions
- ✅ Can close browser and resume later
- ✅ Timestamps track last update

### Manual Save:
- Click "Save Progress" in any phase
- Data immediately written to storage
- Continue where you left off

---

## 🔄 Workflow Flow

```
START → Research Question (Phase 1) ✅
  ↓
Exploratory Review (Phase 2) 🔜
  ↓
Systematic Review (Phase 3) 🔜
  ↓
Literature Synthesis (Phase 4) ✅
  ↓
Rationale (Phase 5) 🔜
  ↓
Study Design (Phase 6) 🔜
  ↓
Sample Size (Phase 7) 🔜
  ↓
Statistical Plan (Phase 8) 🔜
  ↓
Methods (Phase 9) 🔜
  ↓
Timeline & Ethics (Phase 10) 🔜
  ↓
Generate Proposal (Phase 11) 🔜
  ↓
END → Download Complete Proposal
```

---

## 📱 Responsive Design

### Desktop (Recommended):
- Full sidebar navigation
- Wide evidence tables
- Side-by-side layouts
- Best experience for data entry

### Tablet:
- Sidebar collapses to icons
- Tables scroll horizontally
- Touch-friendly buttons

### Mobile:
- Stacked layout
- Bottom navigation
- Optimized forms
- Readable on small screens

---

## 🎯 Tips for Best Results

### Research Question Phase:
1. Be specific with population characteristics
2. Define intervention/exposure clearly
3. Choose appropriate comparison
4. Use measurable outcomes
5. Consider SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)

### Literature Synthesis Phase:
1. Group related findings into themes (aim for 3-5 themes)
2. Rate evidence quality honestly
3. Identify real gaps (not just "more research needed")
4. Link gaps directly to your research question
5. Create comprehensive evidence table (include all key studies)

---

## 🆘 Troubleshooting

**Can't access a phase?**
- Complete previous phases first
- Locked phases require sequential completion

**Data not saving?**
- Check browser localStorage is enabled
- Try clicking "Save Progress" manually
- Check browser console for errors

**Lost progress?**
- Check same browser/device used previously
- Clear cache may erase localStorage
- Export important data regularly (future feature)

**Phase seems incomplete?**
- Some phases still show "Coming Soon"
- Phase 1 and 4 are fully functional
- More phases being developed

---

## 🚀 Next Steps After Phase 4

Once you complete Literature Synthesis:

1. **Phase 5: Rationale** - Your synthesis data will auto-populate:
   - Gaps become justification
   - Themes inform significance
   - Evidence supports feasibility

2. **Future Integration:**
   - Included papers → References section
   - Evidence table → Methods section
   - Themes → Introduction background
   - Gaps → Research objectives

---

**Need Help?** Use the Research Assistant Chat (separate tool) for methodology questions!

**Ready to Start?** Click the **"Start Workflow"** button on the homepage!

✨ Happy Researching! ✨
