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

export default function PublishArticle({ articles, pagination, categories, selectedCategory }) {
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(selectedCategory || "");

  const handlePageChange = (url) => {
    if (url) {
      Inertia.visit(url, {
        data: { category: selectedCategoryFilter },
      });
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategoryFilter(e.target.value);
    Inertia.visit('/articles', {
      data: { category: e.target.value },
    });
  };

  const handleDelete = () => {
    if (articleToDelete) {
      Inertia.delete(route("article.destroy", { id: articleToDelete.id }));
      setArticleToDelete(null);
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
            handlePageChange("/articles?page=" + number);
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
        <Head title="List Articles" />
        <div className="flex justify-between items-center p-4">
          <h2 className="text-2xl font-bold">List Articles</h2>
          <div className="flex items-center gap-4">
            <select
              value={selectedCategoryFilter}
              onChange={handleCategoryChange}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Button onClick={() => Inertia.visit(route("article.showEditor"))}>Create New Article</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">nb views</TableHead>
              <TableHead className="hidden md:table-cell">published date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article, index) => (
              <TableRow key={index}>
                <TableCell className="hidden sm:table-cell">
                  <img
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={article.thumbnail}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{article.category.name}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{article.nb_views}</TableCell>
                <TableCell className="hidden md:table-cell">{article.created_at}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <a href={route("article.showArticle", { id: article.id })}>View</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <a href={route("article.edit", { id: article.id })}>Edit</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setArticleToDelete(article)}>
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
        <AlertDialog open={!!articleToDelete} onOpenChange={setArticleToDelete}>
          <AlertDialogTrigger asChild>
            <Button className="hidden">Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the article and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setArticleToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
