import { FolderGit2, LayoutDashboard, ShieldCheck, Sparkles, UserRound } from 'lucide-react';

export const APP_ROUTES = [
  {
    id: 'dashboard',
    path: '/dashboard',
    label: 'Tổng quan',
    description: 'Tình hình tài khoản và hoạt động gần đây',
    icon: LayoutDashboard,
  },
  {
    id: 'projects',
    path: '/projects',
    label: 'Dự án',
    description: 'Những dự án tiêu biểu bạn muốn giới thiệu',
    icon: FolderGit2,
  },
  {
    id: 'skills',
    path: '/skills',
    label: 'Kỹ năng',
    description: 'Kỹ năng của bạn theo từng danh mục',
    icon: Sparkles,
  },
  {
    id: 'profile',
    path: '/profile',
    label: 'Hồ sơ',
    description: 'Thông tin hiển thị của bạn',
    icon: UserRound,
  },
  {
    id: 'security',
    path: '/security',
    label: 'Bảo mật',
    description: 'Mật khẩu, phiên đăng nhập và tài khoản',
    icon: ShieldCheck,
  },
];
