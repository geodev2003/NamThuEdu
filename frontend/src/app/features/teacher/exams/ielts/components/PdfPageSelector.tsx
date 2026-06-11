import { useState, useEffect, useCallback, useRef } from 'react';
import { CheckSquare, Square, Loader2, Scissors, ArrowRight, ZoomIn, X } from 'lucide-react';

/**
 * PdfPageSelector — chọn / cắt trang PDF trước khi import.
 *
 * Tái sử dụng kỹ thuật từ PdfCutterTab (settings): render thumbnail bằng pdfjs,
 * cắt bằng pdf-lib (copyPages). Khác biệt: đóng gói thành component nhúng trong
 * modal với theme xanh dương (đồng bộ Import IELTS) và trả file qua onConfirm.
 *
 * - Mặc định chọn sẵn TẤT CẢ trang (giáo viên chỉ cần bỏ trang thừa).
 * - Nếu giữ nguyên đủ tất cả trang → trả lại chính file gốc (không tạo lại).
 * - Nếu đã bỏ bớt → tạo PDF mới chỉ gồm trang đã chọn.
 */

interface PageThumb {
  pageNum: number;
  dataUrl: string;
}

interface Props {
  file: File;
  /** màu nhấn (theo skill). Mặc định xanh dương. */
  accentColor?: string;
  onConfirm: (result: File) => void;
  onCancel: () => void;
}

