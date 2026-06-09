/**
 * AdminPageSkeleton — skeleton loading variants cho admin (Data-Dense theme).
 *
 *  AdminPageSkeleton   — full page (Suspense fallback + dashboard)
 *  AdminTableSkeleton  — table header + rows, dùng inline khi loading ? trong các list page
 *  AdminStatsSkeleton  — stat cards + chart area, dùng cho report/stats page
 *  AdminSettingsSkeleton — stacked form cards, dùng cho settings page
 */
function Bar({ w = "100%", h = 12, r = 6 }: { w?: number | string; h?: number; r?: number }) {
  return (
    <div
      className="animate-pulse"
      style={{ width: w, height: h, borderRadius: r, background: "#E2E8F0" }}
    />
  );
}

function Card({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12 }}
    >
      {children}
    </div>
  );
}

/** Table rows skeleton — drop-in replacement for "Đang tải..." inside a table container */
export function AdminTableSkeleton({ rows = 7, cols = 5 }: { rows?: number; cols?: number }) {
  const colArr = Array.from({ length: cols }, (_, i) => i);
  const rowArr = Array.from({ length: rows }, (_, i) => i);
  return (
    <div>
      {/* thead */}
      <div
        className="grid gap-4 px-5 py-3 border-b"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, borderColor: "#F1F5F9" }}
      >
        {colArr.map((c) => <Bar key={c} w="55%" h={10} r={4} />)}
      </div>
      {/* tbody */}
      {rowArr.map((row) => (
        <div
          key={row}
          className="grid gap-4 px-5 py-3.5"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, borderBottom: "1px solid #F8FAFC" }}
        >
          {colArr.map((c) => (
            <Bar
              key={c}
              w={c === 0 ? "80%" : c === cols - 1 ? "45%" : "65%"}
              h={12}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Stat cards + chart area skeleton — for report / analytics pages */
export function AdminStatsSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="space-y-4">
      <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${cards}, 1fr)` }}>
        {Array.from({ length: cards }, (_, i) => (
          <Card key={i} className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-xl" style={{ background: "#E2E8F0" }} />
              <div className="flex flex-1 flex-col gap-2">
                <Bar w={48} h={18} r={6} />
                <Bar w={80} h={11} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <Bar w={150} h={14} r={6} />
            <Bar w={80} h={28} r={8} />
          </div>
          <div className="animate-pulse rounded-xl" style={{ height: 220, background: "#F1F5F9" }} />
        </Card>
        <Card className="p-5">
          <Bar w={110} h={14} r={6} />
          <div className="mt-4 flex flex-col gap-3">
            {[0,1,2,3,4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 flex-shrink-0 animate-pulse rounded-lg" style={{ background: "#E2E8F0" }} />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Bar w="70%" h={11} />
                  <Bar w="45%" h={9} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/** Stacked form-section skeleton — for settings page */
export function AdminSettingsSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <Card key={i} className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <Bar w={160} h={14} r={6} />
            <Bar w={70} h={26} r={8} />
          </div>
          <div className="space-y-4">
            {[0, 1, 2].map((j) => (
              <div key={j} className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <Bar w="40%" h={11} />
                  <Bar w="60%" h={9} />
                </div>
                <Bar w={120} h={34} r={8} />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="p-6" style={{ background: "#F8FAFC", minHeight: "100%" }}>
      {/* Amber hairline accent */}
      <div
        className="mb-5 h-0.5 w-24 rounded-full animate-pulse"
        style={{ background: "linear-gradient(90deg,#F59E0B,transparent)" }}
      />

      {/* Page title */}
      <div className="mb-6 flex flex-col gap-2">
        <Bar w={220} h={22} r={8} />
        <Bar w={320} h={13} />
      </div>

      {/* 4 stat cards */}
      <div className="mb-5 grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-xl" style={{ background: "#E2E8F0" }} />
              <div className="flex flex-1 flex-col gap-2">
                <Bar w={48} h={18} r={6} />
                <Bar w={80} h={11} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 2-column panels */}
      <div className="mb-5 grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <Bar w={160} h={15} r={6} />
            <Bar w={90} h={28} r={8} />
          </div>
          <div className="animate-pulse rounded-lg" style={{ height: 220, background: "#F1F5F9" }} />
        </Card>
        <Card className="p-5">
          <Bar w={120} h={15} r={6} />
          <div className="mt-4 flex flex-col gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 flex-shrink-0 animate-pulse rounded-lg" style={{ background: "#E2E8F0" }} />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Bar w="70%" h={11} />
                  <Bar w="45%" h={9} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Table block */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <Bar w={180} h={15} r={6} />
          <div className="flex gap-2">
            <Bar w={110} h={32} r={8} />
            <Bar w={90} h={32} r={8} />
          </div>
        </div>
        {/* header row */}
        <div className="mb-3 grid grid-cols-5 gap-4 border-b pb-3" style={{ borderColor: "#F1F5F9" }}>
          {[0, 1, 2, 3, 4].map((i) => <Bar key={i} w="70%" h={10} />)}
        </div>
        {/* rows */}
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="grid grid-cols-5 gap-4 py-3" style={{ borderBottom: "1px solid #F8FAFC" }}>
            {[0, 1, 2, 3, 4].map((c) => (
              <Bar key={c} w={c === 0 ? "85%" : c === 4 ? "50%" : "65%"} h={12} />
            ))}
          </div>
        ))}
      </Card>
    </div>
  );
}

export default AdminPageSkeleton;

/** Profile session-list skeleton — for sessions / activity list inside a card body */
export function AdminProfileSessionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3.5">
          <div
            className="h-9 w-9 flex-shrink-0 animate-pulse rounded-xl"
            style={{ background: "#F1F5F9" }}
          />
          <div className="flex flex-1 flex-col gap-1.5">
            <Bar w="55%" h={12} />
            <Bar w="35%" h={10} />
          </div>
          <Bar w={64} h={26} r={8} />
        </div>
      ))}
    </div>
  );
}

/** Settings rows skeleton — toggle/control rows inside a settings card */
export function AdminSettingsRowsSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="divide-y" style={{ borderColor: "#F8FAFC" }}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex flex-1 flex-col gap-1.5">
            <Bar w="40%" h={12} />
            <Bar w="65%" h={10} />
          </div>
          <Bar w={36} h={20} r={999} />
        </div>
      ))}
    </div>
  );
}

/** Form skeleton — for create/edit pages with grid form fields */
export function AdminFormSkeleton({ fields = 8, cols = 2 }: { fields?: number; cols?: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: fields }, (_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Bar w="35%" h={11} />
            <Bar w="100%" h={36} r={8} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Bar w={90} h={36} r={8} />
        <Bar w={140} h={36} r={8} />
      </div>
    </div>
  );
}
