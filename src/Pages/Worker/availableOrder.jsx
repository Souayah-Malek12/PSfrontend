import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AvailableOrder = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [acquiring, setAcquiring] = useState(null);

    const acquireOrderCall = async (ordId) => {
        try {
            setAcquiring(ordId);
            const token = localStorage.getItem("token");
            
            const { data } = await axios.put(
                `${import.meta.env.VITE_APP_API}/api/worker/acquireOrd/${ordId}`,
                {},
                { headers: { authorization: token } }
            );

            if (data?.success) {
                console.log(data?.message);
                // Refresh orders after successful acquisition
                fetchOrders();
            } else {
                console.log(data?.message);
            }
        } catch (error) {
            console.log("Error in calling API acquireOrderCall", error.message);
        } finally {
            setAcquiring(null);
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));
            const coordinates = `[${user.coordinates.join(',')}]`; 
            
            const response = await axios.get(
                `${import.meta.env.VITE_APP_API}/api/order/NearbyOrds?coordinates=${encodeURIComponent(coordinates)}`,
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            setOrders(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Available Orders
                    </h1>
                    <p className="text-gray-600">
                        Nearby orders matching your location
                    </p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-red-800">Error fetching orders: {error.response?.data?.message || error.message}</p>
                        </div>
                        <button
                            onClick={fetchOrders}
                            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!error && orders?.nearestOrders?.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders available</h3>
                        <p className="mt-1 text-sm text-gray-500">There are no nearby orders at the moment.</p>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {orders?.nearestOrders?.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900 truncate">
                                        {order.name}
                                    </h2>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {order.details}
                                </p>
                                
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        ${order.minVal} - ${order.maxVal}
                                    </div>
                                    
                                    <div className="flex items-center text-sm text-gray-500">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(order.desiredDate).toLocaleDateString()}
                                    </div>
                                    
                                    <div className="flex items-center text-sm text-gray-500">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {new Date(order.desiredTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => acquireOrderCall(order._id)}
                                    disabled={acquiring === order._id}
                                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                                        acquiring === order._id
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                >
                                    {acquiring === order._id ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Acquiring...
                                        </span>
                                    ) : (
                                        'Acquire Order'
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AvailableOrder;