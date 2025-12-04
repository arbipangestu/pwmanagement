import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut, User, Settings } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { clsx } from 'clsx';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-primary h-screen flex flex-col shadow-xl fixed left-0 top-0 text-white">
      <div className="p-6 border-b border-red-700/30">
        <h1 className="text-2xl font-bold tracking-tight">PassManager</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary-hover shadow-inner"
                  : "hover:bg-primary-hover"
              )}
            >
              <Icon size={20} className="text-white" />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-red-700/30">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-[#C62828] rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
