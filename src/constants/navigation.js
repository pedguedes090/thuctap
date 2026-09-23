import { FolderGit2, LayoutDashboard, ShieldCheck, Sparkles, UserRound } from 'lucide-react';

export const APP_ROUTES = [
  {
    id: 'dashboard',
    label: 'Tổng quan',
    description: 'Tình hình tài khoản và hoạt động gần đây',
    icon: LayoutDashboard,
  },
  {
    id: 'projects',
    label: 'Dự án',
    description: 'Những dự án tiêu biểu bạn muốn giới thiệu',
    icon: FolderGit2,
  },
  {
    id: 'skills',
    label: 'Kỹ năng',
    description: 'Kỹ năng của bạn theo từng danh mục',
    icon: Sparkles,
  },
  {
    id: 'profile',
    label: 'Hồ sơ',
    description: 'Thông tin hiển thị của bạn',
    icon: UserRound,
  },
  {
    id: 'security',
    label: 'Bảo mật',
    description: 'Mật khẩu, phiên đăng nhập và tài khoản',
    icon: ShieldCheck,
  },
];

export const APP_ROUTE_IDS = APP_ROUTES.map((route) => route.id);
