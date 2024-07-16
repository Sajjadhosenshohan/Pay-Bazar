import { useState } from 'react';
import useAxiosPublic from "../Hooks/useAxiosPublic";

const SendMoney = () => {
    const axiosPublic = useAxiosPublic();
    const [message, setMessage] = useState("");

    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log(storedUser?.phone)

    const handleSendMoney = async (e) => {
        e.preventDefault();
        const form = e.target;
        const recipientPhone = form.recipientPhone.value;
        const amount = parseFloat(form.amount.value);

        const senderPhone = storedUser?.phone;
        const pin = form.pin.value;

        if (amount < 50) {
            setMessage("Minimum amount to send is 50 Taka.");
            return;
        }

        try {
            const { data } = await axiosPublic.post('/sendMoney', {
                recipientPhone,
                amount,
                senderPhone,
                pin
            });

            if (data.success) {
                setMessage("Money sent successfully.");
                form.reset();
            } else {
                setMessage(data.message || "Failed to send money.");
            }
        } catch (err) {
            setMessage("Server error. Please try again later.");
        }
    };

    return (
        <section className="dark:bg-gray-900">
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-gray-200 flex items-center w-full max-w-2xl p-8 mx-auto lg:px-12 lg:w-3/5">
                    <form onSubmit={handleSendMoney} className="w-full py-20">
                        <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                            Send Money
                        </h1>

                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                            Enter the recipient &apos; s details and the amount you want to send.
                        </p>

                        <div>
                            <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Recipient Phone</label>
                                    <input name="recipientPhone" type="text" placeholder="Recipient's Phone Number" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Amount</label>
                                    <input name="amount" type="number" placeholder="Amount to send" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Sender Phone</label>
                                    <input name="senderPhone" type="text" defaultValue={storedUser?.phone} placeholder="Your Phone Number" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">PIN</label>
                                    <input name="pin" type="password" placeholder="Your PIN" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                </div>
                            </div>

                            <div className="flex items-center justify-center mt-6 w-full">
                                <button type="submit" className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                    <span>Send Money</span>
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

export default SendMoney;
