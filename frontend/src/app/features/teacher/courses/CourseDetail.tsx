import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { usePageHeader } from "../../../../contexts/TeacherHeaderContext";
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  FileText,
  GraduationCap,
  BookMarked,
  BarChart3,
  Edit,
  Trash2,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Download,
  Upload,
  Plus,
  Sparkles,
} from "lucide-react";

import { CourseAIInsights } from "./components/CourseAIInsights";
import { CourseScheduleBuilder } from "./components/CourseScheduleBuilder";
import { CourseDetailedStats } from "./components/CourseDetailedStats";

// Mock data for course detail
const mockCourseDetail = {
  id: "1",
  name: "IELTS 6.5 - Comprehensive Course",
  category: "IELTS",
  level: "6.5",
  description:
    "Khóa học IELTS 6.5 toàn diện dành cho học viên có trình độ trung cấp. Khóa học tập trung vào 4 kỹ năng: Listening, Reading, Writing, Speaking với giáo trình Cambridge chuẩn quốc tế.",
  duration: "4 tháng",
  totalStudents: 48,
  totalClasses: 3,
  startDate: "01/03/2026",
  endDate: "30/06/2026",
  status: "active" as const,
  objectives: [
    "Đạt điểm IELTS 6.5 - 7.0",
    "Nắm vững 4 kỹ năng tiếng Anh",
    "Tự tin giao tiếp trong môi trường quốc tế",
    "Chuẩn bị cho du học và làm việc nước ngoài",
  ],
  curriculum: [
    {
      module: "Module 1: Foundation",
      topics: ["Grammar Review", "Vocabulary Building", "Pronunciation"],
      duration: "4 tuần",
    },
    {
      module: "Module 2: Listening Skills",
      topics: ["Note-taking", "Multiple Choice", "Gap Fill"],
      duration: "4 tuần",
    },
    {
      module: "Module 3: Reading Skills",
      topics: ["Skimming & Scanning", "True/False/Not Given", "Matching"],
      duration: "4 tuần",
    },
    {
      module: "Module 4: Writing Skills",
      topics: ["Task 1: Graphs & Charts", "Task 2: Essay Writing"],
      duration: "4 tuần",
    },
    {
      module: "Module 5: Speaking Skills",
      topics: ["Part 1: Introduction", "Part 2: Long Turn", "Part 3: Discussion"],
      duration: "4 tuần",
    },
  ],
};

const mockClasses = [
  {
    id: "1",
    name: "IELTS 6.5 - Morning Class A",
    students: 24,
    maxStudents: 30,
    schedule: "Mon, Wed, Fri",
    time: "8:00 - 10:00 AM",
    room: "Room 101",
    progress: 75,
    status: "active" as const,
  },
  {
    id: "2",
    name: "IELTS 6.5 - Evening Class B",
    students: 18,
    maxStudents: 25,
    schedule: "Tue, Thu",
    time: "6:00 - 8:00 PM",
    room: "Room 202",
    progress: 60,
    status: "active" as const,
  },
  {
    id: "3",
    name: "IELTS 6.5 - Weekend Class",
    students: 6,
    maxStudents: 20,
    schedule: "Sat, Sun",
    time: "2:00 - 5:00 PM",
    room: "Room 305",
    progress: 30,
    status: "upcoming" as const,
  },
];

const mockStudents = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    email: "an.nguyen@email.com",
    phone: "0901234567",
    class: "Morning Class A",
    enrollDate: "01/03/2026",
    progress: 85,
    status: "active" as const,
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    email: "binh.tran@email.com",
    phone: "0902345678",
    class: "Evening Class B",
    enrollDate: "01/03/2026",
    progress: 72,
    status: "active" as const,
  },
  {
    id: "3",
    name: "Lê Hoàng Cường",
    email: "cuong.le@email.com",
    phone: "0903456789",
    class: "Morning Class A",
    enrollDate: "05/03/2026",
    progress: 68,
    status: "active" as const,
  },
  {
    id: "4",
    name: "Phạm Thu Dung",
    email: "dung.pham@email.com",
    phone: "0904567890",
    class: "Weekend Class",
    enrollDate: "01/04/2026",
    progress: 45,
    status: "active" as const,
  },
];

