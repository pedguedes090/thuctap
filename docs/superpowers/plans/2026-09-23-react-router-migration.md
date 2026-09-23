# react-router-dom Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thay router tự viết (`useHashRoute` + prop-drilling `onNavigate`) bằng `react-router-dom@7` với URL sạch, layout route + `Outlet`, guard bằng `<Navigate>`, `NavLink` cho sidebar.

**Architecture:** Router khai báo với `<BrowserRouter>` + `<Routes>`. Hai guard component (`RequireAuth`, `GuestOnly`) render `<Outlet/>` hoặc `<Navigate replace>`. `AppShell` trở thành layout route và render `<Outlet/>`. Migration chia 4 task sao cho **app luôn chạy được ở cuối mỗi task**: Task 1 dựng cây router và tạm giữ interface `onNavigate(routeId)` bằng một shim id→path bên trong `AppShell`; Task 2–4 lần lượt chuyển `Sidebar`, `Topbar`, `UserMenu` sang hook/`NavLink` của router rồi xoá shim.

**Tech Stack:** React 18.3.1, Vite 6, Tailwind 3.4, `react-router-dom@7`, json-server (mock API).

**Spec:** `docs/superpowers/specs/2026-09-23-react-router-migration-design.md`

## Global Constraints

- `react-router-dom@7` — bản hiện tại, tương thích React 18.3.1. Không dùng v6.
- Giữ nguyên `id` tiếng Anh của route; `path` cũng tiếng Anh: `/dashboard`, `/projects`, `/skills`, `/profile`, `/security`.
- Không dùng data router (`createBrowserRouter`, `loader`, `action`, `errorElement`).
- Không nested route con, không route param, không lazy loading.
- Không bản địa hoá URL.
- Không thêm test runner (vitest/jest/Testing Library).
- Không đổi logic xác thực, API, mock server, hay giao diện.
- Không sửa `src/pages/SecurityPage.jsx` (đang có thay đổi từ bên ngoài, không thuộc phạm vi).
- **Không commit.** Quy ước phiên: chỉ commit khi người dùng yêu cầu rõ. Mỗi task kết thúc bằng bước **Checkpoint** thay cho `git commit`.
- Dev server: port 3000 (`npx vite --no-open`). Mock API: port 3001 (`npm run mock`).
- Ngôn ngữ copy trong UI là tiếng Việt — không tự đổi chuỗi hiển thị.

## Verification Setup

Chạy một lần trước Task 1. Verification của mọi task dùng chung phần này.

```cmd
:: Terminal 1
npm run mock

:: Terminal 2
npx vite --no-open
```

Kiểm hai cổng đã lên:

```cmd
curl -s -o NUL -w "api:%%{http_code}\n" http://localhost:3001/users
curl -s -o NUL -w "web:%%{http_code}\n" http://localhost:3000/
```

Expected: `api:200` và `web:200`.

### Quy ước lệnh browser

Môi trường là **Windows/cmd**, không phải bash. Vì vậy:

**1. Lấy session id một lần, rồi dùng nguyên văn giá trị đó.**

```cmd
agent-browser session id --scope worktree --prefix router
```

Lệnh trên in ra một id, ví dụ `router-1a2b3c4d5e6f`. Trong mọi lệnh dưới đây, `<SESSION>` là
**giá trị thật đó** — thay vào, đừng để nguyên chữ `<SESSION>`.

**2. Chọn phần tử bằng chỉ số, không bằng chuỗi có dấu hoặc class dài.** Thứ tự mục nav trong
`Sidebar` là: `0` = dashboard, `1` = projects, `2` = skills, `3` = profile, `4` = security. Thứ tự
mục trong `UserMenu` là: `0` = hồ sơ, `1` = bảo mật, `2` = đăng xuất.

**3. Không đặt JS có dấu ngoặc kép lồng trong ngoặc kép của cmd.** Dùng `getAttribute('href')` và
selector boolean như `nav a[aria-current]` thay vì `[href="/x"]`, `[aria-current="page"]`.

**4. Điền form bằng `fill`, không tự set `.value`.** React có value-tracker nên gán `.value` trực
tiếp có thể bị nuốt mất sự kiện `input`. `agent-browser fill` đã chạy đúng trong dự án này.

**5. Click nút bằng `eval`.** Đã gặp thật: click chuột tổng hợp qua CDP có thể ngừng tác dụng sau
khi đổi viewport. Với nút bấm, dùng `eval "document.querySelector('...').click()"` cho chắc.

