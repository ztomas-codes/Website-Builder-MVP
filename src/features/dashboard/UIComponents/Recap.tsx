import { Order } from "@/app/api/account/orders/route";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Progress } from "@/components/ui/progress"
  
  type OrdersProps = {
    orders: Order[];
  }

  export default function Recap({orders}: OrdersProps) {
    return (
      <Card style={{
        marginTop: "1rem"
    }}>
        <CardHeader className="pb-2">
          <CardDescription>All time evaluation</CardDescription>
          <CardTitle className="text-4xl">
            {orders.reduce((acc, order) => acc + order.total, 0)} Kč
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <Button onClick={()=> window.location.href = "https://dashboard.stripe.com"}>Go to Stripe </Button>
        </CardFooter>
      </Card>
    )
  }