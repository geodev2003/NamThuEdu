import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, Legend, Cell
} from "recharts";

const performanceData = [
  { subject: 'Listening', A: 85, B: 65, fullMark: 100 },
  { subject: 'Reading', A: 78, B: 70, fullMark: 100 },
  { subject: 'Writing', A: 65, B: 60, fullMark: 100 },
  { subject: 'Speaking', A: 72, B: 80, fullMark: 100 },
  { subject: 'Grammar', A: 88, B: 75, fullMark: 100 },
  { subject: 'Vocab', A: 80, B: 85, fullMark: 100 },
];

const progressData = [
  { name: 'Tuần 1', score: 5.5, target: 6.5 },
  { name: 'Tuần 2', score: 5.8, target: 6.5 },
  { name: 'Tuần 3', score: 6.0, target: 6.5 },
  { name: 'Tuần 4', score: 6.2, target: 6.5 },
  { name: 'Tuần 5', score: 6.1, target: 6.5 },
  { name: 'Tuần 6', score: 6.4, target: 6.5 },
];

const attendanceData = [
  { name: 'Morning A', present: 22, absent: 2, late: 1 },
  { name: 'Evening B', present: 15, absent: 3, late: 0 },
  { name: 'Weekend C', present: 6, absent: 0, late: 0 },
];

const COLORS = ['#10B981', '#F43F5E', '#F59E0B'];

export function CourseDetailedStats() {
  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Trung bình kiểm tra", value: "6.4", trend: "+0.3", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Tỷ lệ chuyên cần", value: "92%", trend: "+2%", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Bài tập hoàn thành", value: "85%", trend: "-5%", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Tỷ lệ duy trì", value: "98%", trend: "0%", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
          >
            <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-md ${stat.bg} ${stat.color}`}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Progress Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-gray-900">Tiến độ điểm số</h3>
            <p className="text-sm text-gray-500">Trung bình của toàn bộ học viên qua các tuần</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="target" stroke="#9ca3af" strokeDasharray="5 5" fill="none" name="Mục tiêu" />
                <Area type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" name="Thực tế" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Radar */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-gray-900">Phân bố kỹ năng</h3>
            <p className="text-sm text-gray-500">Điểm mạnh & điểm yếu trung bình</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={performanceData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Lớp hiện tại" dataKey="A" stroke="#EA580C" fill="#3B82F6" fillOpacity={0.5} />
                <Radar name="Chuẩn trung tâm" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Stacked Bar - Spans 2 columns */}
        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900">Điểm danh theo lớp</h3>
              <p className="text-sm text-gray-500">Tỷ lệ đi học, vắng và đi muộn</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attendanceData}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="present" name="Có mặt" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} barSize={30} />
                <Bar dataKey="late" name="Đi muộn" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                <Bar dataKey="absent" name="Vắng mặt" stackId="a" fill="#EF4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