const mockExams = [
  {
    id: "1",
    title: "IELTS Mock Test 1",
    type: "Mock Test",
    date: "15/03/2026",
    duration: "180 phút",
    students: 42,
    avgScore: 6.2,
    status: "completed" as const,
  },
  {
    id: "2",
    title: "Writing Task 2 Practice",
    type: "Assignment",
    date: "22/03/2026",
    duration: "60 phút",
    students: 38,
    avgScore: 6.5,
    status: "completed" as const,
  },
  {
    id: "3",
    title: "IELTS Mock Test 2",
    type: "Mock Test",
    date: "25/03/2026",
    duration: "180 phút",
    students: 15,
    avgScore: 0,
    status: "ongoing" as const,
  },
];

const mockMaterials = [
  {
    id: "1",
    name: "IELTS Grammar Guide.pdf",
    type: "PDF",
    size: "2.5 MB",
    uploadDate: "01/03/2026",
    downloads: 45,
  },
  {
    id: "2",
    name: "Listening Practice Audio.mp3",
    type: "Audio",
    size: "15.8 MB",
    uploadDate: "05/03/2026",
    downloads: 38,
  },
  {
    id: "3",
    name: "Reading Practice Test.pdf",
    type: "PDF",
    size: "1.8 MB",
    uploadDate: "10/03/2026",
    downloads: 42,
  },
  {
    id: "4",
    name: "Writing Templates.docx",
    type: "Document",
    size: "856 KB",
    uploadDate: "12/03/2026",
    downloads: 36,
  },
];

