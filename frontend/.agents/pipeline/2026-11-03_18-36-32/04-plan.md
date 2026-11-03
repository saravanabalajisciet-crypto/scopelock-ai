# Implementation Plan — ScopeLock AI Premium Fintech Redesign (Revision 2)

Derived from the approved design at `02-design.md`.
Six changes across five existing files and one new file.
No new npm dependencies. No Python files touched. No API contracts changed.

Build command: `npm run build` (cwd: `c:\Users\balaj\scopelock-ai\frontend`)
Lint command:  `npm run lint`  (cwd: `c:\Users\balaj\scopelock-ai\frontend`)
No automated test suite exists — verification is lint + build + manual browser inspection.

---

- [x] 1. **Edit `TopBar.tsx` — height fix + health status pill**

  Two targeted edits:
  1. Change `h-[64px]` → `h-[68px]` on the `<header>` element.
  2. Add `healthStatus: "loading" | "healthy" | "unhealthy"` to `TopBarProps` and
     receive it as a destructured prop.
  3. Add `AlertCircle` and `CheckCircle2` to the lucide-react import (existing line
     imports `Bell, ChevronDown, Search, ShieldCheck`).
  4. In the Right group `<div className="flex items-center gap-2 sm:gap-3">`,
     insert the three-state health pill **between the search bar and the Bell button**,
     hidden below `md` (`hidden … md:flex`):
     - `loading`: `animate-pulse` skeleton div, `h-6 w-32`, bg `#EEE7F3`.
     - `healthy`: pill with `CheckCircle2 size={11}`, bg `#F0F8F2`, border `#B8DABD`,
       text `#3D6647`, label "All systems operational".
     - `unhealthy`: pill with `AlertCircle size={11}`, bg `#FDE8EA`, border `#F4BCBF`,
       text `#B03545`, label "Service unavailable".
  Both pills use `rounded-full border px-3 py-1.5 text-[11px] font-semibold`.

  Files: `src/components/TopBar.tsx`

  Verify: `npm run lint` passes with no errors on this file.

---

- [x] 2. **Create `src/components/MobileNav.tsx` (new file)**

  A fixed bottom nav bar (`position: fixed`, `inset-x-0 bottom-0 z-50`, `h-16`,
  `lg:hidden`) with four items matching the sidebar: Overview, Validate, History,
  Settings. Icon type is `React.ComponentType<{ size?: number; strokeWidth?: number }>`.
  Icons: `LayoutDashboard`, `FileCheck2`, `History`, `Settings` from lucide-react.
  Active item: color `#55416E`, `strokeWidth={2.2}`. Inactive: `#A89BB0`, `strokeWidth={1.8}`.
  Each `<button>` carries `aria-label={label}` and `aria-current={active ? "page" : undefined}`.
  Bar style: bg `#FFFFFF`, border-top `#E9E2EF`, `paddingBottom: "env(safe-area-inset-bottom, 0px)"`.
  Full implementation is verbatim in the design's §MobileNav section.

  Files: `src/components/MobileNav.tsx` (create)

  Verify: `npm run lint` passes; `npm run build` completes without TypeScript errors
  on the new file.

---

