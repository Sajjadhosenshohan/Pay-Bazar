import { useEffect, useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const AllUserList = () => {
    const axiosPublic = useAxiosPublic();
    const [getData, setGetData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosPublic.get('/allUser');
                setGetData(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className="container p-2 mx-auto sm:p-4 text-gray-800">
                <h2 className="mb-4 text-2xl font-semibold leading-tight">All Users</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                        <colgroup>
                            <col />
                            <col />
                            <col />
                            <col />
                            <col />
                            <col className="w-24" />
                        </colgroup>
                        <thead className="bg-gray-300">
                            <tr className="text-left">
                                <th className="p-3">User ID</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Phone</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getData?.map((user) => (
                                <tr key={user._id} className="border-b border-opacity-20 border-gray-300 bg-gray-50">
                                    <td className="p-3">
                                        <p>{user?._id}</p>
                                    </td>
                                    <td className="p-3">
                                        <p>{user?.name}</p>
                                    </td>
                                    <td className="p-3">
                                        <p>{user?.phone}</p>
                                    </td>
                                    <td className="p-3">
                                        <p>{user?.email}</p>
                                    </td>
                                    <td className="p-3">
                                        <p>{user?.role}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllUserList;
