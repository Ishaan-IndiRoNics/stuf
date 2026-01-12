'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import Link from 'next/link';
import {
  LayoutGrid,
  MessageSquare,
  Scan,
  User,
  PawPrint,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const MainNav = () => {
  const pathname = usePathname();
  const menuItems = [
    { href: '/', label: 'Feed', icon: LayoutGrid },
    { href: '/breed-identifier', label: 'Identifier', icon: Scan },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            className="justify-start"
            tooltip={{ children: item.label, side: 'right' }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        {children}
      </main>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0"
              asChild
            >
              <Link href="/">
                <PawPrint className="text-primary" />
              </Link>
            </Button>
            <h1 className="text-xl font-headline font-semibold text-primary group-data-[collapsible=icon]:hidden">
              PetConnect
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:hidden">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <PawPrint className="h-6 w-6 text-primary" />
            <span className="font-headline text-lg">PetConnect</span>
          </Link>
          <SidebarTrigger />
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
