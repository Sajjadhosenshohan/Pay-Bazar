import { useContext, useEffect, useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { AuthContext } from "../../Auth/AuthProvider";

const BalanceRequest = () => {
    const axiosPublic = useAxiosPublic();
    const{user:Agent} = useContext(AuthContext)

    const agentPhone = Agent?.phone
    console.log(agentPhone)

    const [getData, setGetData] = useState([]);
    // const [error, setError] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosPublic.get('/Users');
                setGetData(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchData();
    }, []);


    const handleCashIn = async (userId) => {
        try {
            const response = await axiosPublic.put(`/CashIn`, { userId, agentPhone });
            alert(response.data);
            console.log(`my error res ${response.data}`)
        } catch (error) {
            console.error("Error processing cash-in:", error);
        }
    }
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
                                <th className="p-3">Name</th>
                                <th className="p-3">Phone</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">CashIn Request</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getData?.map((user) => (
                                <tr key={user._id} className="border-b border-opacity-20 border-gray-300 bg-gray-50">

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

                                    <td className="p-3">
                                        <p>{user?.cashIn_request}</p>
                                    </td>

                                    <td className="p-3" onClick={() => handleCashIn(user?._id)}>
                                        <button className="bg-yellow-500 rounded-md p-2">{user?.status}</button>
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

export default BalanceRequest;
