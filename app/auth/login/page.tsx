'use client'

import Toast from '@/components/toast/Toast';
import { baseUrl } from '@/urls/urls';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Page() {
    const router = useRouter()
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [isLoadingLogin, setIsLoadingLogin] = React.useState(false)

    const handleLoginELAUT = async () => {
        const userELAUT = process.env.NEXT_PUBLIC_ELAUT_USER;
        const passwordELAUT = process.env.NEXT_PUBLIC_ELAUT_PASSWORD;

        const response: AxiosResponse = await axios.post(
            `https://elaut-bppsdm.kkp.go.id/api-elaut/lemdik/login`,
            {
                email: userELAUT,
                password: passwordELAUT
            },
            { headers: { "Content-Type": "application/json" } }
        );

        Cookies.set("USR_SSN_ELAUT", response.data.t);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoadingLogin(true);

        if (!email || !password) {
            Toast.fire({
                icon: "error",
                title: "Gagal mencoba login.",
                text: "Harap lengkapi email dan password terlebih dahulu sebelum login!",
            });
            setIsLoadingLogin(false);
            return;
        }

        try {
            const response: AxiosResponse = await axios.post(
                `${baseUrl}/api/login`,
                {
                    email, password
                },
                { headers: { "Content-Type": "application/json" } }
            );

            Toast.fire({
                icon: "success",
                title: "Yeayyy!",
                text: "Berhasil login ke Command Center!",
            });

            await handleLoginELAUT()

            Cookies.set("USR_SSN", response.data.token);
            router.push('/manajerial');
        } catch (error) {
            console.error({ error })
            if (error instanceof AxiosError) {
                const errorMessage =
                    error.response?.status === 401
                        ? "Email atau password yang dimasukkan salah, harap periksa kembali!"
                        : error.response?.status === 500
                            ? "Proses login gagal dikarenakan terjadi gangguan pada server, hubungi admin pusat melalui call center!"
                            : "Periksa jaringan internetmu, sistem tidak terhubung ke internet!";
                Toast.fire({
                    icon: "error",
                    title: "Oops.",
                    text: errorMessage,
                });
            }
        } finally {
            setEmail("")
            setPassword("")
            setIsLoadingLogin(false)
        }
    };
    return (
        <section className="flex flex-col items-center justify-center ">
            <Image
                className="absolute z-0 top-0 bottom-0 left-0 right-0 w-full h-full object-cover"
                src="/landing/bg_dashboard.png"
                alt="Dashboard BPPSDM KP"
                width={0}
                height={0}
                priority
            />

            <div className="flex flex-col min-h-screen py-10 items-center justify-center w-full max-w-5xl mx-auto z-10 relative gap-3">
                <div className="flex flex-col gap-3 w-full">
                    <div className="relative w-full max-w-xl mx-auto p-8 rounded-2xl shadow-lg bg-white/10 backdrop-blur-lg border border-white/20">
                        <Image
                            className="mx-auto"
                            src="/landing/logo_command_center.png"
                            alt="Logo Command Center BPPSDM KP"
                            width={380}
                            height={380}
                            priority
                        />

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">Email</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">Password</label>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoadingLogin}
                                className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center"
                            >
                                {isLoadingLogin ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <>Login</>}
                            </button>
                            <p className="mt-6 text-center text-sm text-white/80">
                                Kembali ke halaman <a href="/" className="text-blue-200 underline">Single Window</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
