import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Avatar = ({ fullName, imageSource, handleLogout }) => {
  const navigate = useNavigate();
  const [isDropdownUp, setIsDropdownUp] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const checkPosition = () => {
      if (menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        if (spaceBelow < 200 && spaceAbove > spaceBelow) {
          setIsDropdownUp(true);
        } else {
          setIsDropdownUp(false);
        }
      }
    };

    checkPosition(); // Initial check

    window.addEventListener('scroll', checkPosition);
    window.addEventListener('resize', checkPosition);

    return () => {
      window.removeEventListener('scroll', checkPosition);
      window.removeEventListener('resize', checkPosition);
    };
  }, []);

  return (
    <Menu as="div" className="relative inline-block text-left" ref={menuRef}>
      <div>
        <MenuButton className="flex cursor-pointer items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
          <span className="sr-only">Uw profiel</span>
          <span aria-hidden="true">{fullName}</span>
          <ChevronDownIcon
            aria-hidden="true"
            className="h-5 w-5 text-gray-400"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className={`absolute z-10 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none ${
          isDropdownUp ? 'bottom-full mb-2' : 'top-full mt-2'
        }`}
      >
        <div className="px-4 py-3">
          <p className="text-sm">Signed in as</p>
          <p className="truncate text-sm font-medium text-gray-900">
            {fullName}
          </p>
        </div>
        <div className="py-1"></div>
        <div className="py-1">
          <MenuItem>
            <button
              type="submit"
              className={`block w-full px-4 py-2 text-left text-sm ${'text-gray-700'}`}
              onClick={handleLogout}
            >
              Sign out
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};

export default Avatar;
