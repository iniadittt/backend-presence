import { Role } from "@prisma/client";

export interface RegisterBody {
    email: string;
    password: string;
    name: string;
    phone: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

export interface VerifyBody {
    email: string;
    otp: string;
}

export interface UpdateProfileBody {
    name?: string;
    phone?: string;
}

export interface updatePasswordBody {
    passwordLama: string;
    passwordBaru: string;
    konfirmasiPasswordBaru: string;
}

export interface AddUserBody {
    email: string;
    name: string;
    password: string;
    phone: string;
    role: Role;
}

export interface UpdateUserBody {
    name?: string;
    phone?: string;
    role?: Role;
    active?: string;
}

export interface UpdatePasswordUserBody {
    password: string;
    konfirmasiPassword: string;
}