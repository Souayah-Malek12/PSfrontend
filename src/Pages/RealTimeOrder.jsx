// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";
const socket = io("http://localhost:5001");


const RealTimeOrder = () => {
    const [orders, setOrders] = useState([])
    const [acquiredOrd, setAcquiredOrd] = useState("");
    const [price, setPrice] = useState("")
    
    useEffect(() => {

      
        const worker = JSON.parse(localStorage.getItem("user"));
        console.log("sendeWorker", worker)
        // Join workers room
        socket?.emit('addWorkers', worker)


        // Listen for the new order event
        

        
   
    
        // Cleanup when component unmounts or socket is disconnected
        /*return () => {
            socket.off("newOrder"); // Remove the event listener when component is unmounted
            socket.off("getOrder")
            socket.off("getOrder")

        };*/
        
    }, []);
    socket.on("getOrder", (order) => {
        console.log("real time order", order)
        setOrders(prevOrders=>[...prevOrders, order]);
        console.log("ordTab",orders);
        
    }); 
    socket?.on("acquiredorder", (minBid)=> {
        setAcquiredOrd(minBid)
        console.log("fisnish", acquiredOrd)
    })
    console.log("New order received:2", orders);

    
    
    /*const handleAcquireOrder = (order, index) => {
        console.log("Acquiring order:", order);
        // To implement ofr backend api setAcquiredOrd(order)
        socket.emit("acquireOrder", { acquiredOrd: order });
        const l1 = orders.filter((_, i) => i !== index);
        setOrders(l1)
        console.log("after filtering", l1 )
    }; */
   // <button onClick={()=>handleAcquireOrder(ord, index)}>Acquire Order</button>
   
   const handleBid = (order, price)=>{
        console.log("worker Socket", socket.id)
        const OrdBid = {order, price, socketId :socket.id}
        console.log("hdjqkhsdd",OrdBid)
        socket.emit("bid", (OrdBid))
    }

   
    
  return (
    <div>
        <h1>NEW Orders;;; </h1>
        {orders.map((ord, index)=>
        (
            <div key={index}>
                <h1 >{ord.order.details}</h1>
                <h1 >{ord.order.desiredTime}</h1>
                <h1 >{ord.order.category}</h1>
                <h1 >From :{ord.order.minVal}$</h1>
                <h1 >To :{ord.order.maxVal} $</h1>
                <div>
                    <label> $$$$ Enter your bet $$$$$</label>
                <input type="number" onChange={(e)=>setPrice(e.target.value)} placeholder="enter a bit in the range"/>
                <button onClick={()=>handleBid(ord, price)} >bid a price</button>

                </div>
            </div>

        ))}
    </div>
  )
}

export default RealTimeOrder