- [x] 3. **Edit `DocumentAnalyzer.tsx` — six changes**

  Apply all six changes from the design in dependency order:

  **3a — Heading copy (Change 1).**
  - Update `pageMeta.validate.description` to
    `"Compare agreements and invoices with AI-powered intelligence."`.
  - Update `pageMeta.overview.description` to `"Your payment validation workspace"`.
  - Update the `PageHeading` call inside `ValidatePage`:
    - `title` → `"Verify before you pay."`
    - `subtitle` → `"Compare agreements and invoices with AI-powered intelligence. Detect discrepancies before money moves."`

  **3b — framer-motion import (Change 2).**
  Change `import { motion } from "framer-motion"` to
  `import { motion, AnimatePresence } from "framer-motion"`.

  **3c — Analysis progress panel (Change 3).**
  Inside `ValidatePage` (before `return`), add local state:
  ```ts
  const [stageIndex, setStageIndex] = useState(0);
  const STAGES = [
    "Reading agreement…",
    "Extracting invoice information…",
    "Comparing financial terms…",
    "Evaluating discrepancies…",
  ] as const;
  ```
  Add a `useEffect` that advances `stageIndex` by +1 every 1100 ms while `loading`
  is true (capped at `STAGES.length - 1`), and resets to 0 when `loading` is false.
  Below the upload card grid and above the action button row, wrap a progress panel
  in `<AnimatePresence>`. When `loading` is true, render a `<motion.div>` with
  `initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}`
  showing the four stage labels. Past stages (`i < stageIndex`) get a neutral dim
  filled dot (`h-3.5 w-3.5 rounded-full bg-[#C2B7CE]`); current stage gets a
  `<Loader2 size={14} animate-spin>`; future stages get an empty circle border.
  **Do not use CheckCircle2 for past stages** (design FR-3.2 prohibition).

  **3d — `canAnalyze` gate (Change 4).**
  Change the existing gate in `ValidatePage`:
  ```ts
  // before:
  const canAnalyze = !!agreement && !!invoice && !loading;
  // after:
  const canAnalyze = !!agreement && !!invoice && !loading && !agreementError && !invoiceError;
  ```

  **3e — `paypalLoading` state + prop threading (Change 5).**
  In `DocumentAnalyzer` root component:
  - Add `const [paypalLoading, setPaypalLoading] = useState(false);`.
  - In `handleProceedToPayment`, add `setPaypalLoading(true)` before the `try` block
    and `setPaypalLoading(false)` in the `finally` block.
  Add `paypalLoading: boolean` to the `ValidatePage` props interface and destructuring.
  Pass `paypalLoading={paypalLoading}` to `<ValidatePage>` at the call site.
  Inside `ValidatePage`, pass `paypalLoading={paypalLoading}` to `<ValidationResult>`.

  **3f — `<main>` padding + `MobileNav` render (Change 6).**
  - Change `<main className="flex-1 overflow-y-auto">` to
    `<main className="flex-1 overflow-y-auto pb-16 lg:pb-0">`.
  - Add `import MobileNav from "@/components/MobileNav";` at the top of the file.
  - Render `<MobileNav activePage={activePage} onNavigate={setActivePage} />`
    inside the outermost `<div className="flex h-screen overflow-hidden">`,
    after the inner `<div className="flex min-w-0 flex-1 flex-col overflow-hidden">` closing tag.

  Files: `src/components/DocumentAnalyzer.tsx`

  Verify: `npm run lint` passes; `npm run build` passes with no TypeScript errors.

---

- [x] 4. **Edit `UploadCard.tsx` — `uploading` prop + `role="alert"`**

  Two changes:
  1. Add `role="alert"` to the existing error `<p>`:
     ```tsx
     {error && (
       <p role="alert" className="px-5 pb-3 text-xs font-medium" style={{ color: "#C34E5A" }}>
         {error}
       </p>
     )}
     ```
  2. Add `uploading?: boolean` to `UploadCardProps` and destructure it.
     - Add `Loader2` to the lucide-react import (existing: `Upload, X`).
     - Update border computation:
       ```ts
       const borderColor = error ? "#C34E5A" : uploading ? "#55416E" : dragOver ? "#55416E" : "#D8CCE2";
       ```
     - In the file-selected branch, replace the remove `<button>` with a conditional:
       when `uploading`, render a `<div>` containing `<Loader2 size={14} animate-spin color="#55416E">`;
       otherwise render the existing remove button.
     - After the remove button conditional, wrap the "Replace file" `<label>` in
       `{!uploading && (…)}`.

  Both `<UploadCard>` usages in `ValidatePage` inside `DocumentAnalyzer.tsx` must
  receive `uploading={loading}` — add this prop to both call sites (this is part of
  this step to keep the interface consistent).

  Files: `src/components/UploadCard.tsx`, `src/components/DocumentAnalyzer.tsx`
  (the two UploadCard call sites in `ValidatePage`)

  Verify: `npm run lint` passes; `npm run build` passes.

---

