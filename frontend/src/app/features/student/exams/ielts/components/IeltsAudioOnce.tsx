/**
 * IELTS Listening — audio component (default native player).
 *
 *  • Hiển thị thanh audio mặc định của trình duyệt (controls), không custom UI
 *  • Tự phát khi mount (nếu trình duyệt cho phép) — nếu bị chặn thì học viên bấm play
 *  • Dùng âm lượng mặc định của thiết bị
 *  • Gọi `onEnded` khi phát xong để parent chuyển sang section kế
 */
import { useEffect, useRef } from "react";

interface IeltsAudioOnceProps {
  src: string;
  /** if true, will start playing immediately on mount (caller must ensure user gesture) */
  autoPlay?: boolean;
  onPlay?: () => void;
  onEnded?: () => void;
  /** label shown above the player */
  title?: string;
}

export function IeltsAudioOnce({
  src,
  autoPlay = true,
  onPlay,
  onEnded,
}: IeltsAudioOnceProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Try autoplay on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !autoPlay) return;
    audio.play()
      .then(() => onPlay?.())
      .catch(() => {
        // Autoplay blocked → học viên bấm play trên thanh mặc định
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, src]);

  return (
    <audio
      ref={audioRef}
      src={src}
      controls
      preload="auto"
      className="w-full"
      onPlay={() => onPlay?.()}
      onEnded={() => onEnded?.()}
      controlsList="nodownload"
    />
  );
}
