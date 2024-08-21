import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react';
import {
  Bars3Icon,
  ChartPieIcon,
  HomeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Avatar from '../components/avatar.jsx';
import {
  CalendarDoctor,
  CalendarFlow,
  CalendarTravel,
  LogoMonica,
} from '../icons/index.js';
import classNames from '../utils/tailwindUtils.js';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    id: 'dashboard',
  },
  {
    name: 'Werkrooster',
    href: '/werkrooster',
    icon: CalendarDoctor,
    id: 'werkrooster',
  },
  {
    name: 'Verlof aanvragen',
    href: '/verlofAanvragen',
    icon: CalendarTravel,
    id: 'verlofAanvragen',
  },
  {
    name: 'Dienstwissels',
    href: '/dienstwissels',
    icon: CalendarFlow,
    id: 'dienstwissels',
  },
  {
    name: 'Rapporten',
    href: '/rapporten',
    icon: ChartPieIcon,
    id: 'rapporten',
  },
];

const administrationItems = [
  {
    id: 1,
    name: 'Artsen',
    href: '/artsen',
    initial: 'H',
  },
  {
    id: 2,
    name: 'Kalenderabonnement',
    href: '/kalenderabonnement',
    initial: 'T',
  },
  {
    id: 3,
    name: 'Instellingen',
    href: '/instellingen',
    initial: 'W',
  },
  {
    id: 4,
    name: 'Help',
    href: '/help',
    initial: 'H',
  },
];

const currentUser = {
  name: 'Filip Smet',
  imageSource: '/images/565_Smet_Filip_F_sm.jpg',
};

export default function Root() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleNavLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <div>
        <Dialog
          className="relative z-50 lg:hidden"
          open={sidebarOpen}
          onClose={setSidebarOpen}
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                <div className="flex h-16 shrink-0 items-center">
                  <LogoMonica height="6rem" className="w-auto" />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigationItems.map((item) => (
                          <li key={item.id}>
                            <NavLink
                              to={item.href}
                              onClick={handleNavLinkClick}
                              className={({ isActive }) =>
                                classNames(
                                  isActive
                                    ? 'bg-gray-50 text-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                )
                              }
                            >
                              {({ isActive }) => (
                                <>
                                  <item.icon
                                    className={classNames(
                                      isActive
                                        ? 'text-indigo-600'
                                        : 'text-gray-400 group-hover:text-indigo-600',
                                      'h-6 w-6 shrink-0',
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </>
                              )}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="text-xs font-semibold leading-6 text-gray-400">
                        Your teams
                      </div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {administrationItems.map((team) => (
                          <li key={team.id}>
                            <NavLink
                              to={team.href}
                              onClick={handleNavLinkClick}
                              className={({ isActive }) =>
                                classNames(
                                  isActive
                                    ? 'bg-gray-50 text-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                )
                              }
                            >
                              {({ isActive }) => (
                                <>
                                  <span
                                    className={classNames(
                                      isActive
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600',
                                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium',
                                    )}
                                  >
                                    {team.initial}
                                  </span>
                                  <span className="truncate">{team.name}</span>
                                </>
                              )}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <div className="flex h-16 shrink-0 items-center">
              <LogoMonica height="6rem" className="w-auto" />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigationItems.map((item) => (
                      <li key={item.id}>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            classNames(
                              isActive
                                ? 'bg-gray-50 text-indigo-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                            )
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <item.icon
                                className={classNames(
                                  isActive
                                    ? 'text-indigo-600'
                                    : 'text-gray-400 group-hover:text-indigo-600',
                                  'h-6 w-6 shrink-0',
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">
                    Your teams
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {administrationItems.map((team) => (
                      <li key={team.id}>
                        <NavLink
                          to={team.href}
                          className={({ isActive }) =>
                            classNames(
                              isActive
                                ? 'bg-gray-50 text-indigo-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                            )
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span
                                className={classNames(
                                  isActive
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600',
                                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium',
                                )}
                              >
                                {team.initial}
                              </span>
                              <span className="truncate">{team.name}</span>
                            </>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <Avatar
                    fullName={currentUser.name}
                    imageSource={currentUser.imageSource}
                  />
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            {navigationItems.find((nav) => location.pathname === nav.href)
              ?.name || ''}
          </div>
          <Avatar
            fullName={currentUser.name}
            imageSource={currentUser.imageSource}
          />
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
