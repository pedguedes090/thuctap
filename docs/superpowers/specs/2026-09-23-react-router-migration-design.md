# Spec: Chuyển sang react-router-dom

Ngày: 2026-09-23
Trạng thái: chờ review

## 1. Mục tiêu

Thay router tự viết (`useHashRoute` + prop-drilling `onNavigate(routeId)`) bằng `react-router-dom`,
dùng URL sạch không có dấu `#`, theo cách dùng phổ biến: layout route + `Outlet`, `NavLink` cho
sidebar, guard bằng `<Navigate>`.

### Tiêu chí thành công

- URL là `/dashboard`, `/projects`… (không còn `#/dashboard`).
- Không còn prop `onNavigate` ở bất kỳ component nào.
- Không còn `useHashRoute`, không còn `useEffect` điều hướng trong `App.jsx`.
- Deep-link trực tiếp vào `/projects` khi chưa đăng nhập bị đẩy về `/login`.
- Trải nghiệm hiện tại giữ nguyên: animation vào trang vẫn chạy lại mỗi lần đổi trang, sidebar
  không bị remount khi điều hướng, không có thay đổi giao diện.
- `npm run build` xanh, không có lỗi console.

### Ràng buộc

- Giữ nguyên `id` tiếng Anh của route; chỉ thêm `path`.
- Không đổi logic xác thực, API, mock server, hay bất kỳ phần giao diện nào.
- React 18.3.1 → dùng `react-router-dom@7`.
- Dự án không có test runner; kiểm thử bằng thao tác thật trên browser.

## 2. Ngoài phạm vi (non-goals)

- Không dùng data router (`createBrowserRouter`, `loader`, `action`, `errorElement`).
- Không nested route con, không route param, không lazy loading.
- Không thêm test runner (vitest/jest/Testing Library).
- Không bản địa hoá URL (giữ tiếng Anh).
- Không sửa `SecurityPage.jsx` (đang có thay đổi từ bên ngoài, không phải của tôi).

## 3. Cây route

```
/                 → <Navigate to="/dashboard" replace/>
/login            → LoginPage      (GuestOnly)
/register         → RegisterPage   (GuestOnly)
/dashboard        → DashboardPage  (RequireAuth → AppShell)
/projects         → ProjectsPage   (RequireAuth → AppShell)
/skills           → SkillsPage     (RequireAuth → AppShell)
/profile          → ProfilePage    (RequireAuth → AppShell)
/security         → SecurityPage   (RequireAuth → AppShell)
*                 → <Navigate to="/" replace/>
```

`/` khi chưa đăng nhập sẽ đi tiếp `/` → `/dashboard` → `/login` (hai lần redirect). Chấp nhận được:
guard xử lý trạng thái đăng nhập, không cần nhánh riêng.

Cấu trúc component:

```jsx
<BrowserRouter>
  <AuthProvider>
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          {APP_ROUTES.map(({ id, path }) => (
            <Route key={id} path={path} element={ROUTE_ELEMENTS[id]} />
          ))}
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AuthProvider>
</BrowserRouter>
```

`AuthProvider` phải nằm trong `BrowserRouter` và bọc `Routes`, vì cả hai guard đều gọi `useAuth()`.
`/login` và `/register` **bắt buộc** nằm ngoài `RequireAuth`, nếu không sẽ thành vòng lặp redirect.

### Hai danh sách, có chủ ý

- `APP_ROUTES` (trong `constants/navigation.js`): dữ liệu điều hướng thuần — `id`, `path`, `label`,
  `description`, `icon`. Không import page component.
- `ROUTE_ELEMENTS` (trong `App.jsx`): map `id → page component`, khai báo tường minh.

Lý do tách: `constants/navigation.js` giữ vai trò cấu hình điều hướng, không kéo theo phụ thuộc
vào tầng page. Cái giá là thêm một route mới phải sửa hai chỗ — chấp nhận để giữ ranh giới rõ ràng.

## 4. Guard

```jsx
function RequireAuth() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function GuestOnly() {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
```

- Dùng `replace` để nút Back không quay lại trang vừa bị chặn.
- Đăng xuất không cần gọi điều hướng: `user` thành `null`, `RequireAuth` tự đẩy về `/login`.
- Đăng nhập thành công không cần gọi điều hướng: `GuestOnly` tự đẩy về `/dashboard`.
- Xoá toàn bộ `useEffect` + biến `activeRoute` trong `App.jsx`.

