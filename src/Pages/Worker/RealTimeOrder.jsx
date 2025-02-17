import axios from "axios";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from "react-router-dom"

const MapComponent = ({ coordinates }) => {
    // Default center (fallback if coordinates are not provided)
    const defaultCenter = [10.505, 34.09];
    return (
      <MapContainer
        center={coordinates || defaultCenter}
        zoom={coordinates ? 15 : 4} // Zoom in if coordinates are provided
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {coordinates && (
          <Marker position={coordinates}>
            <Popup>Selected Position</Popup>
          </Marker>
        )}
      </MapContainer>
    );
  };

  
const socket = io("http://localhost:5001");

const RealTimeOrder = () => {

    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [acquiredOrds, setAcquiredOrd] = useState([]);
    const [bidVal, setBidVal] = useState("")
    const [ordId ,setOrdId] = useState("")
    const [coordinates, setCoordinates] = useState(null)

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
        useEffect(()=>{
            socket.on("getOrder", (order) => {
                console.log("Real-time order received:", order.order);
                setOrders((prevOrders) => [...prevOrders, order.order]);
    
            });
            return () => {
                socket.off("getOrder");
            };
        },[])
        
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
       const acquireOrderCall =async(ordId)=>{
        try{
             const token = localStorage.getItem('token') 
             console.log("tokn",token)
            const {data} = await axios.put(`${import.meta.env.VITE_APP_API}/api/worker/acquireOrd/${ordId}`,
                
                    {},{headers: {
                        authorization: token } }
                  )
                if(data?.success){
                    console.log(data?.message)
                }else{
                    console.log(data?.message)

                }
            }catch(error){
            console.log("error in calling api acquireOrderCall", error.message);
            
        }
       }
        useEffect(() => {
           
        
            socket.on("acquiredOrder", (minBid)=>{
                console.log("Acquired Order",minBid) 
                // acquireOrderController
                setOrdId(minBid.order._id)
                const ordId = minBid.order._id; // Ensure this is correctly spelled

                console.log("iiiiid",minBid.order._id);                

                acquireOrderCall(ordId);
                setAcquiredOrd((prevOrds)=>[...prevOrds, minBid])
                socket.on("bidEnd", (data)=>{
                    console.log("acquired With value of ",data)
                })
                navigate('/myOrds');

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
                        <h1>textttt**{ord?.coordinates?.coordinates}**</h1>
                        {/*dispaly coordinates on map*/}
                        <div>
                            <h1>{ord?.coordinates.coordinates}</h1>
                        <MapComponent coordinates={ord?.coordinates.coordinates} />

                        </div>

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