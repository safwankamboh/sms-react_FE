import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../features/auth/LoginPage'
import DashboardPage from '../features/dashboard/DashboardPage'
import StudentsPage from '../features/students/StudentsPage'
import StudentEditPage from '../features/students/StudentEditPage'
import StudentProfilePage from '../features/students/StudentProfilePage'
import AttendancePage from '../features/students/AttendancePage'
import TeachersPage from '../features/teachers/TeachersPage'
import TeacherEditPage from '../features/teachers/TeacherEditPage'
import TeacherProfilePage from '../features/teachers/TeacherProfilePage'
import ClassesPage from '../features/classes/ClassesPage'
import NotFound from '../features/setup/NotFound'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />

          <Route path="students" element={<StudentsPage />} />
          <Route path="students/:classId/:studentId/edit" element={<StudentEditPage />} />
          <Route path="students/:classId/:studentId/profile" element={<StudentProfilePage />} />
          <Route path="attendance" element={<AttendancePage />} />

          <Route path="teachers" element={<TeachersPage />} />
          <Route path="teachers/:teacherId/edit" element={<TeacherEditPage />} />
          <Route path="teachers/:teacherId/profile" element={<TeacherProfilePage />} />

          <Route path="administrator/classes" element={<ClassesPage />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default AppRoutes
