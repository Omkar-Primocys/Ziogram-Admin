import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import useApiPost from "../../hooks/PostData";
import { Link } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { profile } from 'console';

interface User {
    user_id: number;
    user_name: string;
    profile_pic: string;
    first_name: string;
    last_name: string;
    dob: string;
    Country_flag:string;
    combined_num:string;
    country_code : string;
    mobile_num : number;
    email_id: string;
    password: string;
    login_type: string;
    verified: boolean;
    otp: number;
    otp_verification: boolean;
    createdAt: string;
    updatedAt: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
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
                Swal.fire('Error!', 'There was a problem blocking the user.', 'error');
            }
        }
    };

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
                cancelButton: 'bg-gray-300 text-black'
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

    if (loading) return (
        <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08]">
            <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
        </div>
    );
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
                    <span>User Details</span>
                </li>
            </ul>
            <div className='panel mt-6'>
                <div className="flex justify-between items-center mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">User List</h5>
                    <div className="flex items-center space-x-2">
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
                    </div>
                </div>
                <div className="panel mt-6">
                <div className="datatables">
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="whitespace-nowrap table-hover !overflow-auto"
                        records={users}
                        columns={[
                            { accessor: 'id', title: 'ID', 
                                sortable: true, 
                                render: ({ user_id }) => (
                                    <strong className="text-info">#{user_id}</strong>
                                ),
                            },
                            {
                                accessor: 'firstName',
                                title: 'User',
                                sortable: true,
                                render: ({ first_name, last_name ,profile_pic }) => (
                                    <div className="flex items-center gap-2">
                                        <img src={profile_pic} className="w-9 h-9 rounded-full max-w-none" alt="user-profile" />
                                        <div className="font-semibold">{first_name + ' ' + last_name}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'country',
                                title: 'Country',
                                render: ({Country_flag}) => (
                                    <div className="flex items-center gap-2">
                                        <img width="24" src={`/assets/images/flags/${Country_flag.substring(0, 2).toUpperCase()}.svg`} className="max-w-none" alt="flag" />
                                        <div>{Country_flag.substring(0, 2).toUpperCase()}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'email',
                                title: 'Email',
                                sortable: true,
                                render: ({ email_id }) => (
                                    <a href={`mailto:${email_id}`} className="text-primary hover:underline">
                                        {email_id}
                                    </a>
                                ),
                            },
                            {
                                accessor: 'phone',
                                title: 'Phone',
                                render: ({country_code,mobile_num}) => (
                                        <div className='flex gap-2'>
                                            <div>{country_code}</div>
                                            <div>{mobile_num}</div>

                                        </div>
                                ),
                            },
                            // { accessor: 'phone', title: 'Phone', sortable: true },
                            // {
                            //     accessor: 'rating',
                            //     title: 'Rate',
                            //     titleClassName: '!text-center',
                            //     render: ({ id }) => (
                            //         <div className="flex items-center justify-center text-warning">
                            //             {Array.from(Array(getRandomNumber(1, 5)).keys()).map((i) => {
                            //                 return <IconStar key={i + id} className=" fill-warning" />;
                            //             })}
                            //         </div>
                            //     ),
                            // },
                            // {
                            //     accessor: 'series',
                            //     title: 'Progress',
                            //     render: ({ id }) => (
                            //         <ReactApexChart
                            //             key={id}
                            //             type="line"
                            //             series={[{ data: [21, 9, 36, 12, 44, 25, 59] }]}
                            //             // @ts-ignore
                            //             options={chart_options()}
                            //             height={30}
                            //             width={150}
                            //         />
                            //     ),
                            // },
                            // {
                            //     accessor: 'status',
                            //     title: 'Status',
                            //     render: () => <span className={`badge badge-outline-${randomStatusColor()} `}>{randomStatus()}</span>,
                            // },
                        ]}
                        // totalRecords={initialRecords.length}
                        // recordsPerPage={pageSize}
                        // page={page}
                        // onPageChange={(p) => setPage(p)}
                        // recordsPerPageOptions={PAGE_SIZES}
                        // onRecordsPerPageChange={setPageSize}
                        // sortStatus={sortStatus}
                        // onSortStatusChange={setSortStatus}
                        // minHeight={200}
                        // paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
            </div>
        </div>
    );
};

export default UserList;