export function CourseDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mounted, setMounted] = useState(false);
  
  const activeTab = searchParams.get("tab") || "overview";

  usePageHeader({
    breadcrumb: [t("breadcrumb.dashboard"), t("breadcrumb.courses"), mockCourseDetail.name],
    action: {
      label: t("teacher.courses.editCourse"),
      onClick: () => navigate(`/khoa-hoc/${mockCourseDetail.id}/chinh-sua`),
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: "overview", label: "Tổng quan", icon: BookOpen },
    { id: "schedule", label: "Lịch học", icon: Calendar },
    { id: "ai-insights", label: "Phân tích AI", icon: Sparkles },
    { id: "stats", label: "Thống kê", icon: BarChart3 },
    { id: "classes", label: "Lớp học", icon: Users },
    { id: "students", label: "Học viên", icon: GraduationCap },
    { id: "exams", label: "Bài kiểm tra", icon: FileText },
    { id: "materials", label: "Tài liệu", icon: BookMarked },
  ];

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto" style={{ background: "#EEEEF3" }}>
        <div className="px-8 py-6">
          {/* Back Button */}
          <button
            onClick={() => navigate("/giao-vien/khoa-hoc")}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#374151] mb-6 transition-colors"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            <ChevronLeft className="w-5 h-5" />
            Quay lại danh sách khóa học
          </button>

          {/* Course Header */}
          <div
            className="bg-white rounded-xl p-8 mb-6 border border-[#E5E7EB]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(-12px)",
              transition: "opacity 400ms ease, transform 400ms ease",
            }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md"
                    style={{
                      background: "linear-gradient(135deg, #FFEDD5 0%, #FDBA74 100%)",
                      color: "#C2410C",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    <BookOpen className="w-4 h-4" />
                    {mockCourseDetail.category}
                  </div>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{
                      background: "#D1FAE5",
                      color: "#065F46",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    Đang diễn ra
                  </div>
                </div>
                <h1
                  className="text-[#111827] mb-3"
                  style={{ fontSize: "32px", fontWeight: 700 }}
                >
                  {mockCourseDetail.name}
                </h1>
                <p
                  className="text-[#6B7280] max-w-3xl"
                  style={{ fontSize: "15px", lineHeight: "1.6" }}
                >
                  {mockCourseDetail.description}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#FFEDD5] rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#EA580C]" />
                  </div>
                  <div>
                    <div
                      className="text-[#111827]"
                      style={{ fontSize: "24px", fontWeight: 700 }}
                    >
                      {mockCourseDetail.totalStudents}
                    </div>
                    <div className="text-[#6B7280]" style={{ fontSize: "13px" }}>
                      Học viên
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <div
                      className="text-[#111827]"
                      style={{ fontSize: "24px", fontWeight: 700 }}
                    >
                      {mockCourseDetail.totalClasses}
                    </div>
                    <div className="text-[#6B7280]" style={{ fontSize: "13px" }}>
                      Lớp học
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <div>
                    <div
                      className="text-[#111827]"
                      style={{ fontSize: "24px", fontWeight: 700 }}
                    >
                      {mockCourseDetail.duration}
                    </div>
                    <div className="text-[#6B7280]" style={{ fontSize: "13px" }}>
                      Thời lượng
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#E0E7FF] rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#6366F1]" />
                  </div>
                  <div>
                    <div
                      className="text-[#111827]"
                      style={{ fontSize: "16px", fontWeight: 700 }}
                    >
                      {mockCourseDetail.startDate}
                    </div>
                    <div className="text-[#6B7280]" style={{ fontSize: "13px" }}>
                      Ngày bắt đầu
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div
            className="bg-white rounded-xl border border-[#E5E7EB] mb-6 overflow-hidden"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 400ms ease 100ms, transform 400ms ease 100ms",
            }}
          >
            <div className="flex border-b border-[#E5E7EB]">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className="flex-1 flex items-center justify-center gap-2 h-14 transition-all duration-200 relative"
                    style={{
                      color: activeTab === tab.id ? "#EA580C" : "#6B7280",
                      fontSize: "14px",
                      fontWeight: 500,
                      background: activeTab === tab.id ? "#F0F9FF" : "transparent",
                    }}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EA580C]"
                        style={{
                          transition: "all 300ms ease",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 400ms ease 200ms, transform 400ms ease 200ms",
            }}
          >
            {activeTab === "overview" && <OverviewTab course={mockCourseDetail} />}
            {activeTab === "schedule" && <CourseScheduleBuilder />}
            {activeTab === "ai-insights" && <CourseAIInsights />}
            {activeTab === "stats" && <CourseDetailedStats />}
            {activeTab === "classes" && <ClassesTab classes={mockClasses} />}
            {activeTab === "students" && <StudentsTab students={mockStudents} />}
            {activeTab === "exams" && <ExamsTab exams={mockExams} />}
            {activeTab === "materials" && <MaterialsTab materials={mockMaterials} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ course }: { course: typeof mockCourseDetail }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Objectives */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <h3
          className="text-[#111827] mb-4 flex items-center gap-2"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          <TrendingUp className="w-5 h-5 text-[#EA580C]" />
          Mục tiêu khóa học
        </h3>
        <ul className="space-y-3">
          {course.objectives.map((obj, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
              <span className="text-[#374151]" style={{ fontSize: "14px" }}>
                {obj}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Curriculum */}
      <div className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
        <h3
          className="text-[#111827] mb-4 flex items-center gap-2"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          <BookMarked className="w-5 h-5 text-[#EA580C]" />
          Giáo trình
        </h3>
        <div className="space-y-4">
          {course.curriculum.map((module, index) => (
            <div key={index} className="border-l-2 border-[#EA580C] pl-4">
              <div
                className="text-[#111827] mb-2"
                style={{ fontSize: "15px", fontWeight: 600 }}
              >
                {module.module}
              </div>
              <div className="text-[#6B7280] mb-2" style={{ fontSize: "13px" }}>
                Thời lượng: {module.duration}
              </div>
              <ul className="space-y-1">
                {module.topics.map((topic, idx) => (
                  <li
                    key={idx}
                    className="text-[#6B7280] flex items-start gap-2"
                    style={{ fontSize: "13px" }}
                  >
                    <span className="text-[#EA580C]">•</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClassesTab({ classes }: { classes: typeof mockClasses }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-6">
      {classes.map((classItem) => (
        <div
          key={classItem.id}
          className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:border-[#EA580C] transition-all duration-300 cursor-pointer"
          onClick={() => navigate(`/lop-hoc/${classItem.id}`)}
        >
          <h3
            className="text-[#111827] mb-4"
            style={{ fontSize: "16px", fontWeight: 700 }}
          >
            {classItem.name}
          </h3>
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-[#6B7280]" style={{ fontSize: "14px" }}>
              <Users className="w-[18px] h-[18px]" />
              {classItem.students}/{classItem.maxStudents} học viên
            </div>
            <div className="flex items-center gap-2 text-[#6B7280]" style={{ fontSize: "14px" }}>
              <Calendar className="w-[18px] h-[18px]" />
              {classItem.schedule}
            </div>
            <div className="flex items-center gap-2 text-[#6B7280]" style={{ fontSize: "14px" }}>
              <Clock className="w-[18px] h-[18px]" />
              {classItem.time}
            </div>
            <div className="flex items-center gap-2 text-[#6B7280]" style={{ fontSize: "14px" }}>
              <MapPin className="w-[18px] h-[18px]" />
              {classItem.room}
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#6B7280]" style={{ fontSize: "13px" }}>
                Tiến độ
              </span>
              <span className="text-[#10B981]" style={{ fontSize: "14px", fontWeight: 700 }}>
                {classItem.progress}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${classItem.progress}%`,
                  background: "linear-gradient(90deg, #10B981 0%, #059669 100%)",
                }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add New Class Card */}
      <button className="bg-white rounded-xl p-6 border-2 border-dashed border-[#D1D5DB] hover:border-[#EA580C] transition-all duration-300 flex flex-col items-center justify-center gap-3 min-h-[280px]">
        <div className="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center">
          <Plus className="w-8 h-8 text-[#EA580C]" />
        </div>
        <span className="text-[#EA580C]" style={{ fontSize: "15px", fontWeight: 600 }}>
          Thêm lớp học mới
        </span>
      </button>
    </div>
  );
}

function StudentsTab({ students }: { students: typeof mockStudents }) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB]">
      <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
        <h3 className="text-[#111827]" style={{ fontSize: "18px", fontWeight: 700 }}>
          Danh sách học viên ({students.length})
        </h3>
        <button className="flex items-center gap-2 h-10 px-4 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors">
          <Plus className="w-4 h-4" />
          <span style={{ fontSize: "14px", fontWeight: 500 }}>Thêm học viên</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <th className="px-6 py-3 text-left text-[#6B7280]" style={{ fontSize: "13px", fontWeight: 600 }}>
                Họ tên
              </th>
              <th className="px-6 py-3 text-left text-[#6B7280]" style={{ fontSize: "13px", fontWeight: 600 }}>
                Email
              </th>
              <th className="px-6 py-3 text-left text-[#6B7280]" style={{ fontSize: "13px", fontWeight: 600 }}>
                Lớp học
              </th>
              <th className="px-6 py-3 text-left text-[#6B7280]" style={{ fontSize: "13px", fontWeight: 600 }}>
                Ngày đăng ký
              </th>
              <th className="px-6 py-3 text-left text-[#6B7280]" style={{ fontSize: "13px", fontWeight: 600 }}>
                Tiến độ
              </th>
              <th className="px-6 py-3 text-left text-[#6B7280]" style={{ fontSize: "13px", fontWeight: 600 }}>
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 bg-gradient-to-br from-[#EA580C] to-[#C2410C] rounded-full flex items-center justify-center text-white"
                      style={{ fontSize: "14px", fontWeight: 600 }}
                    >
                      {student.name.charAt(0)}
                    </div>
                    <span className="text-[#111827]" style={{ fontSize: "14px", fontWeight: 500 }}>
                      {student.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-[#6B7280]" style={{ fontSize: "14px" }}>
                    <Mail className="w-4 h-4" />
                    {student.email}
                  </div>
                </td>
                <td className="px-6 py-4 text-[#374151]" style={{ fontSize: "14px" }}>
                  {student.class}
                </td>
                <td className="px-6 py-4 text-[#6B7280]" style={{ fontSize: "14px" }}>
                  {student.enrollDate}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden max-w-[100px]">
                      <div
                        className="h-full bg-[#10B981] rounded-full"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span className="text-[#374151]" style={{ fontSize: "13px", fontWeight: 600 }}>
                      {student.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{
                      background: "#D1FAE5",
                      color: "#065F46",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    Đang học
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExamsTab({ exams }: { exams: typeof mockExams }) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB]">
      <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
        <h3 className="text-[#111827]" style={{ fontSize: "18px", fontWeight: 700 }}>
          Bài kiểm tra & Bài tập ({exams.length})
        </h3>
        <button className="flex items-center gap-2 h-10 px-4 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors">
          <Plus className="w-4 h-4" />
          <span style={{ fontSize: "14px", fontWeight: 500 }}>Tạo bài kiểm tra</span>
        </button>
      </div>

      <div className="p-6 space-y-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="border border-[#E5E7EB] rounded-lg p-5 hover:border-[#EA580C] transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-[#111827]" style={{ fontSize: "16px", fontWeight: 600 }}>
                    {exam.title}
                  </h4>
                  <div
                    className="px-2.5 py-1 rounded-md"
                    style={{
                      background: exam.type === "Mock Test" ? "#FFEDD5" : "#FEF3C7",
                      color: exam.type === "Mock Test" ? "#C2410C" : "#92400E",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {exam.type}
                  </div>
                  <div
                    className="px-2.5 py-1 rounded-full"
                    style={{
                      background: exam.status === "completed" ? "#D1FAE5" : exam.status === "ongoing" ? "#FEF3C7" : "#E5E7EB",
                      color: exam.status === "completed" ? "#065F46" : exam.status === "ongoing" ? "#92400E" : "#6B7280",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {exam.status === "completed" ? "Đã hoàn thành" : exam.status === "ongoing" ? "Đang diễn ra" : "Sắp tới"}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  <div className="flex items-center gap-2 text-[#6B7280]" style={{ fontSize: "14px" }}>
                    <Calendar className="w-4 h-4" />
                    {exam.date}
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7280]" style={{ fontSize: "14px" }}>
                    <Clock className="w-4 h-4" />
                    {exam.duration}
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7280]" style={{ fontSize: "14px" }}>
                    <Users className="w-4 h-4" />
                    {exam.students} học viên
                  </div>
                  {exam.avgScore > 0 && (
                    <div className="flex items-center gap-2 text-[#10B981]" style={{ fontSize: "14px", fontWeight: 600 }}>
                      <TrendingUp className="w-4 h-4" />
                      Điểm TB: {exam.avgScore}
                    </div>
                  )}
                </div>
              </div>

              <button className="ml-4 h-9 px-4 bg-[#F3F4F6] text-[#374151] rounded-lg hover:bg-[#E5E7EB] transition-colors">
                <span style={{ fontSize: "14px", fontWeight: 500 }}>Xem chi tiết</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaterialsTab({ materials }: { materials: typeof mockMaterials }) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return "📄";
      case "Audio":
        return "🎵";
      case "Document":
        return "📝";
      default:
        return "📎";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB]">
      <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
        <h3 className="text-[#111827]" style={{ fontSize: "18px", fontWeight: 700 }}>
          Tài liệu học tập ({materials.length})
        </h3>
        <button className="flex items-center gap-2 h-10 px-4 bg-[#EA580C] text-white rounded-lg hover:bg-[#C2410C] transition-colors">
          <Upload className="w-4 h-4" />
          <span style={{ fontSize: "14px", fontWeight: 500 }}>Tải lên tài liệu</span>
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {materials.map((material) => (
            <div
              key={material.id}
              className="border border-[#E5E7EB] rounded-lg p-4 hover:border-[#EA580C] hover:bg-[#F9FAFB] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{getFileIcon(material.type)}</div>
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-[#111827] mb-2 truncate"
                    style={{ fontSize: "14px", fontWeight: 600 }}
                  >
                    {material.name}
                  </h4>
                  <div className="flex items-center gap-4 text-[#6B7280]" style={{ fontSize: "13px" }}>
                    <span>{material.size}</span>
                    <span>•</span>
                    <span>{material.uploadDate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      {material.downloads}
                    </span>
                  </div>
                </div>
                <button className="w-9 h-9 bg-[#F3F4F6] rounded-lg flex items-center justify-center hover:bg-[#EA580C] hover:text-white transition-all duration-200">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
