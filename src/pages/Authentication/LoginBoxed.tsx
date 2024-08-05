import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect, useState } from 'react';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import useAPI from '../../hooks/PostData';
import Cookies from 'js-cookie';
import { setAdminDetails } from '../../store/adminSlice'; // Import the setAdminDetails action

const LoginBoxed = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('Login'));
    }, [dispatch]);

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    const [flag, setFlag] = useState(themeConfig.locale);
    const [admin_id, setEmail] = useState('');
    const [admin_password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { postData, loading } = useAPI();

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (admin_id === '') {
            setError('Email is required!');
            return;
        }
        if (admin_password === '') {
            setError('Password is required!');
            return;
        }
        try {
            const response = await postData('adminLogin', { admin_id, admin_password });
            // console.log(response);
            if (!response || response.success === false) {
                setError(response.message || 'Login failed');
                return;
                
                
            } else {
                Cookies.set('token', response.token, { expires: 30 });
                dispatch(setAdminDetails({
                    name: response.isAdmin.admin_name,
                    profilePic: response.isAdmin.profile_pic,
                    isAdmin: true,
                    adminEmail: admin_id
                }));

                console.log(response.isAdmin.profile_pic);
                
                navigate('/');
            }
        } catch (err: any) {
            console.error(err.response?.data?.message || 'An error occurred');
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="background" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="object" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="object" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="object" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="polygon" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10 flex-col text-center justify-around">
                                <img src="/public/Ziogram-logo.png" className='w-80 mx-auto mb-20' alt="Ziogram Logo" />
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to login</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="admin_id">Email</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="admin_id"
                                            type="email"
                                            placeholder="Enter Email"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            value={admin_id}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="admin_password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="admin_password"
                                            type="password"
                                            placeholder="Enter Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            value={admin_password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-gradient !mt-9 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </button>
                                {error && <p className="text-red-500">{error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginBoxed;