## 5. Thay đổi theo file

### Thêm dependency

`react-router-dom@7`.

### `src/constants/navigation.js`

- Thêm `path` cho mỗi phần tử: `/dashboard`, `/projects`, `/skills`, `/profile`, `/security`.
- Giữ nguyên `id`, `label`, `description`, `icon`.
- Xoá `APP_ROUTE_IDS` (sau khi migrate chỉ `App.jsx` dùng, và `App.jsx` sẽ không cần nữa).

### `src/hooks/useHashRoute.js`

Xoá file.

### `src/App.jsx`

Viết lại theo mục 3. Bỏ `useHashRoute`, bỏ `useEffect`, bỏ `APP_ROUTE_IDS`, bỏ hai callback
`onSwitchToRegister` / `onSwitchToLogin` / `onRegistered`.

### `src/components/layout/AppShell.jsx`

- Bỏ prop `route` và `onNavigate`.
- Render `<Outlet />` thay cho `{children}`.
- Lấy `useLocation()` để giữ `key={location.pathname}` trên `<main>`, class `animate-route`
  giữ nguyên.
- `handleNavigate` bị xoá; `onClose` của drawer chỉ còn `setNavOpen(false)`.

### `src/components/layout/Sidebar.jsx`

- Bỏ prop `route`, `onNavigate`.
- Mục nav đổi từ `<button onClick>` sang `<NavLink to={route.path} onClick={onClose}>` với
  `className` dạng hàm nhận `({ isActive })`. Xoá `aria-current` thủ công — `NavLink` tự gắn
  `aria-current="page"`.
- Nút hồ sơ ở cuối sidebar dùng `useNavigate()`, giữ nguyên `<button>` và style.
- `onClose` gọi khi click mục nav để đóng drawer trên mobile (giữ hành vi hiện tại).

### `src/components/layout/Topbar.jsx`

- Bỏ prop `route`, `onNavigate`.
- Tự suy ra route hiện tại: `useLocation()` rồi khớp chính xác `APP_ROUTES` theo `path`.
- Vẫn nhận `user`, `onOpenNav`, `onLogout` (là auth, không phải routing — giữ diff tập trung).

### `src/components/layout/UserMenu.jsx`

- Bỏ prop `onNavigate`; dùng `useNavigate()`.
- `MENU_ITEMS` đổi từ `id` sang `path` (`/profile`, `/security`).
- Giữ hành vi đóng menu trước khi điều hướng.

### `src/pages/DashboardPage.jsx`

- Bỏ prop `onNavigate`; dùng `useNavigate()` cho nút "Chỉnh sửa hồ sơ" (đi tới `/profile`).

### `src/components/auth/AuthSwitchLink.jsx`

- Đổi `<a href="#" onClick={preventDefault}>` thành `<Link to>`.
- Props: bỏ `onAction`, thêm `to`.

### `src/pages/LoginPage.jsx`

- Bỏ prop `onSwitchToRegister`; dùng `<AuthSwitchLink to="/register" …/>`.
- Không thêm điều hướng sau khi đăng nhập — `GuestOnly` lo.

### `src/pages/RegisterPage.jsx`

- Bỏ prop `onSwitchToLogin`, `onRegistered`; dùng `<AuthSwitchLink to="/login" …/>`.
- `setTimeout(…, 900)` đổi thành `navigate('/login')`, và **dọn timeout khi unmount**. Timeout
  hiện tại không được dọn — lỗi nhỏ sẵn có, sửa luôn vì nằm ngay chỗ đang sửa.

## 6. Hành vi phải giữ nguyên

- **Animation vào trang.** `AppShell` hiện dùng `<main key={route} className="animate-route">`.
  `key` này là thứ làm animation chạy lại mỗi lần đổi trang. Chuyển thành
  `key={location.pathname}`. Nếu bỏ sót, animation chỉ chạy đúng một lần.
- **Sidebar không remount.** Layout route giữ `Sidebar`/`Topbar` mounted qua các lần điều hướng,
  nên dot-field WebGL ở sidebar không bị tạo lại mỗi lần đổi trang.
