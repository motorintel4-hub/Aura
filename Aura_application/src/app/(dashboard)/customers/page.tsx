"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, MoreVertical, Phone, Clock, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const CUSTOMERS = [
  { id: 1, name: "Sameer Khan", type: "First-Time Buyer", heat: "Hot", color: "destructive", phone: "+91 98765 43210", last: "2h ago" },
  { id: 2, name: "Anjali Verma", type: "Urban Family", heat: "Warm", color: "primary", phone: "+91 91234 56789", last: "Yesterday" },
  { id: 3, name: "Vikram Malhotra", type: "Luxury Enthusiast", heat: "Cold", color: "muted", phone: "+91 88888 77777", last: "3 days ago" },
  { id: 4, name: "Pooja Hegde", type: "Eco-Conscious", heat: "Warm", color: "primary", phone: "+91 99900 11122", last: "4h ago" },
];

export default function CustomersPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your high-performance lead funnel.</p>
        </div>
        <Button className="bg-primary text-primary-foreground font-headline h-12 amber-glow" onClick={() => router.push("/discovery")}>
          <UserPlus className="mr-2 h-5 w-5" /> NEW CUSTOMER
        </Button>
      </header>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or VIN..."
            className="w-full bg-card border-none pl-12 h-14 rounded-xl text-lg"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {["All", "Active", "Converted", "Recent", "Follow-up"].map((filter) => (
            <Button
              key={filter}
              variant="ghost"
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "rounded-full px-6 h-10 font-bold uppercase tracking-widest text-[10px]",
                activeFilter === filter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {filter}
            </Button>
          ))}
          <Button variant="ghost" className="rounded-full h-10 px-4 bg-muted text-muted-foreground">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Customer List/Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {CUSTOMERS.map((customer) => (
          <Card
            key={customer.id}
            className="bg-card border-none hover:bg-muted/30 transition-all cursor-pointer group"
            onClick={() => router.push(`/customers/${customer.id}`)}
          >
            <CardContent className="p-4 md:p-6 flex items-center gap-4">
              <Avatar className="w-12 h-12 md:w-16 md:h-16 rounded-xl border-2 border-border group-hover:border-primary transition-colors">
                <AvatarFallback className="bg-muted text-lg font-bold">
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold truncate">{customer.name}</h3>
                  <Badge className={cn(
                    "text-[8px] uppercase font-bold",
                    customer.heat === 'Hot' ? 'bg-destructive' : customer.heat === 'Warm' ? 'bg-primary' : 'bg-muted text-muted-foreground'
                  )}>
                    {customer.heat}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Badge variant="outline" className="text-[9px] border-accent/20 text-accent">{customer.type}</Badge></span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {customer.phone}</span>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-end gap-2 pr-4">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-widest">
                  <Clock className="w-3 h-3" /> {customer.last}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
