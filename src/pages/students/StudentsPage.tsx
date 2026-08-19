import { useEffect, useState } from "react";
import { Plus, Eye, UserMinus, RotateCcw, User, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetStudentsQuery,
  useSoftDeleteStudentMutation,
  useRestoreStudentMutation,
} from "../../store/api/studentsApi";
import {
  Table,
  Button,
  PageHeader,
  Badge,
  Pagination,
  ConfirmDialog,
  Input,
  Select,
} from "../../components/common";
import type { Column } from "../../components/common/Table";
import type { Student, StudentStatus } from "../../types";
import { formatDate } from "../../utils/helpers";

const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "all", label: "All statuses" },
  { value: "inactive", label: "Inactive" },
  { value: "transferred", label: "Transferred" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "graduated", label: "Graduated" },
];

const STATUS_BADGE_VARIANT: Record<StudentStatus, "success" | "default" | "info" | "warning"> = {
  active: "success",
  inactive: "default",
  transferred: "info",
  withdrawn: "warning",
  graduated: "success",
};

function StudentsPage() {
  const navigate = useNavigate();
  const [deactivateTarget, setDeactivateTarget] = useState<{
    classId: number;
    studentId: number;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("active");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // No debounce utility exists in this app yet — a small local timer is
  // the lightest way to avoid firing a request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: studentsPage, isFetching: loadingStudents } =
    useGetStudentsQuery({ page, search: search || undefined, status });

  const [softDeleteStudent, { isLoading: deactivating }] =
    useSoftDeleteStudentMutation();
  const [restoreStudent] = useRestoreStudentMutation();

  const list = studentsPage?.data ?? [];

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    await softDeleteStudent(deactivateTarget);
    setDeactivateTarget(null);
  };

  const columns: Column<Student>[] = [
    {
      key: "name",
      header: "Name",
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            <User size={14} />
          </div>
          <div>
            <p className="font-medium text-slate-900">
              {s.FirstName} {s.LastName}
            </p>
            <p className="text-xs text-slate-400">{s.ContactNumber}</p>
          </div>
        </div>
      ),
    },
    { key: "gr_number", header: "GR Number", render: (s) => s.GrNumber },
    {
      key: "status",
      header: "Status",
      render: (s) => <Badge variant={STATUS_BADGE_VARIANT[s.Status]}>{s.Status}</Badge>,
    },
    { key: "guardian", header: "Guardian", render: (s) => s.Guardian },
    {
      key: "class",
      header: "Class",
      render: (s) => s.Class?.ClassName ?? "—",
    },
    {
      key: "section",
      header: "Section",
      render: (s) => s.Section?.SectionName ?? "—",
    },
    {
      key: "created_at",
      header: "Enrolled On",
      render: (s) => formatDate(s.CreatedAt),
    },
    {
      key: "actions",
      header: "Actions",
      render: (s) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            icon={<Eye size={14} />}
            onClick={() => navigate(`/students/${s.ClassId}/${s.Id}/profile`)}
          >
            {null}
          </Button>
          {s.Status === "active" ? (
            <Button
              size="sm"
              variant="ghost"
              icon={<UserMinus size={14} />}
              className="text-rose-500 hover:text-rose-700"
              onClick={() =>
                setDeactivateTarget({ classId: s.ClassId, studentId: s.Id })
              }
            >
              {null}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              icon={<RotateCcw size={14} />}
              onClick={() => restoreStudent({ classId: s.ClassId, studentId: s.Id })}
            >
              {null}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Academic"
        title="Students"
        description="Manage student registrations, profiles and records."
        actions={
          <Button
            icon={<Plus size={16} />}
            onClick={() => navigate("/students/create")}
          >
            Add Student
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="sm:w-72">
          <Input
            icon={Search}
            placeholder="Search by GR number, name, or contact"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <Select
            value={status}
            options={STATUS_FILTER_OPTIONS}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            placeholder=""
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={list}
        loading={loadingStudents}
        emptyTitle="No students found"
        rowKey="Id"
      />
      <Pagination
        currentPage={studentsPage?.meta.currentPage ?? 1}
        lastPage={studentsPage?.meta.lastPage ?? 1}
        onPageChange={setPage}
        total={studentsPage?.meta.total ?? 0}
        from={studentsPage?.meta.from ?? 0}
        to={studentsPage?.meta.to ?? 0}
      />

      <ConfirmDialog
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        loading={deactivating}
        title="Deactivate Student"
        description="This student will be marked inactive and hidden from the active list. You can restore them later — nothing is deleted."
        confirmLabel="Deactivate"
      />
    </div>
  );
}

export default StudentsPage;
