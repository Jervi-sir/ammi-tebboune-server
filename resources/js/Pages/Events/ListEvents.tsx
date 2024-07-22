import React, { useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { MoreHorizontal } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination";
import { Inertia } from "@inertiajs/inertia";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/Components/ui/alert-dialog";

import { Head } from "@inertiajs/react";

export default function ListEvents({ events, pagination,  }) {
  const [eventToDelete, setEventToDelete] = useState(null);

  const handlePageChange = (url) => {
    if (url) {
      Inertia.visit(url, {
        data: {  },
      });
    }
  };


  const handleDelete = () => {
    if (eventToDelete) {
      Inertia.delete(route("event.destroy", { id: eventToDelete.id }));
      setEventToDelete(null);
    }
  };

  const renderPaginationLinks = () => {
    const pageNumbers = [];
    for (let i = 1; i <= pagination.lastPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.map((number) => (
      <PaginationItem key={number}>
        <PaginationLink
          href="#"
          className={number === pagination.currentPage ? "bg-blue-400 text-white" : ""}
          onClick={(e) => {
            e.preventDefault();
            handlePageChange("/events?page=" + number);
          }}
        >
          {number}
        </PaginationLink>
      </PaginationItem>
    ));
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col gap-4">
        <Head title="List events" />
        <div className="flex justify-between items-center p-4">
          <h2 className="text-2xl font-bold">List Events</h2>
          <div className="flex items-center gap-4">
            <Button onClick={() => Inertia.visit(route("event.showEditor"))}>Create New Event</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>event_date</TableHead>
              <TableHead className="hidden md:table-cell">location</TableHead>
              <TableHead className="hidden md:table-cell">nb views</TableHead>
              <TableHead className="hidden md:table-cell">published date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event, index) => (
              <TableRow key={index}>
                <TableCell className="hidden sm:table-cell">
                  <img
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={event.thumbnail}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{event.title}</span>
                    <span className="font-normal opacity-80">{event.summary && event.summary.slice(0, 20)}...</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{ event.event_date }</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col">
                    <span>{event.location}</span>
                    <span className="font-normal opacity-80">{event.wilaya}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{event.nb_views}</TableCell>
                <TableCell className="hidden md:table-cell">{event.created_at}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => Inertia.visit(route("event.showEvent", { id: event.id }))}
                        className="cursor-pointer"
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => Inertia.visit(route("event.edit", { id: event.id }))}
                        className="cursor-pointer"
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setEventToDelete(event)}
                        className="cursor-pointer"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pagination.previousPageUrl);
                }}
                disabled={!pagination.previousPageUrl}
              />
            </PaginationItem>
            {renderPaginationLinks()}
            {pagination.lastPage > pagination.currentPage + 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pagination.nextPageUrl);
                }}
                disabled={!pagination.nextPageUrl}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <AlertDialog open={!!eventToDelete} onOpenChange={setEventToDelete}>
          <AlertDialogTrigger asChild>
            <Button className="hidden">Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the event and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setEventToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
