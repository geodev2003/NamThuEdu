import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Save, Camera, ChevronDown, Loader2 } from 'lucide-react';
import { studentApi } from '../../../../services/studentApi';
import { useToastContext } from '../../../../contexts/ToastContext';

type Form = {
  uName: string;
  uGender: 0 | 1;
  uAddress: string;
  uDoB: string;
  bio: string;
};

type ProfileData = {
  uId: number;
  uName: string;
  uPhone: string;
  uGender: 0 | 1 | boolean | null;
  uAddress: string | null;
  uDoB: string | null;
  bio: string | null;
  avatar_url: string | null;
  age_group?: string;
};

const inputBase =
  'w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 ' +
  'placeholder:text-slate-400 transition-colors ' +
  'focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100';

const labelBase = 'block text-xs font-semibold text-slate-700 mb-1.5';

type Props = {
  /** Whether card is expanded by default. Defaults to true. */
  defaultExpanded?: boolean;
};

export function AccountInfoCard({ defaultExpanded = true }: Props = {}) {
  const queryClient = useQueryClient();
  const toast = useToastContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [form, setForm] = useState<Form>({
    uName: '',
    uGender: 1,
    uAddress: '',
    uDoB: '',
    bio: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['student', 'profile'],
    queryFn: () => studentApi.getProfile(),
  });

  const profile: ProfileData | undefined =
    (data as any)?.data?.data ?? (data as any)?.data;

  // Sync form with fetched profile (useQuery v5 has no onSuccess)
  useEffect(() => {
    if (!profile) return;
    setForm({
      uName: profile.uName ?? '',
      uGender: (profile.uGender ? 1 : 0) as 0 | 1,
      uAddress: profile.uAddress ?? '',
      uDoB: profile.uDoB ?? '',
      bio: profile.bio ?? '',
    });
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: () =>
      studentApi.updateProfile({
        uName: form.uName,
        uGender: !!form.uGender,
        uAddress: form.uAddress || null,
        uDoB: form.uDoB || null,
        bio: form.bio || null,
      }),
    onSuccess: () => {
      toast.success('Đã lưu thay đổi');
      queryClient.invalidateQueries({ queryKey: ['student', 'profile'] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Có lỗi xảy ra. Vui lòng thử lại.';
      toast.error(msg);
    },
  });

  // Real avatar upload
  const avatarMutation = useMutation({
    mutationFn: (file: File) => studentApi.uploadAvatar(file),
    onSuccess: () => {
      toast.success('Đã cập nhật ảnh đại diện');
      queryClient.invalidateQueries({ queryKey: ['student', 'profile'] });
    },
    onError: (err: any) => {
      const errors = err?.response?.data?.errors;
      const firstError = errors ? Object.values(errors).flat()[0] : null;
      toast.error(
        String(firstError || err?.response?.data?.message || 'Không thể tải ảnh lên.')
      );
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ảnh không được vượt quá 2MB.');
      return;
    }
    avatarMutation.mutate(file);
    e.target.value = '';
  };

  const initials = (form.uName || profile?.uName || 'B')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header — clickable for collapse/expand */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 p-4 sm:p-6 hover:bg-slate-50/50 transition-colors text-left"
        aria-expanded={expanded}
        aria-controls="account-info-body"
      >
        <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-rose-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Thông tin tài khoản</h2>
          <p className="text-xs sm:text-sm text-slate-500 truncate">
            Cập nhật thông tin cá nhân của bạn
          </p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Body */}
      {expanded && (
        <div id="account-info-body" className="px-4 sm:px-6 pb-5 sm:pb-6 -mt-2">

      {/* Avatar + Phone (readonly) */}
      <div className="flex items-center gap-4 pb-5 mb-5 border-b border-slate-100">
        <div className="relative">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-rose-400 via-pink-500 to-orange-400
                       text-white flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md shadow-rose-200/60"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.uName} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              initials
            )}
            {avatarMutation.isPending && (
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/gif"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarMutation.isPending}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-slate-200
                       text-slate-600 hover:text-rose-600 hover:border-rose-300 flex items-center justify-center
                       transition-colors shadow-sm disabled:opacity-50"
            title="Đổi ảnh đại diện"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {form.uName || profile?.uName || 'Học viên'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            <span className="font-medium">SĐT:</span> {profile?.uPhone || '—'}
            <span className="ml-1 text-slate-400">(không thể đổi)</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">JPG/PNG/GIF, tối đa 2MB</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-9 bg-slate-100 rounded-lg" />
          <div className="h-9 bg-slate-100 rounded-lg" />
          <div className="h-9 bg-slate-100 rounded-lg" />
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate();
          }}
        >
          {/* Name */}
          <div>
            <label htmlFor="uName" className={labelBase}>Họ và tên</label>
            <input
              id="uName"
              type="text"
              className={inputBase}
              placeholder="Nhập họ và tên"
              value={form.uName}
              onChange={(e) => setForm((f) => ({ ...f, uName: e.target.value }))}
              maxLength={150}
              required
            />
          </div>

          {/* Gender + DoB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="uGender" className={labelBase}>Giới tính</label>
              <select
                id="uGender"
                className={inputBase}
                value={form.uGender}
                onChange={(e) => setForm((f) => ({ ...f, uGender: Number(e.target.value) as 0 | 1 }))}
              >
                <option value={1}>Nam</option>
                <option value={0}>Nữ</option>
              </select>
            </div>
            <div>
              <label htmlFor="uDoB" className={labelBase}>Ngày sinh</label>
              <input
                id="uDoB"
                type="date"
                className={inputBase}
                value={form.uDoB}
                onChange={(e) => setForm((f) => ({ ...f, uDoB: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="uAddress" className={labelBase}>Địa chỉ</label>
            <input
              id="uAddress"
              type="text"
              className={inputBase}
              placeholder="Tỉnh/Thành phố, Quận/Huyện..."
              value={form.uAddress}
              onChange={(e) => setForm((f) => ({ ...f, uAddress: e.target.value }))}
              maxLength={500}
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className={labelBase}>
              Giới thiệu bản thân
              <span className="ml-1 text-slate-400 font-normal">(tối đa 500 ký tự)</span>
            </label>
            <textarea
              id="bio"
              className={`${inputBase} resize-none`}
              placeholder="Vài dòng về bạn..."
              rows={3}
              maxLength={500}
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
            <p className="text-[11px] text-slate-400 mt-1 text-right">{form.bio.length}/500</p>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
                         bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98] transition-all
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? 'Đang lưu…' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      )}
        </div>
      )}
    </section>
  );
}