- [x] 5. **Edit `ValidationResult.tsx` — `paypalLoading` prop**

  One change:
  - Add `paypalLoading?: boolean` to the `Props` type.
  - Add `Loader2` to the lucide-react import (existing imports: `CheckCircle2,
    AlertTriangle, XCircle, ChevronDown, ChevronUp, ArrowRight, Fingerprint, Hash`).
  - Destructure `paypalLoading` in the component signature alongside `result` and
    `onProceedToPayment`.
  - On the "Proceed to Payment" `<button>` (PASS-gated):
    - Add `disabled={paypalLoading}`.
    - Add `disabled:cursor-not-allowed disabled:opacity-70` to `className`.
    - When `paypalLoading` is truthy, render `<Loader2 size={16} animate-spin /> Processing…`;
      otherwise render the existing `<CheckCircle2> Proceed to Payment <ArrowRight>` content.
    - Suppress box-shadow when `paypalLoading`: `boxShadow: paypalLoading ? "none" : "0 4px 14px rgba(77,121,88,0.3)"`.
    - `onMouseEnter`/`onMouseLeave` handlers must guard on `!paypalLoading` before
      changing styles.

  Files: `src/components/ValidationResult.tsx`

  Verify: `npm run lint` passes; `npm run build` passes.

---

- [x] 6. **Final lint + build verification**

  Run both commands from `c:\Users\balaj\scopelock-ai\frontend`:
  ```
  npm run lint
  npm run build
  ```
  Both must exit 0 with no errors or warnings that weren't present before this
  change set.

  Then open the running application and manually verify:
  1. TopBar shows `h-[68px]` header and the health pill (loading → healthy/unhealthy).
  2. On mobile viewport (375 px), the `MobileNav` bar appears at the bottom and the
     desktop sidebar is hidden.
  3. On desktop (≥1024 px), `MobileNav` is hidden and content is not padded by 64 px.
  4. Validate page heading reads "Verify before you pay."
  5. While analysis is in progress, the four-stage progress panel appears with the
     spinner on the active step and neutral dots (not check marks) on past steps.
  6. "Analyze and Validate" button stays disabled when either panel has an active
     error string.
  7. "Proceed to Payment" button shows spinner and is disabled while the PayPal
     order request is in flight.
  8. Upload cards show spinner (not remove/replace) while `loading` is true.
  9. Screen reader: error paragraphs in upload cards have `role="alert"`.

  Files: (no changes — verification only)

  Verify: `npm run lint` exits 0; `npm run build` exits 0.

---

## Digest

### Files touched and what changes

| File | Block changed | Design section |
|---|---|---|
| `src/components/TopBar.tsx` | `TopBarProps` type, `<header>` `h-[64px]`, right group pill insertion, lucide import | §TopBar Change 1 & 2 |
| `src/components/MobileNav.tsx` | New file — entire content | §MobileNav |
| `src/components/DocumentAnalyzer.tsx` | `pageMeta` strings; `PageHeading` copy; framer-motion import; `ValidatePage` local state + progress panel; `canAnalyze`; `paypalLoading` state + `handleProceedToPayment`; `ValidatePage` props interface; `<main>` className; `MobileNav` import + render | §DocumentAnalyzer Changes 1–6 |
| `src/components/UploadCard.tsx` | `UploadCardProps` + `uploading` prop; `borderColor` compute; remove button conditional; "Replace file" conditional; `role="alert"`; lucide import | §UploadCard Changes 1–2 |
| `src/components/ValidationResult.tsx` | `Props` type; "Proceed to Payment" button; `Loader2` import | §ValidationResult Change 1 |

### What was verified before writing this plan

- Read `TopBar.tsx` in full: confirmed existing import line, existing `h-[64px]`, existing right group structure. No `healthStatus` prop exists today.
- Read `DocumentAnalyzer.tsx` in full: confirmed `motion` import (no `AnimatePresence`), existing `pageMeta` strings, `canAnalyze` gate, `handleProceedToPayment` (no `paypalLoading`), `ValidatePage` props interface (no `paypalLoading`), `<main className="flex-1 overflow-y-auto">` (no pb), `<TopBar>` call site (no `healthStatus` prop).
- Read `UploadCard.tsx` in full: confirmed lucide import (`Upload, X`), no `uploading` prop, no `role="alert"` on error paragraph.
- Read `ValidationResult.tsx` in full: confirmed lucide import (no `Loader2`), `Props` type (no `paypalLoading`), existing "Proceed to Payment" button (no disabled/loading state).
- `package.json` confirms: framer-motion `^14.9.0` (AnimatePresence available), lucide-react `^1.66.0`, no test framework configured.
- Build commands: `npm run lint` (eslint) and `npm run build` (next build). No test runner exists.
