import * as React from "react"
import { useContext } from "react";
import { useNavigate } from "react-router"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { QueryObserverResult, QueryObserverRefetchErrorResult } from 'react-query';
import { useDeleteApi } from "@/lib/service"

import { Button } from "@/components/ui/button"
import { Bold } from "lucide-react"
import { AuthContext } from "@/app/AuthContext";
import { usePutApi } from "@/lib/service";
import { useState, useEffect } from "react";
interface CardProps {
    order: {
        id: number,
        status: string;
        start_date: string;
        end_date: string;
        total_price: number,
        guest: number,
        image_url: string,
        // Add other properties as needed
    };
}

import { FormatToIDR } from "@/lib/utils";



const OrderCard: React.FC<CardProps> = ({ order }: any) => {

    console.log(order)
    const navigate = useNavigate();
    console.log(order.id);
    const { token } = useContext(AuthContext)
    const [buttonDisabler, setDisabler] = useState(false);

    const fromReparsed = new Date();
    const toReparsed = new Date();

    fromReparsed.setTime(Number(order.start_date))
    toReparsed.setTime(Number(order.end_date))
    
    console.log(fromReparsed.toString());
    console.log(toReparsed.toString());

    const config = {
        headers: {
            Accept: 'multipart/form-data'
        }
    }

    const { mutate } = usePutApi(`/api/orderList/status/${order.id}`, config)

    // const buttonsDisabler=()=>{
    //     if(order.status==="sussess" || order.status==="rejected" ||order.status==="cancel")
    //     {
    //         return true;
    //     }
    //     else{
    //         return false;
    //     }
    // }

    // useEffect(() => {
    //     setDisabler(buttonsDisabler());
    //   }, [order.status]);

    const handleConfirm = () => {
        mutate({ status: "sussess" });
    }
    const handleReject = () => {
        mutate({ status: "rejected" });
    }
    const handleCancel = () => {
        if (order.status == "unpaid")
            try {
                mutate({ status: "cancel" });
            }
            catch (error) {
                console.error("Error editing order status:", error);
            }
    }

    return (

        <Card className="w-full object-cover " >
            <CardHeader>
                <CardTitle className="break-words overflow-hidden whitespace-nowrap overflow-ellipsis">Order ID : {order.id}</CardTitle>
                <CardDescription >Status : {order.status}</CardDescription>
                <CardDescription>Tanggal booking : <div className="font-bold"> {fromReparsed.toString().substring(0, 15)} </div> s/d <div className="font-bold">{toReparsed.toString().substring(0, 15)}</div></CardDescription>
                <CardDescription >Amount : {FormatToIDR(order.total_price)}</CardDescription>
            </CardHeader>
            <CardContent>
                <img className="h-[172px] w-full" src={order.image_url} />
            </CardContent>
            <CardFooter className="gridcol-3 gap-2 w-full object-cover">

                {!(order.status === "sussess" || order.status === "rejected" || order.status === "cancel") && <Button className="text-sm" onClick={handleConfirm} disabled={buttonDisabler}>Confirm</Button>}
                {!(order.status === "sussess" || order.status === "rejected" || order.status === "cancel") && <Button variant="destructive" onClick={handleReject} disabled={buttonDisabler}>Reject</Button>}
                {(order.status === "unpaid") && <Button variant="destructive" onClick={handleCancel} disabled={buttonDisabler}>Cancel</Button>}

            </CardFooter>
        </Card>

    );

}

export default OrderCard;
