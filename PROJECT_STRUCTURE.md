# School Management System — Frontend (React SPA)

> This file is a structure snapshot meant for external review (e.g. pasting into ChatGPT to ask "is this structure okay?"). It documents the current frontend architecture as of 2026-08-17. Pairs with `PROJECT_STRUCTURE.md` in the Laravel backend repo (`c:\laragon\www\SMS`), which this app talks to over HTTP.

## Tech stack

- **React 19** + **TypeScript**, built with **Vite**
- **Redux Toolkit** + **RTK Query** for all server state (no hand-rolled loading/error state, no `createAsyncThunk`)
- **React Router v7** for routing, with nested layout/guard routes
- **Tailwind CSS v4** for styling
- **axios** as the actual HTTP client, wrapped in a custom `BaseQueryFn` (not `fetchBaseQuery`)

## Folder structure

```
src/
  api/
    axiosClient.ts       — axios instance: auth header injection, X-Academic-Year-Id header injection,
                            401 -> silent refresh-token retry, normalized error shape
  store/
    api.ts                — RTK Query `createApi` root: axios-backed baseQuery, tag types, envelope unwrapping
    api/
      authApi.ts           — login/logout
      studentsApi.ts       — students CRUD, attendance, attendance report
      teachersApi.ts       — teachers CRUD
      classesApi.ts        — classes/sections
      coursesApi.ts        — courses + course assignment
      academicYearApi.ts   — academic years, tuition fee generation
      examsApi.ts          — exam types + exam schedule
      financialApi.ts      — student fees, teacher salaries, other expenses
      dashboardApi.ts      — single dashboard summary endpoint
      commonApi.ts         — shared/misc endpoints
    (redux slices for local UI state, e.g. sidebar open/close)
  context/
    AuthContext.tsx        — token + user + active-academic-year state, localStorage persistence
  routes/
    AppRoutes.tsx           — the route tree (below)
    ProtectedRoute.tsx      — token-only guard
    RequireAcademicYear.tsx — academic-year-picked guard (separate from ProtectedRoute)
  components/
    common/                 — design-system primitives: Button, Card, Table, Modal, Select, Input,
                              Textarea, DatePicker, FileInput, Badge, Pagination, PageHeader, Loader,
                              EmptyState, ConfirmDialog, FormWrapper
    layout/                 — DashboardLayout, Navbar (incl. academic-year switcher), Sidebar
    academicYear/           — AcademicYearPicker (shared by the post-login picker page and Settings)
  pages/
    auth/                   — LoginPage, SelectAcademicYearPage
    dashboard/              — DashboardPage
    settings/               — SettingsPage
    students/                — StudentsPage, StudentCreatePage, StudentEditPage, StudentProfilePage,
                              AttendancePage, AttendanceReportPage
    teachers/                — TeachersPage, TeacherEditPage, TeacherProfilePage
    classes/                 — ClassesPage
    courses/                 — CoursesPage, AssignCoursesPage
    exams/                   — ExamsPage
    financial/               — StudentFeesPage, TeacherSalariesPage, OtherExpensesPage
    administrator/           — ClassCreatePage, ManageClassFeePage, SectionsPage, ClassTimetablePage,
                              AcademicYearsPage, AcademicYearCreatePage, TuitionFeeGeneratePage,
                              BreakSchedulePage
    setup/                   — NotFound
  types/                    — one file per domain (student, teacher, class, course, academicYear,
                              financial, exam, attendance, auth, dashboard, common) — all typed as
                              PascalCase to match the backend's response envelope
  utils/                    — constants.ts, helpers.ts
```

## Response handling convention

The Laravel API wraps every response as `{ Success, Message, Data, Meta, Errors }` with **all `Data`/`Meta` keys in PascalCase**. `src/store/api.ts`'s `axiosBaseQuery` unwraps `Data` once, centrally — individual endpoint definitions receive the already-unwrapped payload and just type it. Every TypeScript interface in `src/types/` mirrors that PascalCase shape (`Id`, `FirstName`, `AcademicYearId`, etc.) rather than the camelCase that's typical in hand-written TS — this is intentional, to stay a 1:1 mirror of the wire format instead of translating at the boundary.

## Auth + academic-year flow