export function PdfPageSelector({ file, accentColor = '#2563EB', onConfirm, onCancel }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [thumbs, setThumbs] = useState<PageThumb[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [cutFrom, setCutFrom] = useState<number | ''>('');
  const [cutTo, setCutTo] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [generating, setGenerating] = useState(false);
  const pdfDocRef = useRef<any>(null);
  const [preview, setPreview] = useState<{ pageNum: number; dataUrl: string } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Render thumbnail toàn bộ trang khi nhận file.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setThumbs([]);
      setProgress({ current: 0, total: 0 });

      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc =
        `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      const buf = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buf }).promise;
      if (cancelled) return;
      pdfDocRef.current = pdf;

      const total = pdf.numPages;
      setNumPages(total);
      setProgress({ current: 0, total });
      setSelected(new Set(Array.from({ length: total }, (_, i) => i + 1)));

      for (let i = 1; i <= total; i++) {
        if (cancelled) return;
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.35 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, canvasContext: canvas.getContext('2d')!, viewport } as any).promise;
        if (cancelled) return;
        setThumbs((prev) => [...prev, { pageNum: i, dataUrl: canvas.toDataURL() }]);
        setProgress({ current: i, total });
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  const togglePage = (n: number) =>
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(n) ? s.delete(n) : s.add(n);
      return s;
    });

  // Mở preview trang lớn. Hiện ngay thumbnail (mờ) rồi render lại nét hơn ở scale cao.
  const openPreview = async (pageNum: number, fallbackUrl: string) => {
    setPreview({ pageNum, dataUrl: fallbackUrl });
    const pdf = pdfDocRef.current;
    if (!pdf) return;
    try {
      setPreviewLoading(true);
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.6 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvas, canvasContext: canvas.getContext('2d')!, viewport } as any).promise;
      setPreview((cur) => (cur && cur.pageNum === pageNum ? { pageNum, dataUrl: canvas.toDataURL() } : cur));
    } finally {
      setPreviewLoading(false);
    }
  };

  const applyExclude = () => {
    if (cutFrom === '' || cutTo === '') return;
    const from = Math.max(1, Number(cutFrom));
    const to = Math.min(numPages, Number(cutTo));
    setSelected((prev) => {
      const s = new Set(prev);
      for (let i = from; i <= to; i++) s.delete(i);
      return s;
    });
  };

  const selectAll = () => setSelected(new Set(Array.from({ length: numPages }, (_, i) => i + 1)));
  const deselectAll = () => setSelected(new Set());

  const handleConfirm = useCallback(async () => {
    if (selected.size === 0) return;
    const sorted = Array.from(selected).sort((a, b) => a - b);

    // Giữ nguyên đủ tất cả trang → khỏi tạo lại, dùng file gốc.
    if (sorted.length === numPages) {
      onConfirm(file);
      return;
    }

    setGenerating(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const src = await PDFDocument.load(await file.arrayBuffer());
      const dst = await PDFDocument.create();
      const copied = await dst.copyPages(src, sorted.map((p) => p - 1));
      copied.forEach((p) => dst.addPage(p));
      const out = await dst.save();
      const blob = new Blob([out as BlobPart], { type: 'application/pdf' });
      const trimmedName = file.name.replace(/\.pdf$/i, '') + `_${sorted.length}trang.pdf`;
      const trimmedFile = new File([blob], trimmedName, { type: 'application/pdf' });
      onConfirm(trimmedFile);
    } finally {
      setGenerating(false);
    }
  }, [selected, numPages, file, onConfirm]);

  const sortedSelected = Array.from(selected).sort((a, b) => a - b);
  const isAllSelected = selected.size === numPages && numPages > 0;

  return (
    <div className="space-y-4">
      {/* Banner hướng dẫn */}
      <div
        className="flex items-start gap-3 rounded-xl p-4"
        style={{ background: `${accentColor}0D`, border: `1px solid ${accentColor}33` }}
      >
        <Scissors className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: accentColor }} />
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: accentColor }}>
            Chọn trang cần import
          </p>
          <p className="mt-0.5 text-xs text-gray-600">
            PDF nhiều trang? Bỏ các trang không cần (vd kỹ năng khác) rồi import — giúp phân tích chính xác và tiết kiệm hơn.
          </p>
        </div>
      </div>

      {/* Thanh điều khiển cắt */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3">
          <span className="whitespace-nowrap text-xs font-semibold text-gray-600">Từ trang</span>
          <input
            type="number"
            min={1}
            max={numPages}
            value={cutFrom}
            onChange={(e) => setCutFrom(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="1"
            className="w-12 bg-transparent text-center text-sm font-semibold text-gray-900 focus:outline-none"
          />
        </div>
        <div className="flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3">
          <span className="whitespace-nowrap text-xs font-semibold text-gray-600">Đến trang</span>
          <input
            type="number"
            min={1}
            max={numPages}
            value={cutTo}
            onChange={(e) => setCutTo(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder={String(numPages)}
            className="w-12 bg-transparent text-center text-sm font-semibold text-gray-900 focus:outline-none"
          />
        </div>
        <button
          onClick={applyExclude}
          disabled={cutFrom === '' || cutTo === ''}
          className="h-9 rounded-lg px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: accentColor }}
        >
          Cắt bỏ
        </button>
        <div className="mx-1 h-5 w-px bg-gray-200" />
        <button
          onClick={selectAll}
          className="h-9 rounded-lg border border-gray-300 px-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
        >
          Chọn tất cả
        </button>
        <button
          onClick={deselectAll}
          className="h-9 rounded-lg border border-gray-300 px-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
        >
          Bỏ chọn
        </button>
        <span className="ml-auto text-xs font-medium text-gray-500">
          {selected.size}/{numPages} trang
        </span>
      </div>

      {/* Lưới thumbnail */}
      <div className="max-h-[42vh] overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-3">
        {loading && thumbs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: accentColor }} />
            <p className="text-sm text-gray-500">
              Đang tải trang {progress.current}/{progress.total}...
            </p>
          </div>
        ) : (
          <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(92px, 1fr))' }}>
            {thumbs.map((t) => {
              const isSel = selected.has(t.pageNum);
              return (
                <button
                  key={t.pageNum}
                  onClick={() => togglePage(t.pageNum)}
                  className="group relative overflow-hidden rounded-lg border-2 transition-all duration-150 hover:scale-[1.03]"
                  style={{
                    borderColor: isSel ? accentColor : '#E5E7EB',
                    background: isSel ? `${accentColor}0D` : '#fff',
                  }}
                >
                  <img src={t.dataUrl} alt={`Trang ${t.pageNum}`} className="w-full object-contain" />
                  {/* Nút phóng to — dùng div (tránh button lồng button), chặn toggle chọn */}
                  <div
                    role="button"
                    tabIndex={0}
                    title="Xem trước trang"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPreview(t.pageNum, t.dataUrl);
                    }}
                    className="absolute left-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-md bg-white/90 text-gray-600 opacity-0 shadow transition-opacity hover:bg-white group-hover:opacity-100"
                  >
                    <ZoomIn className="h-3 w-3" />
                  </div>
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ background: 'rgba(0,0,0,0.18)' }}
                  >
                    {isSel ? (
                      <CheckSquare className="h-6 w-6 text-white drop-shadow" />
                    ) : (
                      <Square className="h-6 w-6 text-white drop-shadow" />
                    )}
                  </div>
                  <div className="absolute right-1 top-1">
                    {isSel ? (
                      <div
                        className="flex h-4 w-4 items-center justify-center rounded-full shadow"
                        style={{ backgroundColor: accentColor }}
                      >
                        <CheckSquare className="h-2.5 w-2.5 text-white" />
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-300 bg-white/80" />
                    )}
                  </div>
                  <div
                    className="py-1 text-center text-[10px] font-semibold"
                    style={{ color: isSel ? accentColor : '#9CA3AF' }}
                  >
                    {t.pageNum}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Hàng nút hành động */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          onClick={() => onConfirm(file)}
          className="text-sm font-medium text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline"
        >
          Dùng cả file
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="h-10 rounded-lg px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            Đổi file
          </button>
          <button
            onClick={handleConfirm}
            disabled={selected.size === 0 || generating}
            className="flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: accentColor }}
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Đang cắt...
              </>
            ) : (
              <>
                {isAllSelected ? 'Tiếp tục' : `Cắt & tiếp tục (${selected.size} trang)`}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {sortedSelected.length > 0 && sortedSelected.length < numPages && (
        <p className="truncate text-center text-[11px] text-gray-400">
          Sẽ import trang: {sortedSelected.join(', ')}
        </p>
      )}

      {/* Lightbox xem trước trang lớn */}
      {preview && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-6"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreview(null)}
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-colors hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={preview.dataUrl}
              alt={`Trang ${preview.pageNum}`}
              className="max-h-[90vh] max-w-[90vw] rounded-lg bg-white object-contain shadow-2xl"
            />
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
              {previewLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              Trang {preview.pageNum}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
