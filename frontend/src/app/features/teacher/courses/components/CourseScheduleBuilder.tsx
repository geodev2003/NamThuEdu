import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Clock, Users, MapPin, MoreVertical } from "lucide-react";

const daysOfWeek = [
  { id: 1, name: "Thứ 2" },
  { id: 2, name: "Thứ 3" },
  { id: 3, name: "Thứ 4" },
  { id: 4, name: "Thứ 5" },
  { id: 5, name: "Thứ 6" },
  { id: 6, name: "Thứ 7" },
  { id: 0, name: "Chủ Nhật" },
];

const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 to 20:00

const mockClasses = [
  { id: "1", name: "Morning A", day: 1, start: 8, duration: 2, room: "P.101", type: "theory" },
  { id: "2", name: "Morning A", day: 3, start: 8, duration: 2, room: "P.101", type: "theory" },
  { id: "3", name: "Morning A", day: 5, start: 8, duration: 2, room: "P.101", type: "practice" },
  { id: "4", name: "Evening B", day: 2, start: 18, duration: 2, room: "P.202", type: "theory" },
  { id: "5", name: "Evening B", day: 4, start: 18, duration: 2, room: "P.202", type: "theory" },
  { id: "6", name: "Weekend C", day: 6, start: 14, duration: 3, room: "P.305", type: "mixed" },
];

export function CourseScheduleBuilder() {
  const [hoveredSlot, setHoveredSlot] = useState<{day: number, time: number} | null>(null);

  const getClassStyle = (type: string) => {
    switch(type) {
      case "theory": return "bg-blue-100 border-blue-200 text-blue-800";
      case "practice": return "bg-emerald-100 border-emerald-200 text-emerald-800";
      case "mixed": return "bg-purple-100 border-purple-200 text-purple-800";
      default: return "bg-gray-100 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div>
          <h3 className="font-semibold text-gray-900">Lịch học trực quan</h3>
          <p className="text-sm text-gray-500">Kéo thả để sắp xếp lịch học cho các lớp</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs font-medium text-gray-600 mr-4">
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-400"></div> Lý thuyết</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-400"></div> Thực hành</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-purple-400"></div> Hỗn hợp</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            Cài đặt phòng
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Thêm lịch
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[800px] h-full flex flex-col">
          {/* Header row */}
          <div className="flex border-b border-gray-200 sticky top-0 bg-white z-20">
            <div className="w-20 flex-shrink-0 border-r border-gray-200"></div>
            {daysOfWeek.map((day) => (
              <div key={day.id} className="flex-1 py-3 text-center border-r border-gray-200 last:border-0 font-medium text-sm text-gray-700">
                {day.name}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 relative">
            {timeSlots.map((time) => (
              <div key={time} className="flex border-b border-gray-100 h-20">
                {/* Time column */}
                <div className="w-20 flex-shrink-0 border-r border-gray-200 flex items-start justify-center py-2 relative">
                  <span className="text-xs font-medium text-gray-500 absolute -top-2.5 bg-white px-1">
                    {time}:00
                  </span>
                </div>
                
                {/* Day columns */}
                {daysOfWeek.map((day) => {
                  const isHovered = hoveredSlot?.day === day.id && hoveredSlot?.time === time;
                  return (
                    <div 
                      key={`${day.id}-${time}`} 
                      className={`flex-1 border-r border-gray-100 last:border-0 relative transition-colors ${isHovered ? 'bg-indigo-50/50' : ''}`}
                      onMouseEnter={() => setHoveredSlot({day: day.id, time})}
                      onMouseLeave={() => setHoveredSlot(null)}
                    >
                      {isHovered && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button className="w-8 h-8 bg-white shadow-sm rounded-full flex items-center justify-center text-indigo-600 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity z-10 group-hover:opacity-100">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Classes blocks */}
            {mockClasses.map((cls) => {
              const startIdx = timeSlots.indexOf(cls.start);
              if (startIdx === -1) return null;
              
              const dayIdx = daysOfWeek.findIndex(d => d.id === cls.day);
              
              return (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`absolute rounded-lg border p-2 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${getClassStyle(cls.type)}`}
                  style={{
                    top: `${startIdx * 80 + 4}px`, // 80px per slot, 4px padding
                    height: `${cls.duration * 80 - 8}px`,
                    left: `calc(80px + ${dayIdx} * calc((100% - 80px) / 7) + 4px)`,
                    width: `calc(calc((100% - 80px) / 7) - 8px)`,
                    zIndex: 10
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-xs truncate">{cls.name}</span>
                    <button className="text-current opacity-50 hover:opacity-100">
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] opacity-80">
                    <Clock className="w-3 h-3" />
                    {cls.start}:00 - {cls.start + cls.duration}:00
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] opacity-80">
                    <MapPin className="w-3 h-3" />
                    {cls.room}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}