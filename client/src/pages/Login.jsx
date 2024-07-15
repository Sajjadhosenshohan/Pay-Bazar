import useAxiosPublic from "../Hooks/useAxiosPublic";

const Login = () => {
    const axiosPublic = useAxiosPublic();

    const handleLogin = async (e) => {
        e.preventDefault();
        const form = e.target;
        const identifier = form.identifier.value;
        const pin = form.pin.value;

        console.log(identifier,pin)

        try {
            const { data } = await axiosPublic.get('/singleUser', {
                params: {
                    identifier,
                    pin,
                },
            });

            console.log(data);
            if (data) {
                alert("Login successful");
                // Swal.fire({
                //     position: "center",
                //     icon: "success",
                //     title: "Login successful",
                //     showConfirmButton: false,
                //     timer: 1500
                // });
            } else {
                alert("Login failed: Invalid credentials");
            }
            // form.reset();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <section className="dark:bg-gray-900">
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-gray-200 flex items-center w-full max-w-2xl p-8 mx-auto lg:px-12 lg:w-3/5">
                    <form onSubmit={handleLogin} className="w-full py-20">
                        <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                            Login
                        </h1>

                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                            Let’s get you all set up so you can verify your personal account and begin setting up your profile.
                        </p>

                        <div>
                            <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Phone/Email</label>
                                    <input name="identifier" type="text" placeholder="Email or Phone" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Pin</label>
                                    <input name="pin" type="text" placeholder="Pin number" className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                </div>
                            </div>

                            <div className="flex items-center justify-center mt-6 w-full">
                                <button type="submit" className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                    <span>Login</span>

                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;
