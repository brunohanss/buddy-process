import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  PanelLeft,
  Search,
} from "lucide-react";
import { Button } from "../ui/button";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { HeaderTabs } from "./HeaderSide";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/clerk-react";

export default function HeaderTop() {
  const location = useLocation();

  // Function to generate breadcrumb items based on URL path
  const generateBreadcrumbs = () => {
    const pathNames = location.pathname.split("/").filter((x) => x);
    return (
      <BreadcrumbList>
        {pathNames.map((value, index) => {
          const isLast = index === pathNames.length - 1;
          const to = `/${pathNames.slice(0, index + 1).join("/")}`;
  
          return isLast ? (
            <React.Fragment key={to}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbPage>{value.charAt(0).toUpperCase() + value.slice(1)}</BreadcrumbPage>
              </BreadcrumbItem>
            </React.Fragment>
          ) : (
            <React.Fragment key={to}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={to}>{value.charAt(0).toUpperCase() + value.slice(1)}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 py-2 sm:static sm:h-auto sm:border-0 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 text-lg font-semibold text-primary-foreground md:text-base"
            >
              <LazyLoadImage src="/logo.svg" width={36} height={36} alt="Logo" className="overflow-hidden" effect="blur" />
              <span className="sr-only">Home</span>
            </Link>
            {HeaderTabs.map((tab) => (
              <Link
                key={tab.url}
                to={tab.url}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                {tab.icon}
                {tab.tooltipText}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Breadcrumb */}
      <Breadcrumb className="hidden md:flex">
        {generateBreadcrumbs()}
      </Breadcrumb>

      {/* Search Bar */}
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>

      {/* Profile Dropdown */}
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            <LazyLoadImage
              src="/placeholder-user.jpg"
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
              effect="blur"
            />
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
      </DropdownMenu> */}
       <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
