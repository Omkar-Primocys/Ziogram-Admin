import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import useApiPost from "../../hooks/PostData";
import { Link } from 'react-router-dom';
import { DataTable } from 'mantine-datatable';

interface User {
    user_id: number;
    user_name: string;
    profile_pic: string;
    first_name: string;
    last_name: string;
    dob: string;
    Country_flag: string;
    combined_num: string;
    country_code: string;
    mobile_num: number;
    email_id: string;
    password: string;
    login_type: string;
    verified: boolean;
    otp: number;
    otp_verification: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Pagenation {
    total: number;

}
const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [pagenations, setPegenations] = useState<Pagenation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const { postData } = useApiPost();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await postData('getAllUser', { page: currentPage, limit });
            if (response && response.allUsers) {
                setUsers(response.allUsers);
                setPegenations(response.pagination)
                setTotalPages(response.pagination.pages);
            }
        } catch (err: any) {
            setError('Error fetching users');
        } finally {
            setLoading(false);
        }
    }, [currentPage, limit, postData]);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, limit]);

    const handleView = (user: User) => {
        alert(`View user ${user.user_id}`);
    };

    const handleBlock = async (user: User) => {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Block User?',
            text: `Do you really want to block user ${user.user_id}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, block it!',
            cancelButtonText: 'No, keep it',
            customClass: {
                confirmButton: 'bg-yellow-500 text-white',
                cancelButtonText: 'bg-gray-300 text-black',
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
                Swal.fire('Error!', 'There was a problem blocking the user.', 'error');
            }
        }
    };
    const createTitle = (title: string) => (
        <div className="font-bold p-2">{title}</div> // Tailwind CSS classes applied
    );
    const handleDelete = async (user: User) => {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Are you sure?',
            text: `Do you really want to delete user ${user.user_id}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            customClass: {
                confirmButton: 'bg-red-500 text-white',
                cancelButtonText: 'bg-gray-300 text-black',
            },
            padding: '2em',
        });

        if (result.isConfirmed) {
            try {
                const response = await postData('delete-by-admin', { user_id: user.user_id });
                if (response.success === 'true') {
                    Swal.fire('Deleted!', 'User has been deleted successfully.', 'success');
                    setUsers(users.filter(u => u.user_id !== user.user_id));
                } else {
                    Swal.fire('Error!', response.message, 'error');
                }
            } catch (error) {
                Swal.fire('Error!', 'There was a problem deleting the user.', 'error');
            }
        }
    };

    if (loading) return <span className="animate-spin border-[3px] border-transparent border-l-primary rounded-full w-6 h-6 inline-block align-middle m-auto mb-10"></span>
        ;
    if (error) return <div>Error occurred!</div>;
    let a = 12
    return (
        <div className="mt-6">
            <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
                <li>
                    <Link to="#" className="text-blue-500 hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                    <span>User Details</span>
                </li>
            </ul>
            <div className='panel mt-6'>
                <div className="flex justify-between items-center mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">User List</h5>
                    {/* <div className="flex items-center space-x-2">
                        <label htmlFor="limit" className="font-semibold dark:text-white-light">
                            Limit:
                        </label>
                        <select 
                            id="limit"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="w-20 px-3 py-2 border rounded-md shadow-sm text-dark dark:text-white-light bg-white-light dark:bg-dark"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div> */}
                </div>
                <div className="panel mt-6">
                    <div className="datatables">

                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover !overflow-auto "
                            records={users}
                            columns={[
                                {
                                    accessor: 'user_id',
                                    title: createTitle('ID'),
                                    // sortable: true,
                                    render: ({ user_id }) => (
                                        <strong className="text-info">#{user_id}</strong>
                                    ),
                                },
                                {
                                    accessor: 'firstName',
                                    title: createTitle('Full Name'),
                                    // sortable: true,
                                    render: ({ first_name, last_name, profile_pic }) => (
                                        <div className="flex items-center gap-2">
                                            <img src={profile_pic} className="w-9 h-9 rounded-full max-w-none" alt="user-profile" />
                                            <div className="font-semibold">{first_name + ' ' + last_name}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'user_name',
                                    title: createTitle('User Name'),
                                    render: ({ user_name }) => (
                                        <div className='flex gap-2'>
                                            <div>{user_name}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'country',
                                    title: createTitle('Country'),
                                    render: ({ Country_flag }) => (
                                        <div className="flex items-center gap-2">
                                            <img width="24" src={`/assets/images/flags/${Country_flag.substring(0, 2).toUpperCase()}.svg`} className="max-w-none" alt="flag" />
                                            <div>{Country_flag.substring(0, 2).toUpperCase()}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'email',
                                    title: createTitle('Email'),
                                    // sortable: true,
                                    render: ({ email_id }) => (
                                        <a href={`mailto:${email_id}`} className="text-primary hover:underline">
                                            {email_id}
                                        </a>
                                    ),
                                },
                                {
                                    accessor: 'phone',
                                    title: createTitle('Phone No.'),
                                    render: ({ country_code, mobile_num }) => (
                                        <div className='flex gap-2 '>
                                            <div>{country_code}</div>
                                            <div>{mobile_num}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'verified',
                                    title: createTitle('Verification Status'),
                                    render: ({ verified }) => (
                                        <div className={`flex justify-center text-[12px] ${verified ? 'text-success p-0.5 w-20 hover:bg-green-100  border-success border-[1px] rounded-lg ml-5' : 'text-danger p-0.5 w-28 ml-2 border-danger hover:bg-red-100 border-[1px] rounded-lg'}`}>
                                            <div>{verified ? 'Approved' : 'Not Verified'}</div>
                                        </div>
                                    ),
                                },
                            ]}
                            minHeight={200}

                        />

                        <div className="flex mt-4 justify-between items-center">


                            {/* Pagination Controls */}
                            <div className="flex items-center text-sm text-dark dark:text-white-light">
                                <span className='font-semibold' >
                                    Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagenations.total)} of {pagenations.total} entries
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
                                {[...Array(totalPages)].map((_, i) => (
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
                                        onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                                        disabled={currentPage === totalPages}
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
            </div>
        </div>
    );
};

export default UserList;
