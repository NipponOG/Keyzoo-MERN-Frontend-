import AccountLayout from "@/components/AccountLayout";
import MyOrders from "@/components/MyOrders";


export default function ProfilePage() {
  
    return (

        <AccountLayout>
            {/* <h1 className="text-2xl font-bold mb-6">My Library</h1> */}

            <MyOrders/>
            
        </AccountLayout>
    );
}
