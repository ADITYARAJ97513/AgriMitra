'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Sprout, Leaf, FlaskConical, Bug, Cloudy, AreaChart, Camera, Home, Landmark } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/crop-advisor', label: 'Crop Advisor', icon: Leaf },
  { href: '/fertilizer-soil', label: 'Fertilizer & Soil', icon: FlaskConical },
  { href: '/pest-disease', label: 'Pest & Disease', icon: Bug },
  { href: '/weather-watch', label: 'Weather Watch', icon: Cloudy },
  { href: '/market-yield', label: 'Market & Yield', icon: AreaChart },
  { href: '/disease-detection', label: 'Disease Detection', icon: Camera },
  { href: '/govt-schemes', label: 'Govt. Schemes', icon: Landmark },
];

export function Nav({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const currentPage = navItems.find(item => pathname.startsWith(item.href) && (item.href === '/' ? pathname === '/' : true)) || navItems[0];

  return (
    <SidebarProvider>
      {!isHomePage && (
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Sprout className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden font-headline">
                AgriMitraAI
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      )}
      <SidebarInset>
        {!isHomePage && (
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
              <SidebarTrigger className="md:hidden" />
              <div className="flex-1">
                  <h1 className="text-lg font-semibold md:text-2xl font-headline text-foreground">
                      {currentPage.label}
                  </h1>
              </div>
          </header>
        )}
        <main className={cn('flex-1', !isHomePage && 'p-4 sm:p-6 bg-background/50')}>
          {children}
        </main>
        {!isHomePage && (
          <footer className="text-center p-4 text-muted-foreground text-sm border-t bg-card">
            © 2024 AgriMitraAI. Built with ❤️ for the farmers of India.
          </footer>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
