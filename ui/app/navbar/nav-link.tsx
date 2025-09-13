"use client"

import {
  ComputerDesktopIcon,
  HomeIcon,
  MicrophoneIcon,
  DevicePhoneMobileIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

import clsx from 'clsx';
import { Headphones, Keyboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
const links = [
  { name: 'Home', href: '/', icon: HomeIcon },
  {
    name: 'Điện thoại',
    href: '/phone',
    icon: DevicePhoneMobileIcon,
  },
  { name: 'Laptop', href: '/laptop', icon: ComputerDesktopIcon },
  {
    name: 'Phụ kiện',
    href: '/accessory',
    icon: MicrophoneIcon,
    menu: [
      {
        name: 'Tai nghe',
        href: '/headphone',
        icon: Headphones,
      },
      {
        name: 'Bàn phím',
        href: '/keyboard',
        icon: Keyboard,
      },

    ]
  },
];

export default function NavLinks() {

  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        if (link.menu) {
          return (
            <div
              key={link.name}
              className="relative group"
            >
              <Link
                href={link.href}
                className={clsx(
                  "flex flex-none h-[42px] w-[100px] border border-gray-100 items-center justify-center rounded-full text-sm font-medium md:w-fit md:gap-2 md:px-5",
                  {
                    'bg-blue-500 text-white border-blue-500': pathname === link.href,
                    ' hover:bg-sky-100 hover:text-blue-600 hover:border-blue-100': pathname !== link.href
                  },
                )}
              >
                <LinkIcon className="w-6" />
                <p className="hidden md:block">{link.name}</p>
                <ChevronDownIcon className="w-4 hidden min-[450]:block" />
              </Link>
              <div className="absolute top-full right-0 md:left-0 hidden min-[450px]:group-hover:block pt-2 bg-none border-none">
                <div className="min-w-[200px] flex flex-col rounded-xl overflow-clip border border-gray-200 bg-white shadow-md">
                  {link.menu.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-sky-100 hover:text-blue-600"
                      >
                        <ItemIcon className="w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex flex-none h-[42px] w-[100px] border border-gray-100 items-center justify-center rounded-full text-sm font-medium md:w-fit md:gap-2 md:px-5",
                {
                  'bg-blue-500 text-white border-blue-500': pathname === link.href,
                  ' hover:bg-sky-100 hover:text-blue-600 hover:border-blue-100': pathname !== link.href
                },
              )}
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
              {link.menu && (<ChevronDownIcon className='w-4' />)}
            </Link>
          )
        }
      })}
    </>
  );
}