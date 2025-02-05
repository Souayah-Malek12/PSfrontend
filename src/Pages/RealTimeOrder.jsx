import axios from "axios";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

const RealTimeOrder = () => {
    const [orders, setOrders] = useState([]);
    const [acquiredOrds, setAcquiredOrd] = useState([]);
    const [bidVal, setBidVal] = useState("")
    const [OrdId ,setOrdId] = useState("")
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
                
                const res = await axios.get(`${import.meta.env.VITE_APP_API}/api/order/NearbyOrds`,
                    { params: { coordinates: JSON.stringify(coordinates) },
                        headers: {
                            authorization: token }
                    } , 
                )
               // setOrders(res?.data?.nearestOrders)
                console.log("order",res?.data?.nearestOrders)
                if(Array.isArray(res?.data?.nearestOrders)){
                    setOrders([...res.data.nearestOrders]);
                    console.log("backend fetched orders", orders)

                } if (orders.length !== 0) {
                    console.log("No error available");
                }
                
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
            console.log("Real-time order received:", order.order);
            setOrders((prevOrders) => [...prevOrders, order.order]);

        });
        console.log("*****OrdersLIST *****:", orders);

         // Handle bid submission
    const handleBid = (ord) => {
        if (bidVal && bidVal >= ord.minVal && bidVal <= ord.maxVal) {
            const OrdBid = {
                order: ord,
                price: bidVal,
                socketId: socket.id,
            };
            console.log("Submitting bid:", OrdBid);
            socket.emit("bid", OrdBid); // Correctly emit the bid
        } else {
            alert("Please enter a valid price within the range.");
        }
    };
       const acquireOrderCall =async(OrdId)=>{
        try{
             
            const {data} = await axios.get(`${import.meta.env.VITE_APP_API}/api/worker/acquireOrd/${OrdId}`,
                {
                    headers: {
                        authorization: localStorage.getItem('token') }
                }  )
                if(data?.success){
                    console.log(data?.success)
                }
            }catch(error){
            console.log("error in calling api acquireOrderCall", error);
            
        }
       }
        useEffect(() => {
           
        
            socket.on("acquiredOrder", (minBid)=>{
                console.log("Acquired Order",minBid) 
                // acquireOrderController
                setOrdId(minBid.order._Id)
                console.log(OrdId)
                acquireOrderCall(minBid.order._Id)
                setAcquiredOrd((prevOrds)=>[...prevOrds, minBid])
                console.log("liste of acquired Orders", acquiredOrds)
            });
            console.log("My orders", acquiredOrds)

            // Cleanup the listener when the component unmounts or re-renders
            return () => {
                socket.off("acquiredOrder");
            };
        }, []); 
        // Cleanup when component unmounts      
         
   

   
    
    return (
        <div>
            {/* NEW ORDERS SECTION */}
            <div>
                <h1>NEW Orders</h1>
                {orders.map((ord, index) => (
                    <div key={index}>
                        <h1>{ord.details}</h1>
                        <h1>{ord.desiredTime}</h1>
                        <h1>{ord.category}</h1>
                       <h1>From: ${ord.minVal}</h1>
                        <h1>To: ${ord.maxVal}</h1> 

                        <div>
                            <label>
                                Enter your bid (between ${ord.minVal} and ${ord.maxVal}):
                            </label>
                            <input
                                type="number"
                                min={ord.minVal}
                                max={ord.maxVal}
                                onChange={(e) => setBidVal(e.target.value)}
                                placeholder="Enter a bid in the range"
                            />
                            <button
                                onClick={() => handleBid(ord)}
                                disabled={!bidVal}
                            >
                                Bid a Price
                            </button>
                        </div> 
                    </div>
                ))}
            </div>

            {/* ACQUIRED ORDER SECTION 
          
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
            </div>   */}
        </div>
    );
};

export default RealTimeOrder;