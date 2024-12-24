'use client';
import React, { useState } from 'react';
import { Sidebar } from 'flowbite-react';
import "@/app/globals.css";
import Link from 'next/link';
import { MenuList } from './menuList';
import { usePathname } from 'next/navigation'; // Only use usePathname

type Menu = {
  title?: string;
  path: string;
  active: boolean;
  icon: React.ComponentType;
};

export default function SidebarComponent() {
  const [menu] = useState<Menu[]>(MenuList);
  const pathname = usePathname(); // Get the current pathname

  return (
    <Sidebar className=''>
      <Sidebar.Items className='h-full flex'>
        <Sidebar.ItemGroup className='h-full flex flex-col items-center'>
          {menu.map((item, index) => {
            const isActive = pathname === item.path; // Compare current path with menu item path

            return (
              <button
                key={index}
                className={`items-start justify-start w-[200px] p-3 rounded-lg ${
                  isActive
                    ? 'bg-orange-400 text-white' // Active styles
                    : 'bg-transparent text-orange-400 hover:bg-orange-400 hover:text-white' // Default hover styles
                } group`}
              >
                <Link
                  href={item.path}
                  className='flex items-center space-x-2 text-xl font-normal group-hover:text-white'
                >
                  {/* Render the icon */}
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </button>
            );
          })}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
