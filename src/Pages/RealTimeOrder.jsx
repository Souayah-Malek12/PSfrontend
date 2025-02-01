import axios from "axios";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

const RealTimeOrder = () => {
    const [orders, setOrders] = useState([]);
    const [acquiredOrd, setAcquiredOrd] = useState(null);
    const [bids, setBids] = useState({}); // To store bids for each order

    useEffect(() => {
        const worker = JSON.parse(localStorage.getItem("user"));

        // Join workers room
        socket.emit("addWorkers", worker);
        
        
    }, []);
            //get orders of it's category//
        const getOrders = async()=>{
            try{
                const token = localStorage.getItem('token');
                const coordinates = JSON.parse(localStorage.getItem('user'))?.coordinates;
                console.log("coordinates", coordinates)
                console.log("token", token)
                
                const res = await axios.get(`${import.meta.env.VITE_APP_API}/api/order/NearbyOrds`,
                    { params: { coordinates: JSON.stringify(coordinates) },
                        headers: {
                            authorization: token }
                    } , 
                )
               // setOrders(res?.data?.nearestOrders)
                console.log("order",res?.data?.nearestOrders)

                console.log("backend fetched orders", orders)
            }catch (err){
                console.log(err.message)
            }
        }
        //only on mount
        useEffect(()=>{
            getOrders()
        },[])
        //after orders will be listened by socket and save to back end
        // Listen for new orders
        socket.on("getOrder", (order) => {
            console.log("Real-time order received:", order);
            setOrders((prevOrders) => [...prevOrders, order]);
        });

        // Listen for acquired orders
        socket.on("acquiredorder", (minBid) => {
            setAcquiredOrd(minBid);
            console.log("Acquired order:", minBid);
        });

        // Cleanup when component unmounts
      

    // Handle bid input for each order
    const handleInputChange = (ordId, value) => {
        const newValue = parseFloat(value);
        if (!isNaN(newValue)) {
            setBids((prevBids) => ({
                ...prevBids,
                [ordId]: newValue,
            }));
        }
    };

    // Handle bid submission
    const handleBid = (ord) => {
        const bidPrice = bids[ord.id];
        if (bidPrice && bidPrice >= ord.order.minVal && bidPrice <= ord.order.maxVal) {
            const OrdBid = {
                order: ord,
                price: bidPrice,
                socketId: socket.id,
            };
            console.log("Submitting bid:", OrdBid);
            socket.emit("bid", OrdBid); // Correctly emit the bid
        } else {
            alert("Please enter a valid price within the range.");
        }
    };

    return (
        <div>
            {/* NEW ORDERS SECTION */}
            <div>
                <h1>NEW Orders</h1>
                {orders.map((ord) => (
                    <div key={ord.id || ord.order.id}>
                        <h1>{ord.order.details}</h1>
                        <h1>{ord.order.desiredTime}</h1>
                        <h1>{ord.order.category}</h1>
                        <h1>From: ${ord.order.minVal}</h1>
                        <h1>To: ${ord.order.maxVal}</h1>

                        <div>
                            <label>
                                Enter your bid (between ${ord.order.minVal} and ${ord.order.maxVal}):
                            </label>
                            <input
                                type="number"
                                min={ord.order.minVal}
                                max={ord.order.maxVal}
                                onChange={(e) => handleInputChange(ord.id, e.target.value)}
                                placeholder="Enter a bid in the range"
                            />
                            <button
                                onClick={() => handleBid(ord)}
                                disabled={!bids[ord.id]}
                            >
                                Bid a Price
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ACQUIRED ORDER SECTION */}
            <div>
                <h1>Acquired Order</h1>
                {acquiredOrd ? (
                    <div>
                        <h1>{acquiredOrd.order?.details}</h1>
                        <h1>{acquiredOrd.order?.coordinates}</h1>
                        <h1>{acquiredOrd.order?.category}</h1>
                        <h1>{acquiredOrd.order?.minVal}</h1>
                        <h1>{acquiredOrd.order?.maxVal}</h1>
                        <h1>{acquiredOrd.order?.desiredTime}</h1>
                        <h1>{acquiredOrd.order?.desiredDate}</h1>
                        <p>With Price: ${acquiredOrd.price}</p>
                    </div>
                ) : (
                    <p>No order acquired yet.</p>
                )}
            </div>
        </div>
    );
};

export default RealTimeOrder;