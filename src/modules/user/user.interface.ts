export interface RegisterBody {
    email: string;
    password: string;
    name: string;
    phone: string
}

export interface LoginBody {
    email: string;
    password: string;
}

export interface VerifyBody {
    email: string;
    otp: string
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