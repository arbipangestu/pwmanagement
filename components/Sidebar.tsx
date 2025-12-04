import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { clsx } from 'clsx';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="h-16 bg-gradient-to-r from-primary to-primary-dark text-highlight-white flex items-center justify-between px-6 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">PassManager</h1>
        <nav className="flex space-x-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-primary-dark text-highlight-gold shadow-md"
                    : "text-highlight-white/80 hover:bg-primary-dark/70 hover:text-highlight-gold"
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="flex items-center gap-2 px-3 py-2 text-left text-highlight-white/80 hover:bg-primary-dark/70 hover:text-highlight-gold rounded-md transition-colors"
      >
        <LogOut size={20} />
        <span className="font-medium">Sign Out</span>
      </button>
    </div>
  );
}
