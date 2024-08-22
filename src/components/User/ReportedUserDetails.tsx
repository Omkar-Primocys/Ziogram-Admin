import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import useApiPost from "../../hooks/PostData";
import { Link, useNavigate } from 'react-router-dom';
import { Reported, ReportedUserDetailsRes } from '../../types/ReportedUserDetailsTypes';
import Modal from '../Reusable/Model';
import ReportDetailsUser from './ReportDetailsUser';

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
    reportCount: number;
}

// interface User {
//     report_id: number;
//     reported_by: number;
//     reported_user: number;
//     report_text: string;
//     Profile: UserProfile;
//     createdAt: string;
//     updatedAt: string;
// }


const ReportedUserList: React.FC = () => {
    // const [reportedUsers, setReportedUsers] = useState<User[]>([]);
    // const [totalPages, setTotalPages] = useState<number>(1);
    const [reportedRes, setReportedRes] = useState<ReportedUserDetailsRes>()
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { postData, } = useApiPost();
    const [updateFlag, setUpdateFlag] = useState<boolean>(false);
    const [limit, setLimit] = useState<number>(10);
    const [ReportProfileid, setReportProfileid] = useState<number>(10);
    const [ReportCount, setReportCount] = useState<number>(10);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [sortColumn, setSortColumn] = useState<string>('user_id'); // Default sorting column
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // Default sorting direction
    


    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await postData('reported-user-list', { page: currentPage, pageSize: limit });

            console.log(response);

            if (response && response.success === 'true') {

                setReportedRes(response)
                console.log(response.pagination);

                // setReportedUsers(response.isReportedUsers);
                // setTotalPages(response.pagination.pages);
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
    }, [currentPage, updateFlag, limit]);

    const handleView = (user: Reported) => {
        alert(`View user ${user.user_id}`);
    };

    const handleBlock = async (user: Reported) => {


        if (user.blocked_from_admin) {
            const result = await Swal.fire({
                icon: 'question',
                title: 'Unblock User?',
                text: `Do you really want to unblock user ${user.user_id}?`,
                showCancelButton: true,
                confirmButtonText: 'Yes, Unblock !',
                cancelButtonText: 'No, keep it',
                customClass: {
                    confirmButton: 'bg-yellow-500 text-white',
                    cancelButton: 'bg-gray-300 text-black'
                },
                padding: '2em',
            });

            if (result.isConfirmed) {
                try {
                    const response = await postData('unblock-by-admin', { user_id: user.user_id });
                    if (response.success === 'true') {
                        Swal.fire('Unblockned!', 'User has been unblockned successfully.', 'success');
                    } else {
                        Swal.fire('Error!', response.message, 'error');
                    }
                } catch (error) {
                    console.error('Error unblocking user:', error);
                    Swal.fire('Error!', 'There was a problem unblocknongthe user.', 'error');
                }
                setUpdateFlag(prev => !prev);
            }
        }
        else {
            const result = await Swal.fire({
                icon: 'question',
                title: 'Block User?',
                text: `Do you really want to block user ${user.user_id}?`,
                showCancelButton: true,
                confirmButtonText: 'Yes, Block !',
                cancelButtonText: 'No, keep it',
                customClass: {
                    confirmButton: 'bg-yellow-500 text-white',
                    cancelButton: 'bg-gray-300 text-black'
                },
                padding: '2em',
            });
            if (result.isConfirmed) {
                try {
                    const response = await postData('block-by-admin', { user_id: user.user_id });
                    if (response.success === 'true') {
                        Swal.fire('Blocked!', 'User has been blocked successfully.', 'success');
                    } else {
                        Swal.fire('Error!', response.message, 'error');
                    }
                } catch (error) {
                    console.error('Error blocking user:', error);
                    Swal.fire('Error!', 'There was a problem blockning the user.', 'error');
                }
                setUpdateFlag(prev => !prev);

            }
        }


    };

    const handleDelete = async (user: Reported) => {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Are you sure?',
            text: `Do you really want to delete user ${user.user_id}?`,
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
                const response = await postData('delete-by-admin', { user_id: user.user_id });
                if (response.success === 'true') {
                    Swal.fire('Deleted!', 'User has been deleted successfully.', 'success');
                    setUpdateFlag(prev => !prev);
                    // setReportedUsers(reportedUsers.filter(u => u.user_id !== user.user_id));
                } else {
                    Swal.fire('Error!', response.message, 'error');
                    setUpdateFlag(prev => !prev);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                Swal.fire('Error!', 'There was a problem deleting the user.', 'error');
            }

        }
    };

    const handelReportCount = (profile_id: number, report_count: number) => {
        setReportProfileid(profile_id)
        setReportCount(report_count)
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setReportProfileid(null)
        setReportCount(null)
    };
    
    
    if (loading) return <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
        <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
    </div>;
    if (error) return <p>{error}</p>;

    return (
        <div className="mt-6">
            <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
                <li>
                    <Link to="#" className="text-blue-500 hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                    <span>Reported Users</span>
                </li>
            </ul>

            <div className='mt-6 panel overflow-auto'>
                <div className="flex justify-between items-center mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Reported User List</h5>

                </div>
                <div className="my-9 mx-6 datatables">
                    <table className="mt-4   rounded-md bg-white dark:bg-gray-900 dark:text-gray-200 border-gray-800  shadow-md">
                        <thead className="bg-gray-800 border-b border-gray-900" style={{ fontWeight: 700 }}>
                            <tr >
                                <th className="text-left !py-5 font-bold " >ID</th>
                                <th className="text-left py-4 font-bold" >Full Name</th>
                                <th className="text-left py-4 font-bold">Country</th>
                                <th className="text-left py-4 font-bold">Email</th>
                                <th className="text-left py-4 font-bold">DOB</th>
                                <th className="text-left py-4 font-bold">Phone</th>
                                <th className="text-center py-4 font-bold">Report Counts</th>

                                <th className=" text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportedRes?.reportedUsers.map(user => (
                                <tr key={user.reported.user_id} className="border-b border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <td className="p-4 "><strong className='text-info'>#{user.reported.user_id}</strong></td>
                                    <td className="p-4 flex items-center">
                                        <div className='overflow-hidden'>
                                            <img src={user.reported.profile_pic} alt={`${user.reported.first_name} ${user.reported.last_name}`} className="w-9 h-9 rounded-full max-w-none" />
                                        </div>
                                        <div className='ml-2'>{user.reported.first_name}</div>
                                        <div className='ml-1'>{user.reported.last_name}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <img width="24" src={`/assets/images/flags/${user.reported.Country_flag.substring(0, 2).toUpperCase()}.svg`} className="max-w-none" alt="flag" />
                                            <div>{user.reported.Country_flag.substring(0, 2).toUpperCase()}</div>
                                        </div>
                                    </td>
                                    <td className="p-4"><a className='text-primary hover:underline' href={`mailto:${user.reported.email_id}`}>{user.reported.email_id}</a></td>
                                    <td className="p-4">{user.reported.dob.toString()}</td>
                                    <td className="p-4">{user.reported.mobile_num}</td>
                                    <td className="p-4 text-center">
                                        <button type="button" className="" onClick={() => handelReportCount(user.reported.user_id, user.reportCount)}>{user.reportCount}</button>
                                    </td>
                                    <td className="p-4">
                                        <div className='flex space-x-2 items-center justify-center '>
                                            <button type="button" className="btn btn-info" onClick={() => handleView(user.reported)}>View</button>
                                            <button type="button" className="btn btn-warning" onClick={() => handleBlock(user.reported)}>{user.reported.blocked_from_admin ? 'Unblock' : 'Block'}</button>
                                            <button type="button" className="btn btn-danger" onClick={() => handleDelete(user.reported)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex mt-4 justify-between items-center">


                        {/* Pagination Controls */}
                        <div className="flex items-center text-sm text-dark dark:text-white-light">
                            <span className='font-semibold' >
                                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, reportedRes?.pagination.total)} of {reportedRes?.pagination?.total} entries
                            </span>
                            <select
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                className="appearance-none text-dark border-gray-300 border-[1px] rounded-md dark:bg-[#191e3a] dark:text-white-light ml-2 px-4 py-0.5 focus:outline-none  "
                            >
                                {[10, 20, 50].map(option => (
                                    <option
                                        className="bg-white dark:bg-[#191e3a] dark:text-white-light text-dark p-2 hover:bg-gray-200 dark:hover:bg-[#30375e]  dark:focus:bg-[#30375e] rounded-lg"
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </option>
                                ))}
                            </select>

                        </div>


                        {/* Pagination Buttons */}
                        <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse">
                            {/* Previous Button */}
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                                >
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            </li>
                            {/* Page Number Buttons */}
                            {[...Array(reportedRes?.pagination.pages)].map((_, i) => (
                                <li key={i}>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`flex justify-center font-semibold px-3.5 py-2 rounded-full transition ${currentPage === i + 1 ? 'bg-primary text-white' : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'}`}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            {/* Next Button */}
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                                    disabled={currentPage === reportedRes?.pagination.pages}
                                    className="flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                                >
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
            {
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <ReportDetailsUser
                        report_count={ReportCount}
                        profile_id={ReportProfileid}

                    />

                </Modal>
            }
        </div>
    );
};

export default ReportedUserList;

