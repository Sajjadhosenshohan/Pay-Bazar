import { useContext, useState } from 'react';
import { AuthContext } from '../Auth/AuthProvider';
import useAxiosPublic from '../Hooks/useAxiosPublic';

const CashInForm = () => {
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [agentPhone, setAgentPhone] = useState('');
    const [message, setMessage] = useState('');
    const axiosPublic = useAxiosPublic();

    const { user } = useContext(AuthContext);

    const handleCashIn = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosPublic.put('/cashIn', { 
                amount, 
                pin, 
                phone: user?.phone,
                name: user?.name,
                agentPhone
            });
            setMessage(response.data.message);
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Server error. Please try again later.');
            }
        }
    };

    return (
        <section className="bg-gray-900">
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-gray-200 flex items-center w-full max-w-2xl p-8 mx-auto lg:px-12 lg:w-3/5">
                    <form onSubmit={handleCashIn} className="w-full py-20">
                        <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize text-white">
                            Cash In
                        </h1>

                        <p className="mt-4 text-gray-500 text-gray-400">
                            Enter the amount you want to deposit.
                        </p>

                        <div>
                            <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm text-gray-600 text-gray-200">Your Phone</label>
                                    <input name="phone" type="text" defaultValue={user?.phone} readOnly className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-lg bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-gray-600 text-gray-200">Your Name</label>
                                    <input name="name" type="text" defaultValue={user?.name} readOnly className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-lg bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-gray-600 text-gray-200">Amount</label>
                                    <input name="amount" type="number" placeholder="Amount to deposit" value={amount} onChange={(e) => setAmount(e.target.value)} className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-gray-600 text-gray-200">PIN</label>
                                    <input name="pin" type="password" placeholder="Your PIN" value={pin} onChange={(e) => setPin(e.target.value)} className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-gray-600 text-gray-200">Agent Phone</label>
                                    <input name="agentPhone" type="text" placeholder="Agent's Phone Number" value={agentPhone} onChange={(e) => setAgentPhone(e.target.value)} className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg placeholder-gray-600 bg-gray-900 text-gray-300 border-gray-700 focus:border-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />
                                </div>
                            </div>

                            <div className="flex items-center justify-center mt-6 w-full">
                                <button type="submit" className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                    <span>Deposit Money</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {message && <p className="mt-4 text-red-500">{message}</p>}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default CashInForm;