**6. Giữ animation bật.** headless Chrome mặc định báo `prefers-reduced-motion: reduce`; task nào
kiểm animation phải chạy `agent-browser --session <SESSION> set media light` trước.

**7. Viewport.** Desktop: `set viewport 1440 900 2`. Mobile: `set viewport 390 844 3`.

Tài khoản demo: `demo@example.com` / `password123`.

## Review Focus

Năm tình huống spec có ngụ ý nhưng không có test nào phủ, dễ cắn người dùng nhất:

1. **Deep-link `/projects` khi chưa đăng nhập** — kỳ vọng ở lại `/login`, và **không** thấy nội dung dashboard loé lên trước khi redirect.
2. **`localStorage` rỗng hoặc hỏng** (`readSession()` trả `null`) — kỳ vọng vẫn vào `/login`, không crash trắng trang.
3. **Đăng xuất rồi bấm Back** — kỳ vọng không vào lại được trang bảo vệ (nhờ `replace`).
4. **Điều hướng liên tục giữa các trang** — kỳ vọng sidebar không remount và dot-field WebGL không tạo thêm context (số context không tăng theo số lần điều hướng).
5. **Path không phải route React** (`/api/users`) — kỳ vọng dev server vẫn proxy như cũ, route `*` của React không nuốt chúng.

---

### Task 1: Dựng cây router, tạm giữ interface `onNavigate`

Task này là một khối nguyên tử: khi trang được render qua `<Route element={...}>` thì không thể
truyền prop tuỳ ý cho chúng nữa, nên không thể tách nhỏ hơn mà app vẫn chạy. Sau task này app đã
dùng URL sạch, còn `Sidebar`/`Topbar`/`UserMenu` vẫn nhận `onNavigate` như cũ nhờ shim id→path
trong `AppShell`.

**Files:**
- Modify: `package.json` (thêm dependency)
- Modify: `src/constants/navigation.js`
- Modify: `src/App.jsx` (viết lại)
- Modify: `src/components/layout/AppShell.jsx`
- Modify: `src/pages/DashboardPage.jsx`
- Modify: `src/components/auth/AuthSwitchLink.jsx`
- Modify: `src/pages/LoginPage.jsx`
- Modify: `src/pages/RegisterPage.jsx`
- Delete: `src/hooks/useHashRoute.js`

**Interfaces:**
- Consumes: `useAuth()` từ `src/hooks/useAuth.js` (đã có, trả `{ user, login, register, logout, updateProfile, changePassword, deleteAccount }`).
- Produces:
  - `APP_ROUTES: { id, path, label, description, icon }[]` — có thêm `path`, bỏ `APP_ROUTE_IDS`.
  - `<RequireAuth/>`, `<GuestOnly/>` — không nhận prop, render `<Outlet/>`.
  - `<AuthSwitchLink to question actionLabel/>` — prop `onAction` bị thay bằng `to`.
  - `AppShell` không nhận prop; tạm thời vẫn truyền `route` + `onNavigate(routeId)` xuống `Sidebar`/`Topbar`.

- [ ] **Step 1: Cài react-router-dom**

```cmd
npm install react-router-dom@7 --include=dev
node -e "console.log(require('./package.json').dependencies['react-router-dom'])"
```

Expected: in ra `^7.x.x`.

**`--include=dev` là bắt buộc trên host này.** Host đặt `npm config omit = dev` và
`NODE_ENV=production`, nên `npm install react-router-dom@7` trần sẽ prune sạch devDependencies khỏi
`node_modules` (vite, tailwindcss, json-server… biến mất) — đã xảy ra thật một lần trong lúc thực
thi, xem `Incident 1` trong ledger.

- [ ] **Step 2: Thêm `path` vào route và xoá `APP_ROUTE_IDS`**

Thay toàn bộ `src/constants/navigation.js` bằng:

```js
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
```

- [ ] **Step 3: Viết lại `src/App.jsx`**

