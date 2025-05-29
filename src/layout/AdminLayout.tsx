import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDown, ChevronLeft, ChevronRight,
  Edit,
  Home, List,
  MenuIcon,
  Package,
  Percent, Phone,
  ShoppingCart, Tag, UserCircleIcon, Users
} from "lucide-react";
import { useContext, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { AuthContext, AuthContextType } from '../context/AuthContext';

// Types
interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
  roles?: string[];
}

// Utility Functions
const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

const generateNavigation = (role: string): MenuItem[] => {
  const navItems: MenuItem[] = [
    { name: 'Dashboard', href: '/admin', icon: Home, roles: ['ADMIN'] },
    {
      name: 'Brands', href: '/admin/brand', icon: Tag,
      children: [
        { name: 'List Brands', href: '/admin/brand', icon: List },
        { name: 'Add Brand', href: '/admin/brand/add', icon: Edit },
      ],
    },
    {
      name: 'Categories', href: '/admin/categories', icon: List,
      children: [
        { name: 'List Categories', href: '/admin/categories', icon: List },
        { name: 'Add Category', href: '/admin/categories/add', icon: Edit },
      ],
    },
    {
      name: 'Products', href: '/admin/products', icon: Package,
      children: [
        { name: 'List Products', href: '/admin/products', icon: List },
        { name: 'Add Product', href: '/admin/products/add', icon: Edit },
      ],
    },
    {
      name: 'Discounts', href: '/admin/discounts', icon: Percent,
      children: [
        { name: 'List Discounts', href: '/admin/discounts', icon: List },
        { name: 'Add Discount', href: '/admin/discounts/add', icon: Edit },
      ],
    },
    {
      name: 'Orders', href: '/admin/orders', icon: ShoppingCart,
      children: [
        { name: 'List Orders', href: '/admin/orders', icon: List },
      ],
    },
    {
      name: 'Blog', href: '/admin/blog', icon: Edit,
      children: [
        { name: 'List Blogs', href: '/admin/blog', icon: List },
        { name: 'Add Blog', href: '/admin/blog/add', icon: Edit },
        { name: 'Categories', href: '/admin/blog-categories', icon: List },
        { name: 'Add Category', href: '/admin/blog-categories/add', icon: Edit },
      ],
    },
    { name: 'Contact', href: '/admin/contact', icon: Phone },
    { name: 'Users', href: '/admin/users', icon: Users, roles: ['ADMIN'] }
  ];

  return navItems.filter(item => !item.roles || item.roles.includes(role));
};

const getActiveItem = (navigation: MenuItem[], pathname: string): MenuItem | null => {
  for (const item of navigation) {
    // Kiểm tra nếu pathname khớp hoặc bắt đầu bằng href của menu cha
    if (pathname === item.href || (item.children && pathname.startsWith(item.href))) {
      return item;
    }
  }
  return null;
};


// Sidebar Components
const SidebarHeader = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
    {!isCollapsed && (
      <h1 className="text-xl font-bold">
        Admin
      </h1>
    )}
  </div>
);

const SidebarNavItem = ({ item, isActive = false, onToggle, isExpanded, isCollapsed }: {
  item: MenuItem;
  isActive?: boolean;
  onToggle?: (name: string) => void;
  isExpanded?: boolean;
  isCollapsed: boolean;
}) => {
  const location = useLocation();
  // Chỉ active menu cha nếu pathname khớp hoặc bắt đầu bằng href của nó
  const isItemActive = !item.children && location.pathname === item.href;


  return (
    <div className="relative group">
      <Link
        to={item.href || '#'}
        onClick={(e) => {
          if (item.children && !isCollapsed) {
            e.preventDefault();
            onToggle?.(item.name);
          }
        }}
        className={classNames(
          'flex items-center px-3 py-3 text-sm font-medium rounded-md',
          isItemActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100',
          isCollapsed ? 'justify-center' : ''
        )}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && (
          <>
            <span className="ml-3">{item.name}</span>
            {item.children && (
              <ChevronDown className={classNames(
                'ml-auto h-4 w-4 transition-transform',
                isExpanded ? 'rotate-180' : ''
              )} />
            )}
          </>
        )}
      </Link>
      {(item.children && (isExpanded || isCollapsed)) && (
        <div className={classNames(
          'ml-6 space-y-1',
          isCollapsed ? 'absolute left-full top-0 bg-white shadow-lg rounded-md py-2 w-48 z-10 hidden group-hover:block' : ''
        )}>
          {item.children.map((child) => (
            <SidebarNavItem
              key={child.name}
              item={child}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
};
const Sidebar = ({ navigation, expandedItems, toggleMenuItem, isCollapsed, toggleSidebar }: {
  navigation: MenuItem[];
  expandedItems: string[];
  toggleMenuItem: (name: string) => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}) => {
  const location = useLocation();
  const activeItem = getActiveItem(navigation, location.pathname);

  return (
    <div className={classNames(
      'bg-white border-r border-gray-200 flex flex-col transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-60'
    )}>
      <SidebarHeader isCollapsed={isCollapsed} />
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => (
            <SidebarNavItem
              key={item.name}
              item={item}
              // Chỉ active nếu item là menu cha đang được chọn
              isActive={activeItem?.href === item.href}
              onToggle={toggleMenuItem}
              isExpanded={expandedItems.includes(item.name)}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>
      <button
        onClick={toggleSidebar}
        className="p-2 text-gray-500 hover:text-gray-700 border-t border-gray-200"
      >
        {isCollapsed ? <ChevronRight className="h-5 w-5 mx-auto" /> : <ChevronLeft className="h-5 w-5 mx-auto" />}
      </button>
    </div>
  );
};



// Header Components
const Header = ({ toggleSidebar, activeItem, handleLogout }: {
  toggleSidebar: () => void, activeItem: MenuItem | null,
  handleLogout: () => void
}) => (
  <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
    <div className="flex items-center space-x-4">
      <button
        onClick={toggleSidebar}
        className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <MenuIcon className="h-6 w-6" />
      </button>
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-700">
        <Link to="/admin" className="hover:underline">Dashboard</Link>
        {activeItem && activeItem.name !== 'Dashboard' && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span>{activeItem.name}</span>
          </>
        )}
      </nav>
    </div>
    <div className="flex items-center space-x-4">
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center space-x-2">
          <UserCircleIcon className="h-8 w-8 text-gray-500" />
          <span>Admin</span>
        </Menu.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-in"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md">
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  to="/"
                  className={classNames(
                    active ? 'bg-gray-100' : '',
                    'block px-4 py-2 text-gray-700'
                  )}
                >
                  Trang chủ
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  to="#"
                  onClick={handleLogout}
                  className={classNames(
                    active ? 'bg-gray-100' : '',
                    'block px-4 py-2 text-gray-700'
                  )}
                >
                  Logout
                </NavLink>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  </header>
);

// Main Component
export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { userRole, logout } = useContext<AuthContextType>(AuthContext as any);
  const navigation = generateNavigation(userRole || 'EMPLOYEE');
  const location = useLocation();
  const activeItem = getActiveItem(navigation, location.pathname);

  const toggleMenuItem = (name: string) => {
    if (!isCollapsed) {
      setExpandedItems(prev =>
        prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
      );
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
    if (!isCollapsed) {
      setExpandedItems([]); // Collapse all items when sidebar collapses
    }
  };

  const handleLogout = () => {
    logout();
  }
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        navigation={navigation}
        expandedItems={expandedItems}
        toggleMenuItem={toggleMenuItem}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} activeItem={activeItem} handleLogout={handleLogout} />
        <main className="main-content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}