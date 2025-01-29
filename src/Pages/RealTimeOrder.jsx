// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";
const socket = io("http://localhost:5001");


const RealTimeOrder = () => {
    const [orders, setOrders] = useState([])
    const [acquiredOrd, setAcquiredOrd] = useState("");

    useEffect(() => {

      
        const worker = JSON.parse(localStorage.getItem("user"));
        console.log("sendeWorker", worker)
        // Join workers room
        socket?.emit('addWorkers', worker)


        // Listen for the new order event
        socket.on("getOrder", (order) => {
            console.log("real time order", order)
            setOrders(prevOrders=>[...prevOrders, order]);
            console.log("ordTab",orders);
            
        });

   
    
        // Cleanup when component unmounts or socket is disconnected
        return () => {
            socket.off("newOrder"); // Remove the event listener when component is unmounted
            socket.off("getOrder")
            socket.off("getOrder")

        };
    }, []);
    console.log("New order received:2", orders);

    

    const handleAcquireOrder = (order) => {
        console.log("Acquiring order:", order);
        socket.emit("acquireOrder", { acquiredOrd: order });
    };

  return (
    <div>
        <h1>NEW Orders;;; </h1>
        {orders.map((ord, index)=>
        (
            <div key={index}>
                <h1 >{ord.order.details}</h1>
                <h1 >{ord.order.desiredTime}</h1>
                <h1 >{ord.order.category}</h1>
                <button onClick={()=>handleAcquireOrder(ord)}>Acquire Order</button>

            </div>

        ))}
    </div>
  )
}

export default RealTimeOrder