- **`resetArrival()` trong `login()`** giữ nguyên — nó điều khiển animation "arrival" của Dashboard.
- **Drawer mobile**: chọn mục nav thì điều hướng và đóng drawer.
- Không đổi bất kỳ class giao diện nào ngoài phần className của `NavLink`.

### Hai thay đổi hành vi nhỏ, có chủ ý

- **Mục nav đổi từ `<button>` sang `<a>`.** `NavLink` render ra thẻ `<a>`, nên các mục sidebar trở
  thành link thật: click chuột giữa / "mở tab mới" hoạt động, và screen reader đọc đúng là link
  điều hướng. Đây là cải thiện về ngữ nghĩa, không phải regression.
- **Link hash cũ vẫn vào được, nhưng MẤT route đích.** `/#/security` khi mở sẽ đọc pathname là `/`
  (hash bị bỏ qua) → `/` → `Navigate to="/dashboard"`. Nghĩa là bookmark cũ không bị 404, nhưng luôn
  hạ cánh ở `/dashboard` chứ không phải `/security`. Với người chưa đăng nhập thì mọi path đều dồn
  về `/login`. Muốn giữ đúng route đích thì phải có boot shim đọc `location.hash` — spec này KHÔNG
  làm, coi như mất phần `#` và mất route đích.
  *(Sửa ở đây sau final review: câu gốc "Bookmark cũ không chết, chỉ mất phần `#`" là SAI — nó bỏ
  qua việc route đích bị mất.)*

## 7. Triển khai

- **Dev:** không cần cấu hình. Vite tự fallback `index.html` cho deep-link (`appType: 'spa'` mặc
  định), `/api` vẫn đi qua proxy trong `vite.config.js`.
- **Production:** history mode cần rewrite mọi path về `index.html`. `vite preview` đã lo sẵn.
  Host tĩnh cần file cấu hình riêng (Netlify `_redirects`, Vercel `vercel.json`, nginx
  `try_files $uri /index.html`). Chưa biết host nên spec chỉ ghi chú; sẽ thêm file khi biết host.

## 8. Verification

Không có test runner trong dự án, nên kiểm bằng thao tác thật trên browser (dev server + mock API):

1. Deep-link `/projects` khi chưa đăng nhập → ở lại `/login`, và Back không quay về `/projects`.
2. `/` khi chưa đăng nhập → `/login`; sau khi đăng nhập → `/dashboard`.
3. Đăng nhập → tự sang `/dashboard`.
4. Bấm từng mục sidebar → URL đổi đúng, chỉ mục đang active có `aria-current="page"`.
5. F5 khi đang ở `/skills` → vẫn ở `/skills` (deep-link sống, dev server không trả 404).
6. `/khong-ton-tai` → về `/` → `/dashboard`.
7. Back/Forward giữa các trang hoạt động.
8. Đăng xuất từ menu → về `/login`, Back không vào lại trang được bảo vệ.
9. Mobile: mở drawer, chọn mục → điều hướng và drawer đóng.
10. `/register` ↔ `/login` qua link; đăng ký xong → `/login`.
11. Animation vào trang vẫn chạy lại ở **mỗi** lần đổi trang.
12. Sidebar dot-field vẫn chạy và **không** bị tạo lại mỗi lần điều hướng (kiểm `data-ready`
    không nhấp nháy, số WebGL context không tăng theo số lần điều hướng).
13. `npm run build` xanh; không lỗi console.

## 9. Rủi ro

- **Mất `key` trên `<main>`** → animation vào trang chỉ chạy một lần. Đã nêu ở mục 6, sẽ kiểm ở
  bước 11 của verification.
- **Vòng lặp redirect** nếu `/login` bị đặt trong `RequireAuth`. Đã ràng buộc ở mục 3.
- **Deep-link hỏng khi deploy** nếu thiếu rewrite. Đã nêu ở mục 7; dev không bị.
- **`NavLink` mặc định so khớp theo tiền tố** với `end` khác nhau; ở đây path phẳng nên so khớp
  chính xác là đủ, không cần `end`.

## 10. Giả định

- `/` redirect qua `/dashboard` rồi để guard quyết định (không nhánh riêng theo trạng thái).
- Route không tồn tại → về `/`.
- Giữ `id` tiếng Anh, thêm `path` tiếng Anh.
- Dùng `react-router-dom@7`.
- Không commit spec này (chỉ ghi file), theo quy ước của phiên làm việc.