```jsx
import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import { AuthProvider } from './context/AuthContext';
import { APP_ROUTES } from './constants/navigation';
import { useAuth } from './hooks/useAuth';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';
import RegisterPage from './pages/RegisterPage';
import SecurityPage from './pages/SecurityPage';
import SkillsPage from './pages/SkillsPage';

const ROUTE_ELEMENTS = {
  dashboard: <DashboardPage />,
  projects: <ProjectsPage />,
  skills: <SkillsPage />,
  profile: <ProfilePage />,
  security: <SecurityPage />,
};

function RequireAuth() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function GuestOnly() {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestOnly />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              {APP_ROUTES.map((route) => (
                <Route key={route.id} path={route.path} element={ROUTE_ELEMENTS[route.id]} />
              ))}
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

`/login` và `/register` **bắt buộc** nằm ngoài `RequireAuth`, nếu không sẽ thành vòng lặp redirect.

- [ ] **Step 4: Xoá `src/hooks/useHashRoute.js`**

```cmd
del src\hooks\useHashRoute.js
```

Dùng `del` chứ không `git rm` để không đụng vào git index, vì plan này không commit.

- [ ] **Step 5: Chuyển `AppShell` thành layout route (giữ shim `onNavigate`)**

Thay toàn bộ `src/components/layout/AppShell.jsx` bằng:

```jsx
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { APP_ROUTES } from '../../constants/navigation';
import { useAuth } from '../../hooks/useAuth';

