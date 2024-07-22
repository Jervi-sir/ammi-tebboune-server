import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
  Bell,
  Calendar,
  CirclePlus,
  CircleUser,
  CopyPlus,
  Home,
  LineChart,
  Menu,
  Newspaper,
  Package,
  Package2,
  Users,
} from "lucide-react";

import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";

const Routes = [
  { name: 'Add Article', url: '/article/publish', icon: <CirclePlus className="h-4 w-4" /> },
  { name: 'Articles', url: '/articles', icon: <Newspaper className="h-4 w-4" /> },
  { name: null, url: null, icon: null },
  { name: 'Add Event', url: '/event/publish', icon: <CirclePlus className="h-4 w-4" /> },
  { name: 'Events', url: '/events', icon: <Calendar className="h-4 w-4" /> },
];

export default function DashboardLayout({ title = "", children }) {
  const { url } = usePage();

  const isActive = (href: string) => {
    return url.includes(href);
  };

  useEffect(() => {
    console.log('url: ', url);
  }, [])

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <a href="/" className="flex items-center gap-2 font-semibold">
                <Package2 className="h-6 w-6" />
                <span className="">Ammi Teboune</span>
              </a>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {
                  Routes.map((menu, index) => (
                    menu.name !== null
                    ?
                    <a
                      key={index}
                      href={menu.url}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive(menu.url) ? 'text-primary' : 'text-muted-foreground hover:text-primary opacity-50'
                        }`}
                    >
                      {menu.icon}
                      {menu.name}
                    </a>
                    :
                    <>
                      <hr />
                    </>
                  ))
                }
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                  <a
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                    <Package2 className="h-6 w-6" />
                    <span>Ammi Teboune</span>
                  </a>
                  {
                    Routes.map((menu, index) => (
                      menu.name !== null
                      ?
                      <a
                        key={index}
                        href={menu.url}
                        className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${isActive(menu.url) ? 'text-foreground' : ' opacity-50'
                          }`}
                      >
                        {menu.icon}
                        {menu.name}
                      </a>
                      :
                      <>
                        <hr />
                      </>
                    ))
                  }
                </nav>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1"></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
            </div>
            <div
              className="flex flex-1 rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
            >
              {children}
            </div>
          </main>
        </div>
      </div>
      </>

  );
}
