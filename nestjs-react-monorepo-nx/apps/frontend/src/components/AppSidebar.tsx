import { Home, ListTodo, Table } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

const navItems = [
    { title: 'Home', url: '/', icon: Home },
    { title: 'Create Todos', url: '/todos', icon: ListTodo },
    { title: 'Todos Table', url: '/todos-table', icon: Table },
];

export function AppSidebar() {
    const location = useLocation();

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
                <span className="text-lg font-semibold">SaaS Kit</span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.url}
                                    >
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

        </Sidebar>
    );
}
