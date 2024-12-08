import axios from "axios";
import { useEffect, useState } from "react"

export const DashBoard = () => {
    
    const [user, setUser] = useState("");
    const [conversations, setConversations] = useState([]);
    const [users, setUsers] = useState([]);
    const [conversationId, setConvId] = useState("");
    const [messages, setMesssages] = useState([]);

    const fetchUsers = async () => {
        try {
           
            const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/conversation/users`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            if (data?.success) {
               setUsers(data?.users)
            }
        } catch (error) {
            console.log("Error while fetching conversations", error);
        }
    }

    const fetchConversations = async () => {
        try {
            const userId=user.id
            const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/conversation/conversations/${userId}`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            if (data?.success) {
                setConversations(data?.conversationsResult);
                console.log(data?.conversationsResult)
            }
        } catch (error) {
            console.log("Error while fetching conversations", error);
        }
    }
    console.log(conversationId)

    const fetchMessages = async()=>{
        try{
            if(!conversationId) return ;
            const {data} = await axios.get(`${import.meta.env.VITE_APP_API}/api/conversation/messages/${conversationId}`,{
                headers : {
                    Authorization: localStorage.getItem("token")
                }
            });
            if(data.success){
                setMesssages(data.messageUserData);
                console.log(messages)
            }
        }catch(err){
            console.log("error while fetching message", err);
        }
    }
    

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));
        fetchUsers()
    }, [])

    useEffect(() => {
        fetchConversations();
    }, [user])

    useEffect(()=>{
        fetchMessages();
    },[conversationId]);

    return (
        <div>
            <h1>*DashBoard :{user.name}*</h1>
            <div className="flex">
                <div>
                    
                    <h1>#####Liste of Conversations####</h1>
                    <div>
                    {
                        
                            conversations?.map((c) =>(
                            <div key={c.conversationId}>
                                <h1>{c?.user?.email}</h1>
                                <h1 onClick={()=>setConvId(c.conversationId)}>{c?.user?.name}</h1>
                            </div>
                            ))
                        
                    }
                    </div>
                </div>
                <div>
                    <div>
                        <h1>#######Discussion####</h1>
                        <div>
                            <h1>From:{messages?.user?.name}</h1>
                            {messages?.map((m, i)=>(
                                <div key={i}>
                                    <h2>{m.message}</h2>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <input type="text" placeholder="type message" /> <span><button className="bg-blue-500">Send Message</button></span>
                    </div>
                </div>
                <div>
                    <h1>#####Talk To Users######</h1>
                    <div>
                        {users?.map((u,i)=>(
                            <div key={i}>
                                <h1>{u.name}</h1>
                                <h1>{u.email}</h1>
                                <br />

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashBoard;
