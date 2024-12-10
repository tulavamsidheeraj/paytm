import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import axios from "axios"
export const Dashboard = () => {
    let balance=0
    axios.get("https://3000/api/v1/user/balance")
        .then(res=>{
            balance=res.balance
        })
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={balance} />
            <Users />
        </div>
    </div>
}