export default function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const current = APP_ROUTES.find((item) => item.path === location.pathname) || APP_ROUTES[0];

  const handleNavigate = (routeId) => {
    setNavOpen(false);
    const target = APP_ROUTES.find((item) => item.id === routeId);
    if (target) navigate(target.path);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        route={current.id}
        open={navOpen}
        user={user}
        onNavigate={handleNavigate}
        onClose={() => setNavOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          route={current.id}
          user={user}
          onOpenNav={() => setNavOpen(true)}
          onNavigate={handleNavigate}
          onLogout={logout}
        />

        <main key={location.pathname} className="animate-route flex-1 px-5 py-8 sm:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
```

`handleNavigate` là shim tạm, sẽ bị xoá ở Task 4. `key={location.pathname}` là thứ làm animation
vào trang chạy lại mỗi lần đổi trang — **không được bỏ.**

- [ ] **Step 6: `DashboardPage` tự điều hướng**

Trong `src/pages/DashboardPage.jsx`:

Thêm import đầu file:

```jsx
import { useNavigate } from 'react-router-dom';
```

Đổi chữ ký và thay dòng `const { user } = useAuth();` bằng hai dòng:

```jsx
export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
```

Đổi nút cuối trang:

```jsx
          <Button
            variant="outline"
            fullWidth
            icon={PencilLine}
            className="mt-5"
            onClick={() => navigate('/profile')}
          >
            Chỉnh sửa hồ sơ
          </Button>
```

- [ ] **Step 7: `AuthSwitchLink` dùng `<Link>`**

Thay toàn bộ `src/components/auth/AuthSwitchLink.jsx` bằng:

```jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthSwitchLink({ to, question, actionLabel }) {
  return (
    <p className="text-center text-sm text-slate-700">
      {question}{' '}
      <Link
        to={to}
        className="font-bold text-indigo-700 underline decoration-indigo-200 underline-offset-4 hover:decoration-indigo-600"
      >
        {actionLabel}
      </Link>
    </p>
  );
}
```

- [ ] **Step 8: `LoginPage` bỏ prop, dùng `to`**

Trong `src/pages/LoginPage.jsx`:

```jsx
export default function LoginPage() {
```

Đổi prop `footer`:

```jsx
      footer={
        <AuthSwitchLink
          to="/register"
          question="Chưa có tài khoản?"
          actionLabel="Đăng ký ngay"
        />
      }
```

Không cần điều hướng sau khi đăng nhập — `GuestOnly` tự đẩy sang `/dashboard`.

- [ ] **Step 9: `RegisterPage` bỏ prop, dọn timeout khi unmount**

Trong `src/pages/RegisterPage.jsx`:

```jsx
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
```

```jsx
export default function RegisterPage() {
  const navigate = useNavigate();
  const redirectRef = useRef(0);
  const { register } = useAuth();
```

Thêm ngay sau cụm `useState`:

```jsx
  useEffect(() => () => window.clearTimeout(redirectRef.current), []);
```

Đổi prop `footer`:

```jsx
      footer={
        <AuthSwitchLink
          to="/login"
          question="Đã có tài khoản?"
          actionLabel="Đăng nhập"
        />
      }
```

Đổi phần sau khi đăng ký thành công:

```jsx
      limit.clear();
      setSuccessMessage('Đăng ký thành công! Đang chuyển sang màn hình đăng nhập…');
      redirectRef.current = window.setTimeout(() => navigate('/login'), 900);
```

- [ ] **Step 10: Build**

```cmd
npm run build
```

Expected: build xanh. Nếu báo `is not exported by react-router-dom` thì kiểm lại version ở Step 1.

- [ ] **Step 11: Verify deep-link + session rỗng + `/api` (Review Focus 1, 2, 5)**

```cmd
agent-browser --session <SESSION> set viewport 1440 900 2
agent-browser --session <SESSION> set media light
agent-browser --session <SESSION> open "http://localhost:3000/projects"
agent-browser --session <SESSION> wait 1500
agent-browser --session <SESSION> eval "location.pathname"
```

Expected: `"/login"` — chưa đăng nhập thì deep-link vào `/projects` bị đẩy về `/login` (Review Focus 1).

```cmd
agent-browser --session <SESSION> eval "localStorage.removeItem('authstudio.session'); location.href='/dashboard'; 'x'"
agent-browser --session <SESSION> wait 1600
agent-browser --session <SESSION> eval "({ path: location.pathname, hasForm: !!document.querySelector('input[name=identifier]') })"
```

Expected: `path: "/login"`, `hasForm: true` — không crash khi session rỗng (Review Focus 2).

Không dùng `fetch(...).then(...)` trực tiếp vì `eval` không đảm bảo chờ Promise — gán vào
`window` rồi đọc lại:

```cmd
agent-browser --session <SESSION> eval "fetch('/api/users').then(r => { window.__apiStatus = r.status; }); 'started'"
agent-browser --session <SESSION> wait 900
agent-browser --session <SESSION> eval "window.__apiStatus"
```

Expected: `200` — route `*` của React không nuốt `/api` (Review Focus 5).

```cmd
agent-browser --session <SESSION> eval "location.href='/'; 'go'"
agent-browser --session <SESSION> wait 1600
agent-browser --session <SESSION> eval "location.pathname"
```

Expected: `"/login"` — `/` khi chưa đăng nhập đi qua `/dashboard` rồi bị guard đẩy về `/login`.

- [ ] **Step 12: Verify link hash cũ vẫn vào được**

```cmd
agent-browser --session <SESSION> eval "location.href='/#/projects'; 'hash'"
agent-browser --session <SESSION> wait 1600
agent-browser --session <SESSION> eval "location.pathname"
```

Expected: `"/login"` — hash bị bỏ qua, `pathname` là `/`, rồi guard đẩy về `/login`. Bookmark cũ
không chết.

- [ ] **Step 13: Verify đăng nhập + điều hướng + F5 + Back/Forward (Review Focus 3)**

```cmd
agent-browser --session <SESSION> open "http://localhost:3000/login"
agent-browser --session <SESSION> wait 1600
agent-browser --session <SESSION> fill "input[name=identifier]" "demo@example.com"
agent-browser --session <SESSION> fill "input[name=password]" "password123"
agent-browser --session <SESSION> eval "document.querySelector('button[type=submit]').click(); 'submit'"
agent-browser --session <SESSION> wait 2500
agent-browser --session <SESSION> eval "location.pathname"
```

Expected: `"/dashboard"` — `GuestOnly` tự đẩy sau khi đăng nhập.

```cmd
agent-browser --session <SESSION> eval "document.querySelectorAll('nav button')[2].click(); 'skills'"
agent-browser --session <SESSION> wait 900
agent-browser --session <SESSION> eval "location.pathname"
```

Expected: `"/skills"`. (`nav button` vì ở task này `Sidebar` vẫn là `<button>`; Task 2 đổi sang `<a>`.)

```cmd
agent-browser --session <SESSION> reload
agent-browser --session <SESSION> wait 1900
agent-browser --session <SESSION> eval "location.pathname"
```

Expected: `"/skills"` — F5 trên deep link vẫn sống, dev server không trả 404.

```cmd
agent-browser --session <SESSION> eval "history.back(); 'back'"
agent-browser --session <SESSION> wait 1000
agent-browser --session <SESSION> eval "location.pathname"
```

Expected: `"/dashboard"` — Back chạy giữa các trang.

```cmd
agent-browser --session <SESSION> eval "history.forward(); 'fwd'"
agent-browser --session <SESSION> wait 1000
agent-browser --session <SESSION> eval "location.pathname"
```

Expected: `"/skills"` — Forward chạy.

- [ ] **Step 14: Verify luồng đăng ký chuyển sang `/login`**

Dùng email mới mỗi lần để không bị lỗi "email đã dùng".

```cmd
agent-browser --session <SESSION> eval "localStorage.removeItem('authstudio.session'); 'out'"
agent-browser --session <SESSION> eval "location.href='/register'; 'go'"
agent-browser --session <SESSION> wait 1600
agent-browser --session <SESSION> fill "input[name=name]" "Plan Check"
agent-browser --session <SESSION> fill "input[name=email]" "plancheck@example.com"
agent-browser --session <SESSION> fill "input[name=password]" "password123"
agent-browser --session <SESSION> fill "input[name=confirmPassword]" "password123"
agent-browser --session <SESSION> eval "document.querySelector('button[type=submit]').click(); 'submit'"
agent-browser --session <SESSION> wait 800
agent-browser --session <SESSION> eval "document.querySelector('[role=alert]').innerText"
```

Expected: `"Đăng ký thành công! Đang chuyển sang màn hình đăng nhập…"`.

```cmd
agent-browser --session <SESSION> wait 1800
agent-browser --session <SESSION> eval "location.pathname"
```

Expected: `"/login"` — timeout 900ms điều hướng sang `/login`.

Nếu chạy lại bước này, đổi `plancheck@example.com` thành email khác (thêm số), vì email đã tồn tại
sẽ báo lỗi 409 và không điều hướng.

- [ ] **Step 15: Checkpoint**

```cmd
npm run build
```

```cmd
grep -rn "useHashRoute" src/ || echo "clean: không còn useHashRoute"
```

Expected: build xanh, `clean: không còn useHashRoute`, và toàn bộ verify ở Step 11–14 đúng.

---

### Task 2: `Sidebar` dùng `NavLink`

**Files:**
- Modify: `src/components/layout/Sidebar.jsx`

**Interfaces:**
- Consumes: `APP_ROUTES` với `{ id, path, label, icon }`; `NavLink`, `useNavigate` từ `react-router-dom`.
- Produces: `Sidebar({ open, user, onClose })` — **không còn** `route` và `onNavigate`. `AppShell` (bản Task 1) vẫn truyền thừa hai prop này; React bỏ qua prop thừa nên không lỗi.

- [ ] **Step 1: Đổi import**

```jsx
import React from 'react';
import { X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import BrandMark from '../auth/BrandMark';
import Avatar from '../ui/Avatar';
import DotField from '../visual/DotField';
import { APP_ROUTES } from '../../constants/navigation';
```

- [ ] **Step 2: Đổi chữ ký và thêm `useNavigate`**

```jsx
export default function Sidebar({ open, user, onClose }) {
  const navigate = useNavigate();
```

- [ ] **Step 3: Đổi mục nav sang `NavLink`**

Thay toàn bộ khối `{APP_ROUTES.map(...)}` bên trong `<nav>` bằng:

```jsx
          {APP_ROUTES.map(({ id, path, label, icon: Icon }) => (
            <NavLink
              key={id}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                  isActive ? 'bg-white text-slate-950' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {label}
            </NavLink>
          ))}
```

Không cần `aria-current` thủ công — `NavLink` tự gắn `aria-current="page"` khi active.

- [ ] **Step 4: Đổi nút hồ sơ cuối sidebar**

```jsx
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/profile');
          }}
          className="mt-8 flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-white/10 p-4 text-left transition-colors hover:border-white/30"
        >
```

- [ ] **Step 5: Verify nav link + `aria-current`**

```cmd
npm run build
agent-browser --session <SESSION> set viewport 1440 900 2
agent-browser --session <SESSION> set media light
agent-browser --session <SESSION> open "http://localhost:3000/dashboard"
agent-browser --session <SESSION> wait 1800
agent-browser --session <SESSION> eval "({ anchors: document.querySelectorAll('nav a').length, active: document.querySelectorAll('nav a[aria-current]').length, activeHref: document.querySelector('nav a[aria-current]').getAttribute('href') })"
```

Expected: `anchors: 5`, `active: 1`, `activeHref: "/dashboard"` — đúng một mục active.

```cmd
agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[2].click(); 'go'"
agent-browser --session <SESSION> wait 900
agent-browser --session <SESSION> eval "({ path: location.pathname, activeHref: document.querySelector('nav a[aria-current]').getAttribute('href') })"
```

Expected: `path: "/skills"`, `activeHref: "/skills"`.

```cmd
agent-browser --session <SESSION> eval "document.querySelectorAll('aside button')[1].click(); 'profile'"
agent-browser --session <SESSION> wait 900
agent-browser --session <SESSION> eval "location.pathname"
```

Expected: `"/profile"` — nút hồ sơ ở cuối sidebar vẫn điều hướng đúng. (Index `1` vì `aside button`
gồm nút đóng điều hướng ở index `0` — nút này bị `lg:hidden` che ở desktop nhưng vẫn nằm trong DOM —
rồi tới nút hồ sơ.)

- [ ] **Step 6: Verify mobile drawer đóng sau khi chọn**

```cmd
agent-browser --session <SESSION> set viewport 390 844 3
agent-browser --session <SESSION> open "http://localhost:3000/dashboard"
agent-browser --session <SESSION> wait 1700
agent-browser --session <SESSION> eval "document.querySelector('header button').click(); 'open'"
agent-browser --session <SESSION> wait 600
agent-browser --session <SESSION> eval "getComputedStyle(document.querySelector('aside')).transform"
```

Expected: ma trận tịnh tiến `matrix(1, 0, 0, 1, 0, 0)` — drawer đã trượt vào (mở).

```cmd
agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[1].click(); 'pick'"
agent-browser --session <SESSION> wait 900
agent-browser --session <SESSION> eval "({ path: location.pathname, transform: getComputedStyle(document.querySelector('aside')).transform })"
```

Expected: `path: "/projects"` và `transform` là ma trận tịnh tiến âm trên trục X (ví dụ
`matrix(1, 0, 0, 1, -288, 0)`) — drawer đã trượt ra, tức đã đóng.

- [ ] **Step 7: Checkpoint**

```cmd
grep -n "onNavigate" src/components/layout/Sidebar.jsx || echo "clean: Sidebar không còn onNavigate"
npm run build
```

Expected: `clean: Sidebar không còn onNavigate`, build xanh, verify Step 5–6 đúng.

---

### Task 3: `Topbar` tự suy ra route hiện tại

**Files:**
- Modify: `src/components/layout/Topbar.jsx`

**Interfaces:**
- Consumes: `useLocation` từ `react-router-dom`; `APP_ROUTES` với `{ path, label, description }`.
- Produces: `Topbar({ user, onOpenNav, onLogout })` — **không còn** `route` và `onNavigate`.

- [ ] **Step 1: Đổi import, chữ ký và cách suy ra route**

Thay phần đầu `src/components/layout/Topbar.jsx` bằng:

```jsx
import React from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';
import { APP_ROUTES } from '../../constants/navigation';

export default function Topbar({ user, onOpenNav, onLogout }) {
  const { pathname } = useLocation();
  const current = APP_ROUTES.find((item) => item.path === pathname) || APP_ROUTES[0];
```

- [ ] **Step 2: Bỏ `onNavigate` khỏi `UserMenu`**

```jsx
        <UserMenu user={user} onLogout={onLogout} />
```

- [ ] **Step 3: Verify tiêu đề khớp route**

```cmd
npm run build
agent-browser --session <SESSION> set viewport 1440 900 2
agent-browser --session <SESSION> set media light
agent-browser --session <SESSION> open "http://localhost:3000/security"
agent-browser --session <SESSION> wait 1800
agent-browser --session <SESSION> eval "({ title: document.querySelector('header p').innerText, description: document.querySelectorAll('header p')[1].innerText })"
```

Expected: `title: "Bảo mật"`, `description: "Mật khẩu, phiên đăng nhập và tài khoản"`.

```cmd
agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[3].click(); 'go'"
agent-browser --session <SESSION> wait 900
agent-browser --session <SESSION> eval "({ path: location.pathname, title: document.querySelector('header p').innerText })"
```

Expected: `path: "/profile"`, `title: "Hồ sơ"` — tiêu đề cập nhật sau điều hướng.

- [ ] **Step 4: Checkpoint**

```cmd
grep -n "onNavigate" src/components/layout/Topbar.jsx || echo "clean: Topbar không còn onNavigate"
npm run build
```

Expected: `clean: Topbar không còn onNavigate`, build xanh, verify Step 3 đúng.

---

### Task 4: `UserMenu` dùng `useNavigate`, xoá shim khỏi `AppShell`

Sau task này không còn component nào dùng `onNavigate`, nên shim id→path trong `AppShell` và các
prop `route`/`onNavigate` còn lại bị xoá hết.

**Files:**
- Modify: `src/components/layout/UserMenu.jsx`
- Modify: `src/components/layout/AppShell.jsx`

**Interfaces:**
- Consumes: `useNavigate`, `useLocation`, `Outlet` từ `react-router-dom`; `useAuth()` cho `logout`.
- Produces: `UserMenu({ user, onLogout })`; `AppShell()` không nhận prop, render `<Outlet/>`.

- [ ] **Step 1: `UserMenu` dùng `useNavigate` và `path`**

Đổi phần đầu `src/components/layout/UserMenu.jsx`:

```jsx
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';

const MENU_ITEMS = [
  { path: '/profile', label: 'Hồ sơ của tôi', icon: UserRound },
  { path: '/security', label: 'Bảo mật', icon: ShieldCheck },
];

export default function UserMenu({ user, onLogout }) {
  const navigate = useNavigate();
```

- [ ] **Step 2: Đổi `handleSelect` và chỗ render menu**

```jsx
  const handleSelect = (path) => {
    setOpen(false);
    navigate(path);
  };
```

```jsx
            {MENU_ITEMS.map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(path)}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
```

- [ ] **Step 3: Xoá shim khỏi `AppShell` (trạng thái cuối)**

Thay toàn bộ `src/components/layout/AppShell.jsx` bằng:

```jsx
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../hooks/useAuth';

export default function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar open={navOpen} user={user} onClose={() => setNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} onOpenNav={() => setNavOpen(true)} onLogout={logout} />

        <main key={location.pathname} className="animate-route flex-1 px-5 py-8 sm:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
```

`key={location.pathname}` **phải giữ** — đây là thứ làm animation vào trang chạy lại mỗi lần đổi trang.

- [ ] **Step 4: Verify đã xoá hết interface cũ**

```cmd
grep -rn "onNavigate" src/ || echo "clean: hết onNavigate"
grep -rn "useHashRoute" src/ || echo "clean: hết useHashRoute"
grep -rn "APP_ROUTE_IDS" src/ || echo "clean: hết APP_ROUTE_IDS"
npm run build
```

Expected: ba dòng `clean`, build xanh.

- [ ] **Step 5: Verify menu và đăng xuất (Review Focus 3)**

```cmd
agent-browser --session <SESSION> set viewport 1440 900 2
agent-browser --session <SESSION> set media light
agent-browser --session <SESSION> open "http://localhost:3000/dashboard"
agent-browser --session <SESSION> wait 1800
agent-browser --session <SESSION> eval "document.querySelector('button[aria-haspopup=menu]').click(); 'open'"
agent-browser --session <SESSION> wait 500
agent-browser --session <SESSION> eval "document.querySelectorAll('[role=menuitem]')[1].click(); 'security'"
agent-browser --session <SESSION> wait 1000
agent-browser --session <SESSION> eval "({ path: location.pathname, menuOpen: !!document.querySelector('[role=menu]') })"
```

Expected: `path: "/security"`, `menuOpen: false` — mục thứ hai (`Bảo mật`) điều hướng và menu đóng.

```cmd
agent-browser --session <SESSION> eval "document.querySelector('button[aria-haspopup=menu]').click(); 'open'"
agent-browser --session <SESSION> wait 500
agent-browser --session <SESSION> eval "document.querySelectorAll('[role=menuitem]')[2].click(); 'logout'"
agent-browser --session <SESSION> wait 2500
agent-browser --session <SESSION> eval "location.pathname"
```

Expected: `"/login"` — đăng xuất tự đẩy về `/login`.

```cmd
agent-browser --session <SESSION> eval "history.back(); 'back'"
agent-browser --session <SESSION> wait 1200
agent-browser --session <SESSION> eval "location.pathname"
```

Expected: `"/login"` — Back **không** vào lại được trang bảo vệ (Review Focus 3).

- [ ] **Step 6: Verify sidebar không remount, không rò WebGL context (Review Focus 4)**

Đăng nhập lại trước:

```cmd
agent-browser --session <SESSION> open "http://localhost:3000/login"
agent-browser --session <SESSION> wait 1600
agent-browser --session <SESSION> fill "input[name=identifier]" "demo@example.com"
agent-browser --session <SESSION> fill "input[name=password]" "password123"
agent-browser --session <SESSION> eval "document.querySelector('button[type=submit]').click(); 'submit'"
agent-browser --session <SESSION> wait 2500
agent-browser --session <SESSION> console --clear
```

Rồi đổi trang 12 lần (6 vòng, mỗi dòng một vòng):

```cmd
agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[1].click(); 'p'" && agent-browser --session <SESSION> wait 200 && agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[4].click(); 's'" && agent-browser --session <SESSION> wait 220 && agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[0].click(); 'd'" && agent-browser --session <SESSION> wait 220
agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[1].click(); 'p'" && agent-browser --session <SESSION> wait 200 && agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[4].click(); 's'" && agent-browser --session <SESSION> wait 220 && agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[0].click(); 'd'" && agent-browser --session <SESSION> wait 220
agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[1].click(); 'p'" && agent-browser --session <SESSION> wait 200 && agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[4].click(); 's'" && agent-browser --session <SESSION> wait 220 && agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[0].click(); 'd'" && agent-browser --session <SESSION> wait 220
agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[1].click(); 'p'" && agent-browser --session <SESSION> wait 200 && agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[4].click(); 's'" && agent-browser --session <SESSION> wait 220 && agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[0].click(); 'd'" && agent-browser --session <SESSION> wait 220
agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[1].click(); 'p'" && agent-browser --session <SESSION> wait 200 && agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[4].click(); 's'" && agent-browser --session <SESSION> wait 220 && agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[0].click(); 'd'" && agent-browser --session <SESSION> wait 220
agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[1].click(); 'p'" && agent-browser --session <SESSION> wait 200 && agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[4].click(); 's'" && agent-browser --session <SESSION> wait 220 && agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[0].click(); 'd'" && agent-browser --session <SESSION> wait 220
```

```cmd
agent-browser --session <SESSION> eval "({ fields: document.querySelectorAll('.field').length, ready: [...document.querySelectorAll('.field')].map(f => f.dataset.ready || 'unset') })"
agent-browser --session <SESSION> console
```

Expected: `fields: 2` (sidebar + banner), `ready: ["true","true"]`, và console **không** có dòng
`Too many active WebGL contexts`. Số field không tăng theo số lần điều hướng (Review Focus 4).

- [ ] **Step 7: Verify animation vào trang vẫn chạy lại**

```cmd
agent-browser --session <SESSION> eval "document.querySelectorAll('nav a')[1].click(); 'go'"
agent-browser --session <SESSION> wait 300
agent-browser --session <SESSION> eval "getComputedStyle(document.querySelector('main')).animationName"
```

Expected: `"riseIn"` — animation có mặt sau mỗi lần đổi trang. Nếu là `"none"` thì `key` trên
`<main>` đã bị mất.

- [ ] **Step 8: Verify route không tồn tại**

```cmd
agent-browser --session <SESSION> eval "location.href='/khong-ton-tai'; 'go'"
agent-browser --session <SESSION> wait 1800
agent-browser --session <SESSION> eval "location.pathname"
```

Expected: `"/dashboard"` — `*` → `/` → `/dashboard`.

- [ ] **Step 9: Checkpoint cuối**

```cmd
npm run build
git status --short
```

Expected: build xanh. `git status` chỉ liệt kê file thuộc phạm vi migration, cộng
`src/pages/SecurityPage.jsx` — file đó có thay đổi **từ bên ngoài**, không thuộc plan này, không đụng vào.

---

## Ghi chú cho người thực thi

- **Đừng dọn dẹp ngoài phạm vi.** Cụ thể: không đổi class Tailwind, không đổi chuỗi tiếng Việt,
  không sửa `SecurityPage.jsx`, không refactor `AuthContext`, không thêm test runner.
- **Không commit** trừ khi người dùng yêu cầu.
- Nếu gặp hidden complexity (ví dụ phát hiện route lồng nhau thật, hoặc cần `loader`), **dừng lại
  và báo** — spec đã chốt non-goal cho những phần đó, cứ đi tiếp là đổi phạm vi.
- Deploy production cần rewrite mọi path về `index.html`. Chưa biết host nên plan không thêm file
  cấu hình. Dev không cần gì.
