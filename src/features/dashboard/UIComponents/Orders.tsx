import { Order } from "@/app/api/account/orders/route";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useOrdersList } from "@/features/queries/useOrdersList";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";

type OrdersProps = {
  orders: Order[];
}

export default function Orders({ orders }: OrdersProps) {

  //use orders
  const {refetch, isFetching} = useOrdersList();

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<number>();

  const [logMessage, setLogMessage] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = () => {
    return isFetching || isSubmitting;
  }

  const sendNewMessage = () => {
    setIsSubmitting(true);
    fetch("/api/shop/newMessageLog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: logMessage,
        order_id: orders[index||0].id,
      }),
    }).then((res) => {
      if (res.ok) {
        refetch();
      }
      setIsSubmitting(false);
    });
  }

  const deleteMessage = (id: number) => {
    setIsSubmitting(true);
    fetch("/api/shop/deleteMessageLog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        order_id: orders[index||0].id,
      }),
    }).then((res) => {
      if (res.ok) {
        refetch();
      }
      setIsSubmitting(false);
    });
  }

  return (
    <Card style={{
        marginTop: "1rem"
    }}>

    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent style={{
        maxWidth: "1000px"
      }}>
        <DialogHeader>
          <DialogTitle>
            Details of order
          </DialogTitle>
        </DialogHeader>

        {
              isLoading() && (
                <Typography style={{
                  marginLeft: "1rem"
                }} variant="caption">
                  <CircularProgress size={20} />
                  Submitting...
                </Typography>
              )
          }

        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
        }}>
          <Box sx={{width: "40%"}}>
            <ul>
              <Typography variant="h6">Customer:</Typography>
              {
                orders[index||0]?.customer != "Unknown" ? (
                  <>
                    <li>
                      Name: <strong>{orders[index||0]?.customer.name}</strong>
                    </li>
                    <li>
                      Email: <strong>{orders[index||0]?.customer.email}</strong>
                    </li>
                    <li>
                      Phone: <strong>{orders[index||0]?.customer.phone}</strong>
                    </li>
                  </>
                )
                :
                (
                  <li>
                    Unknown
                  </li>
                )
              }

              <Typography sx={{
                marginTop: "2rem"
              }} variant="h6">Order:</Typography>

              <li>
                Payment Status: <strong>{orders[index||0]?.status}</strong>
              </li>
              <li>
                Date: <strong>{new Date(orders[index||0]?.created* 1000).toLocaleString()}</strong>
              </li>
              <li>
                Total: <strong>{orders[index||0]?.total} Kč</strong>
              </li>
            </ul>
            <Typography style={{
              marginTop: "2rem"
            }} variant="h6">Items in order:</Typography>
            <table id="table" style={{
              width: "100%"
            }}>
              <thead>
                <tr>
                  <td><strong>Name</strong></td>
                  <td><strong>Cost</strong></td>
                  <td><strong>Count</strong></td>
                  <td><strong>Cost per item</strong></td>
                </tr>
              </thead>
              {
                orders[index||0]?.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.cost} Kč</td>
                    <td>{item.quantity}x</td>
                    <td>{item.costPerItem} Kč</td>
                  </tr>
                ))
              }
            </table>
          </Box>
          <Box sx={{width: "40%"}}>
          <Tabs defaultValue="logs" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="logs">
            <table id="table" style={{
              width: "100%"
            }}>
              <thead>
                <tr>
                  <td><strong>Message</strong></td>
                  <td><strong>Date</strong></td>
                  <td><strong>Delete</strong></td>
                </tr>
              </thead>
              <tbody>
                {
                  orders[index||0]?.logs.map((log, index) => (
                    <tr key={index}>
                      <td>{log.message}</td>
                      <td>{new Date(log.date* 1000).toLocaleString()}</td>
                      <td>
                        <Button  disabled={isLoading()} onClick={()=>{
                          deleteMessage(log.id);
                        }}>Delete</Button>
                      </td>
                    </tr>
                  ))
                }
                <Box sx={{
                  mt: "2rem"
                }}>
                  <Textarea placeholder="Message" onChange={(e)=>{
                    setLogMessage(e.target.value);
                  }} />
                  <Button
                    onClick={sendNewMessage} 
                    style={{
                      marginTop: "1rem"
                    }}
                    disabled={isLoading()}
                  >
                    Send
                  </Button>
                </Box>
              </tbody>
            </table>
          </TabsContent>
          <TabsContent value="notifications">Not implemented yet</TabsContent>
        </Tabs>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>


      <CardHeader className="px-7">
        <CardTitle>Orders</CardTitle>
        <CardDescription>Recent orders from your store.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody >
          {orders.map((order, index) => (
              <TableRow style={{
                cursor: "pointer"
              }} key={index} onClick={()=>{
                setOpen(true);
                setIndex(index);
              }} className="bg-accent">
                <TableCell>
                  <div className="font-medium">
                    {
                      order.customer === "Unknown" ? "Unknown" : order.customer.name
                    }
                  </div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {
                      order.customer === "Unknown" ? "Unknown" : order.customer.email
                    }
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">Sale</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant="secondary">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {
                    new Date(order.created* 1000).toLocaleString()
                  }
                </TableCell>
                <TableCell className="text-right">{order.total} Kč</TableCell>
              </TableRow>
          ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
