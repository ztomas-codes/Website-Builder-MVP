'use client';
import { Customer } from "@/app/api/account/customers/route";
import { Order } from "@/app/api/account/orders/route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DashboardWrapper } from "@/features/dashboard/DashboardWrapper";
import { MainContent } from "@/features/dashboard/MainContent";
import { Sidebar } from "@/features/dashboard/Sidebar";
import { useCustomersList } from "@/features/queries/useCustomersList";
import { Badge, Box } from "@mui/material";
import { useEffect, useState } from "react";
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

export default function Home()
{

    const { data, isLoading } = useCustomersList();
    const [customer, setCustomer] = useState<Customer>();
    const [open, setOpen] = useState(false);

    const [openOrder, setOpenOrder] = useState(false);
    const [session, setSession] = useState<Order>();

    const SortedCustomers =  () => {
        return data?.customers.sort((a, b) => b.spent - a.spent) || [];
    }


    return <DashboardWrapper>
        <Sidebar page="Customers"/>
        <MainContent label={"Customers"}>

        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent style={{
                maxWidth: "1000px"
            }}>
                <DialogHeader>
                <DialogTitle>
                    Details of customer
                </DialogTitle>
                </DialogHeader>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                }}>
                    <Box sx={{
                        display: "flex",
                        gap: "120px"
                    }}>
                        <Box>
                            <ul>
                                <li>
                                    Name: <strong>{customer?.name}</strong>
                                </li>
                                <li>
                                    Email: <strong>{customer?.email}</strong>
                                </li>
                                <li>
                                    Phone: <strong>{customer?.phone}</strong>
                                </li>
                                {
                                    customer?.customer_since && <li>
                                        Customer since: <strong>{new Date(customer?.customer_since * 1000).toLocaleString()}</strong>
                                    </li>
                                }
                                <li>
                                    Spent total: <strong>{customer?.spent} Kč</strong>
                                </li>
                            </ul>
                        </Box>
                        <Box>
                            <ul>
                                <li>
                                    Address: <strong>{customer?.address.line1}</strong>
                                </li>
                                <li>
                                    City: <strong>{customer?.address.city}</strong>
                                </li>
                                <li>
                                    Country: <strong>{customer?.address.country}</strong>
                                </li>
                                <li>
                                    Postal code: <strong>{customer?.address.postal_code}</strong>
                                </li>
                            </ul>
                        </Box>
                    </Box>
                    <Box sx={{
                        width: "100%",
                        maxHeight: "500px",
                        height: "500px",
                        overflow: "auto",
                        mt: "1rem"
                    }}>
                        <table id="table" style={{
                            width: "100%",
                        }}>
                            <tr>
                                <td>
                                    Spent
                                </td>
                                <td>
                                    Status
                                </td>
                                <td>
                                    Date
                                </td>
                                <td>
                                    Details
                                </td>
                            </tr>
                            {
                                customer?.sessions.map((session, index) => (
                                    <tr key={index}>
                                        <td>
                                            {session.total} Kč
                                        </td>
                                        <td>
                                            {session.status}
                                        </td>
                                        <td>
                                            {new Date(session.created * 1000).toLocaleString()}
                                        </td>
                                        <td>
                                            <Button onClick={()=>{
                                                setSession(session);
                                                setOpenOrder(true);
                                            }}>
                                                Show details
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <td>
                                    Average order price
                                </td>
                                {
                                    customer?.spent && customer?.sessions.length && <td>
                                        {customer?.spent / customer?.sessions.length} Kč
                                    </td>
                                }
                            </tr>
                            <tr>
                                <td>
                                    Order count
                                </td>
                                <td>
                                    {customer?.sessions.length}
                                </td>
                            </tr>
                        </table>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>

        <Dialog open={openOrder} onOpenChange={setOpenOrder} >
            <DialogContent style={{
                maxWidth: "1000px"
            }}>
                <DialogHeader>
                <DialogTitle>
                    Details of order
                </DialogTitle>
                </DialogHeader>
                <ul>
                    <li>
                        Customer: <strong>{session?.customer.name}</strong>
                    </li>
                    <li>
                        Email: <strong>{session?.customer.email}</strong>
                    </li>
                    <li>
                        Phone: <strong>{session?.customer.phone}</strong>
                    </li>
                    <li>
                        Payment Status: <strong>{session?.status}</strong>
                    </li>
                    <li>
                        Total: <strong>{session?.total} Kč</strong>
                    </li>
                    {
                        session?.created&& <li>
                            Date: <strong>{new Date(session?.created * 1000).toLocaleString()}</strong>
                        </li>
                    }
                    <li>
                        Currency: <strong>{session?.currency}</strong>
                    </li>
                </ul>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                }}>
                    <Box sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10%"
                    }}>

                        {session?.logs.length != 0 && <table id="table" style={{
                            width: "100%",
                        }}>
                            <tr>
                                <td>
                                    Log message
                                </td>
                                <td>
                                    Date
                                </td> 
                            </tr>
                            {
                                session?.logs.map((log, index) => (
                                    <tr key={index}>
                                        <td>
                                            {log.message}
                                        </td>
                                        <td>
                                            {new Date(log.date).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            }
                        </table>}

                        <table id="table" style={{
                            width: "100%",
                        }}>
                            <tr>
                                <td>
                                    Name
                                </td>
                                <td>
                                    Cost
                                </td>
                                <td>
                                    Quantity
                                </td>
                            </tr>
                            {
                                session?.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            {item.name}
                                        </td>
                                        <td>
                                            {item.cost} Kč
                                        </td>
                                        <td>
                                            {item.quantity}
                                        </td>
                                    </tr>
                                ))
                            }
                        </table>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>



        <Card style={{
            marginTop: "1rem"
        }}>
        <CardHeader className="px-7">
        <CardTitle>Customers list</CardTitle>
        <CardDescription>Recent orders from your store.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Orders</TableHead>
                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Customer Since</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {SortedCustomers().map((customer, index) => (
              <TableRow onClick={()=>{
                setCustomer(customer);
                setOpen(true);
              }} style={{
                cursor: "pointer"
              }} key={index} className="bg-accent">
                <TableCell>
                  <div className="font-medium">
                    {
                      customer.name
                    }
                  </div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {
                      customer.email
                    }
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                    {
                        customer.sessions.length
                    }
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs">
                    {customer.phone}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {
                    new Date(customer.customer_since* 1000).toLocaleString()
                  }
                </TableCell>
                <TableCell className="text-right">{customer.spent} Kč</TableCell>
              </TableRow>
          ))}
            </TableBody>
        </Table>
        </CardContent>
        </Card>


        </MainContent>
    </DashboardWrapper>

}