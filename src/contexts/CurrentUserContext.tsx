import { createContext, FC, useState, PropsWithChildren, useCallback, useEffect } from 'react';
import { FieldValues } from 'react-hook-form';
import { User, authApi } from '../utils/api/auth';

type CurrentUserContent = {
    currentUser: User | null;
    errorMessage: string | null;
    isLogin: boolean;
    signIn: (data: FieldValues) => Promise<void>;
    signUp: (data: FieldValues) => Promise<void>;
    logout: () => Promise<void>;
};

export const CurrentUserContext = createContext<CurrentUserContent>({ currentUser: null, errorMessage: null, isLogin: false, signIn: () => Promise.resolve(), signUp: () => Promise.resolve(), logout: () => Promise.resolve() });

export const CurrentUserProvider: FC<PropsWithChildren> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    const isLogin = !!currentUser;

    const signIn = useCallback(async (data: FieldValues) => {
        const { password, phone } = data;
        setErrorMessage(null);
        const res = await authApi.login({ phone, password });
        if (res.status === 'error') {
            setErrorMessage(res.errorMessage);
            setCurrentUser(null);
        } else {
            localStorage.setItem('user', JSON.stringify(res.data));
            setCurrentUser(res.data);
        }
    }, []);

    const signUp = async (data: FieldValues) => {
        const { password, phone, name } = data;
        setErrorMessage(null);
        const res = await authApi.register({ fullname: name, phone: phone.replace(/\D/g, ''), password });
        if (res.status === 'error') {
            setErrorMessage(res.errorMessage);
            setCurrentUser(null);
        } else {
            const result = await authApi.confirmRegisterPhone({ temp_data_code: res.data.temp_data_code, confirmation_code: '0000' });
            if (result.status === 'error') {
                setErrorMessage(result.errorMessage);
                setCurrentUser(null);
            } else {
                setCurrentUser(result.data);
                localStorage.setItem('user', JSON.stringify(result.data));
            }
        }
    };

    const logout = useCallback(async () => {
        setErrorMessage(null);
        if (currentUser) {
            const res = await authApi.loguOut(currentUser.auth_token);
            if (res.status === 'success') {
                setCurrentUser(null);
                localStorage.removeItem('user');
            } else {
                return;
            }
        } else {
            return;
        }
    }, [currentUser]);

    return <CurrentUserContext.Provider value={{ currentUser, errorMessage, signIn, signUp, logout, isLogin }}>{children}</CurrentUserContext.Provider>;
};
