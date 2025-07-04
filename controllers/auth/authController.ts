﻿import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {UserDto} from "@/models/auth/user";
import {LoginDto} from "@/models/auth/login";
import {RegisterDto} from "@/models/auth/register";
import api from "@/controllers/api";

const API_URL = 'http://192.168.0.29:5000/api/account';

export const login = async (loginDto: LoginDto): Promise<UserDto> => {
    const res = await axios.post<UserDto>(`${API_URL}/login`, loginDto);
    const user = res.data;

    await SecureStore.setItemAsync('jwt_token', user.token);

    await SecureStore.setItemAsync('user_info', JSON.stringify({
        email: user.email,
        displayName: user.displayName
    }));

    return user;
};

export const register = async (registerDto: RegisterDto): Promise<UserDto> => {
    const res = await axios.post<UserDto>(`${API_URL}/register`, registerDto);
    const user = res.data;
    await SecureStore.setItemAsync('jwt_token', user.token);

    await SecureStore.setItemAsync('user_info', JSON.stringify({
        email: user.email,
        displayName: user.displayName
    }));

    return user;
};

export const logout = async () => {
    await SecureStore.deleteItemAsync('jwt_token');
};

export const getToken = async (): Promise<string | null> => {
    return await SecureStore.getItemAsync('jwt_token');
};
export const getCurrentUser = async (): Promise<UserDto> => {
    const res = await api.get<UserDto>('/account');
    return res.data;
};
