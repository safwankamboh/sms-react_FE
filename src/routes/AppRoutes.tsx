import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import RequireAcademicYear from './RequireAcademicYear'
import LoginPage from '../pages/auth/LoginPage'
import SelectAcademicYearPage from '../pages/auth/SelectAcademicYearPage'
import SettingsPage from '../pages/settings/SettingsPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import StudentsPage from '../pages/students/StudentsPage'
import StudentCreatePage from '../pages/students/StudentCreatePage'
import StudentEditPage from '../pages/students/StudentEditPage'
import StudentProfilePage from '../pages/students/StudentProfilePage'
import AttendancePage from '../pages/students/AttendancePage'
import AttendanceReportPage from '../pages/students/AttendanceReportPage'
import TeachersPage from '../pages/teachers/TeachersPage'
import TeacherEditPage from '../pages/teachers/TeacherEditPage'
import TeacherProfilePage from '../pages/teachers/TeacherProfilePage'
import ClassesPage from '../pages/classes/ClassesPage'
import ClassCreatePage from '../pages/administrator/ClassCreatePage'
import ManageClassFeePage from '../pages/administrator/ManageClassFeePage'
import AcademicYearsPage from '../pages/administrator/AcademicYearsPage'
import AcademicYearCreatePage from '../pages/administrator/AcademicYearCreatePage'
import TuitionFeeGeneratePage from '../pages/administrator/TuitionFeeGeneratePage'
import BreakSchedulePage from '../pages/administrator/BreakSchedulePage'
import SectionsPage from '../pages/administrator/SectionsPage'
import ClassTimetablePage from '../pages/administrator/ClassTimetablePage'
import CoursesPage from '../pages/courses/CoursesPage'
import AssignCoursesPage from '../pages/courses/AssignCoursesPage'
import ExamsPage from '../pages/exams/ExamsPage'
import OtherExpensesPage from '../pages/financial/OtherExpensesPage'
import TeacherSalariesPage from '../pages/financial/TeacherSalariesPage'
import StudentFeesPage from '../pages/financial/StudentFeesPage'
import NotFound from '../pages/setup/NotFound'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="select-academic-year" element={<SelectAcademicYearPage />} />

        <Route element={<RequireAcademicYear />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="settings" element={<SettingsPage />} />

            <Route path="students" element={<StudentsPage />} />
            <Route path="students/create" element={<StudentCreatePage />} />
            <Route path="students/:classId/:studentId/edit" element={<StudentEditPage />} />
            <Route path="students/:classId/:studentId/profile" element={<StudentProfilePage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="attendance/report/:classId" element={<AttendanceReportPage />} />

            <Route path="teachers" element={<TeachersPage />} />
            <Route path="teachers/:teacherId/edit" element={<TeacherEditPage />} />
            <Route path="teachers/:teacherId/profile" element={<TeacherProfilePage />} />

            <Route path="administrator/classes" element={<ClassesPage />} />
            <Route path="administrator/classes/create" element={<ClassCreatePage />} />
            <Route path="administrator/classes/:classId/tuition-fee" element={<ManageClassFeePage />} />
            <Route path="administrator/classes/:classId/sections" element={<SectionsPage />} />
            <Route path="administrator/classes/:classId/sections/:sectionId/timetable" element={<ClassTimetablePage />} />
            <Route path="administrator/academic-years" element={<AcademicYearsPage />} />
            <Route path="administrator/academic-years/create" element={<AcademicYearCreatePage />} />
            <Route path="administrator/tuition-fee" element={<TuitionFeeGeneratePage />} />
            <Route path="administrator/break-schedule" element={<BreakSchedulePage />} />

            <Route path="courses" element={<CoursesPage />} />
            <Route path="manage-courses" element={<AssignCoursesPage />} />
            <Route path="exams" element={<ExamsPage />} />

            <Route path="financial/fees" element={<StudentFeesPage />} />
            <Route path="financial/salaries" element={<TeacherSalariesPage />} />
            <Route path="financial/expenses" element={<OtherExpensesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default AppRoutes
