import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import useApiPost from "../../hooks/PostData";
import { Link, useNavigate } from 'react-router-dom';

interface UserProfile {
    blocked_from_admin: any;
    profile_pic: string;
    user_id: number;
    user_name: string;
    first_name: string;
    last_name: string;
    dob: string;
    email_id: string;
    mobile_num: number;
}

interface User {
    report_id: number;
    reported_by: number;
    reported_user: number;
    report_text: string;
    Profile: UserProfile;
    createdAt: string;
    updatedAt: string;
}

const ReportedUserList: React.FC = () => {
    const [reportedUsers, setReportedUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const { postData } = useApiPost();
    const [updateFlag, setUpdateFlag] = useState<boolean>(false);

    const limit = 10;

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await postData('reported-user-list', { page: currentPage, pageSize: limit });

            console.log(response);

            if (response && response.success === 'true') {
                setReportedUsers(response.isReportedUsers);
                setTotalPages(response.pagination.pages);
            } else if (response.message === 'No reported users found') {

                setError('No Reported Users')
                const result = await Swal.fire({
                    icon: 'error',
                    title: 'No Reported Users',
                    text: 'Do you want to go on Home Page',
                    // showCancelButton: true,
                    confirmButtonText: 'Okay',
                    customClass: {
                        confirmButton: 'bg-yellow-500 text-white',
                    },
                    padding: '2em',
                })

            }
            else {
                setError('Error fetching users');
            }
        } catch (err: any) {
            setError('Error fetching users');
        } finally {
            setLoading(false);
        }
    }, [currentPage, limit, postData]);
    useEffect(() => {
        fetchUsers();
    }, [currentPage,updateFlag]);

    const handleView = (user: User) => {
        alert(`View user ${user.Profile.user_id}`);
    };

    const handleBlock = async (user: User) => {


        if (user.Profile.blocked_from_admin) {
            const result = await Swal.fire({
                icon: 'question',
                title: 'Unban User?',
                text: `Do you really want to unban user ${user.Profile.user_id}?`,
                showCancelButton: true,
                confirmButtonText: 'Yes, unban !',
                cancelButtonText: 'No, keep it',
                customClass: {
                    confirmButton: 'bg-yellow-500 text-white',
                    cancelButton: 'bg-gray-300 text-black'
                },
                padding: '2em',
            });

            if (result.isConfirmed) {
                try {
                    const response = await postData('unblock-by-admin', { user_id: user.Profile.user_id });
                    if (response.success === 'true') {
                        Swal.fire('Unbanned!', 'User has been unbanned successfully.', 'success');
                    } else {
                        Swal.fire('Error!', response.message, 'error');
                    }
                } catch (error) {
                    console.error('Error unblocking user:', error);
                    Swal.fire('Error!', 'There was a problem unbannongthe user.', 'error');
                }
                setUpdateFlag(prev => !prev);
            }
        }
        else {
            const result = await Swal.fire({
                icon: 'question',
                title: 'Ban User?',
                text: `Do you really want to ban user ${user.Profile.user_id}?`,
                showCancelButton: true,
                confirmButtonText: 'Yes, ban !',
                cancelButtonText: 'No, keep it',
                customClass: {
                    confirmButton: 'bg-yellow-500 text-white',
                    cancelButton: 'bg-gray-300 text-black'
                },
                padding: '2em',
            });
            if (result.isConfirmed) {
                try {
                    const response = await postData('block-by-admin', { user_id: user.Profile.user_id });
                    if (response.success === 'true') {
                        Swal.fire('Banned!', 'User has been banned successfully.', 'success');
                    } else {
                        Swal.fire('Error!', response.message, 'error');
                    }
                } catch (error) {
                    console.error('Error blocking user:', error);
                    Swal.fire('Error!', 'There was a problem banning the user.', 'error');
                }
                setUpdateFlag(prev => !prev);

            }
        }


    };

    const handleDelete = async (user: User) => {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Are you sure?',
            text: `Do you really want to delete user ${user.Profile.user_id}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            customClass: {
                confirmButton: 'bg-red-500 text-white',
                cancelButton: 'bg-gray-300 text-black'
            },
            padding: '2em',
        });

        if (result.isConfirmed) {
            try {
                const response = await postData('delete-by-admin', { user_id: user.Profile.user_id });
                if (response.success === 'true') {
                    Swal.fire('Deleted!', 'User has been deleted successfully.', 'success');
                    setReportedUsers(reportedUsers.filter(u => u.Profile.user_id !== user.Profile.user_id));
                } else {
                    Swal.fire('Error!', response.message, 'error');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                Swal.fire('Error!', 'There was a problem deleting the user.', 'error');
            }

        }
    };

    if (loading) return <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
        <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
    </div>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-4">
            <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
                <li>
                    <Link to="#" className="text-blue-500 hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                    <span>Account Settings</span>
                </li>
            </ul>
            <div className="mt-6 overflow-x-auto">
                <table className="min-w-full rounded-md bg-white dark:bg-gray-900 dark:text-gray-200 border-gray-800  shadow-md">
                    <thead className="bg-gray-800 border-b border-gray-900">
                        <tr>
                            <th className="p-4 text-left">ID</th>
                            <th className="p-4 text-left">Profile Picture</th>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">DOB</th>
                            <th className="p-4 text-left">Phone</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportedUsers.map(user => (
                            <tr key={user.Profile.user_id} className="border-b border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
                                <td className="p-4">{user.Profile.user_id}</td>
                                <td className="p-4">
                                    <div className='relative rounded-full w-16 h-16 flex justify-center bg-gray-300 dark:bg-gray-700 overflow-hidden'>
                                        <img src={user.Profile.profile_pic} alt={`${user.Profile.first_name} ${user.Profile.last_name}`} className="inset-0 w-16 h-16 object-cover" />
                                    </div>
                                </td>
                                <td className="p-4">{user.Profile.first_name} {user.Profile.last_name}</td>
                                <td className="p-4">{user.Profile.email_id}</td>
                                <td className="p-4">{user.Profile.dob}</td>
                                <td className="p-4">{user.Profile.mobile_num}</td>
                                <td className="p-4 space-x-2 items-center m-auto">
                                    <div className='flex space-x-2 items-center m-auto'>
                                        <button type="button" className="btn btn-info" onClick={() => handleView(user)}>View</button>
                                        <button type="button" className="btn btn-warning" onClick={() => handleBlock(user)}>{user.Profile.blocked_from_admin ? 'Unban' : 'Ban'}</button>
                                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(user)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex m-auto mt-5">
                <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse m-auto">
                    <li>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                            className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                        >
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16" className="bi bi-chevron-left" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.293 9.293a1 1 0 0 0 0-1.414L8.707 5.707a1 1 0 0 0-1.414 1.414L9.586 9l-2.293 2.293a1 1 0 0 0 1.414 1.414l2.293-2.293z" />
                            </svg>
                        </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index}>
                            <button
                                type="button"
                                onClick={() => setCurrentPage(index + 1)}
                                className={`flex justify-center font-semibold px-3.5 py-2 rounded transition ${currentPage === index + 1 ? 'bg-primary text-white dark:text-white-light dark:bg-primary' : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'}`}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                            className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                        >
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16" className="bi bi-chevron-right" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.707 9.293a1 1 0 0 1 0-1.414L7.293 5.707a1 1 0 0 1 1.414 1.414L6.414 9l2.293 2.293a1 1 0 0 1-1.414 1.414l-2.293-2.293z" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ReportedUserList;

