import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../pages/auth/LoginPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import StudentsPage from '../pages/students/StudentsPage'
import StudentCreatePage from '../pages/students/StudentCreatePage'
import StudentEditPage from '../pages/students/StudentEditPage'
import StudentProfilePage from '../pages/students/StudentProfilePage'
import AttendancePage from '../pages/students/AttendancePage'
import TeachersPage from '../pages/teachers/TeachersPage'
import TeacherEditPage from '../pages/teachers/TeacherEditPage'
import TeacherProfilePage from '../pages/teachers/TeacherProfilePage'
import ClassesPage from '../pages/classes/ClassesPage'
import NotFound from '../pages/setup/NotFound'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />

          <Route path="students" element={<StudentsPage />} />
          <Route path="students/create" element={<StudentCreatePage />} />
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