This is the most structurally distinctive part of the app, so it's worth spelling out for a reviewer:

1. `POST /auth/sign-in` → tokens stored in `localStorage` (`AuthContext.setSession`), user is **not** yet let into the dashboard.
2. User is routed to `/select-academic-year` (`SelectAcademicYearPage`, guarded only by `ProtectedRoute` — token exists, year not yet picked) and must explicitly pick a working academic year. This happens **on every login**, not just once — a stored value from a previous session is deliberately cleared on `setSession()`.
3. The picked year is persisted to `localStorage` and attached as an `X-Academic-Year-Id` header on every subsequent API request (`axiosClient.ts` request interceptor).
4. `RequireAcademicYear` (a second, separate route guard from `ProtectedRoute`) wraps the actual dashboard layout — `activeAcademicYear === null` bounces back to the picker.
5. A `Navbar` dropdown and the `/settings` page both let the user switch years mid-session (via the shared `AcademicYearPicker` component) — switching does a **full page reload**, not a client-side navigate, specifically to guarantee no RTK Query cache entry survives under the old year.
6. This is a **per-session override**, distinct from `AcademicYearsPage`'s "Set to default," which changes the school-wide default in the DB. The two are not the same mechanism.

## Route tree (`src/routes/AppRoutes.tsx`)

```
/login                                                    (public)

ProtectedRoute (token required)
  /select-academic-year                                    (token yes, year not required)

  RequireAcademicYear (token + year required)
    DashboardLayout (sidebar + navbar chrome)
      /                                    → DashboardPage
      /settings                            → SettingsPage

      /students                            → StudentsPage
      /students/create                     → StudentCreatePage
      /students/:classId/:studentId/edit   → StudentEditPage
      /students/:classId/:studentId/profile→ StudentProfilePage
      /attendance                          → AttendancePage
      /attendance/report/:classId          → AttendanceReportPage

      /teachers                            → TeachersPage
      /teachers/:teacherId/edit            → TeacherEditPage
      /teachers/:teacherId/profile         → TeacherProfilePage

      /administrator/classes               → ClassesPage
      /administrator/classes/create        → ClassCreatePage
      /administrator/classes/:classId/tuition-fee → ManageClassFeePage
      /administrator/classes/:classId/sections    → SectionsPage
      /administrator/classes/:classId/sections/:sectionId/timetable → ClassTimetablePage
      /administrator/academic-years        → AcademicYearsPage
      /administrator/academic-years/create → AcademicYearCreatePage
      /administrator/tuition-fee           → TuitionFeeGeneratePage
      /administrator/break-schedule        → BreakSchedulePage

      /courses                             → CoursesPage
      /manage-courses                      → AssignCoursesPage
      /exams                               → ExamsPage

      /financial/fees                      → StudentFeesPage
      /financial/salaries                  → TeacherSalariesPage
      /financial/expenses                  → OtherExpensesPage

/404                                                       → NotFound
*                                                           → redirect to /404
```

## Sidebar navigation grouping (`Sidebar.tsx`)

- **Workspace:** Dashboard, Settings
- **Academic:** Students, Teachers, Attendance, Classes, Courses, Assign Courses, Exams
- **Financial:** Student Fees, Teacher Salaries, Other Expenses
- **Administrator:** Academic Year (create/manage), Tuition Fee, Create New Class, Break Schedule

## Known structural notes / things worth a second opinion

- Route paths under `/administrator/*` mix with top-level paths (`/courses`, `/exams`, `/financial/*`) that arguably belong under the same namespace — inconsistent nesting depth.
- `ClassesPage` lives at `src/pages/classes/` while class-*management* pages (create, sections, timetable, tuition-fee) live under `src/pages/administrator/` — the "classes" concept is split across two page directories.
- No route-level code splitting (`React.lazy`) yet — all pages are eagerly bundled.
- No shared form-validation layer (e.g. zod/yup) — forms rely on native/manual validation matching the backend's inline `Validator::make()` rules by convention, not by a shared schema.
- `AuthContext`'s `user` object resets to `null` on a hard page refresh (only the token/active-year survive) — there's no "fetch current user" endpoint yet, so this is a known, currently-accepted gap, not a bug.
