import React, { createContext, useCallback, useMemo, useState } from 'react';
import * as usersApi from '../api/users';
import { logActivity } from '../api/activities';
import { clearSession, readSession, writeSession } from '../utils/session';
import { resetArrival } from '../utils/motion';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession());

  const persist = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) writeSession(nextUser);
    else clearSession();
    return nextUser;
  }, []);

  const login = useCallback(
    async (credentials) => {
      const found = await usersApi.login(credentials);
      if (!found) return null;

      resetArrival();
      persist(found);
      await logActivity({ userId: found.id, type: 'login', message: 'Đăng nhập thành công' });
      return found;
    },
    [persist]
  );

  const register = useCallback(async (payload) => {
    const created = await usersApi.register(payload);
    await logActivity({
      userId: created.id,
      type: 'register',
      message: 'Tạo tài khoản AuthStudio',
    });
    return created;
  }, []);

  const logout = useCallback(async () => {
    await logActivity({
      userId: user.id,
      type: 'logout',
      message: 'Đăng xuất khỏi thiết bị này',
    });
    persist(null);
  }, [persist, user]);

  const updateProfile = useCallback(
    async (changes) => {
      const updated = await usersApi.updateProfile(user.id, changes);
      persist(updated);
      await logActivity({ userId: user.id, type: 'profile', message: 'Cập nhật thông tin hồ sơ' });
      return updated;
    },
    [persist, user]
  );

  const changePassword = useCallback(
    async (payload) => {
      await usersApi.changePassword(user.id, payload);
      await logActivity({ userId: user.id, type: 'password', message: 'Đổi mật khẩu đăng nhập' });
    },
    [user]
  );

  const deleteAccount = useCallback(async () => {
    await usersApi.deleteAccount(user.id);
    persist(null);
  }, [persist, user]);

  const value = useMemo(
    () => ({ user, login, register, logout, updateProfile, changePassword, deleteAccount }),
    [user, login, register, logout, updateProfile, changePassword, deleteAccount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
