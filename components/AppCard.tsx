import Link from 'next/link';
import { Globe, File, Monitor } from 'lucide-react';

interface AppCardProps {
  app: {
    id: string;
    name: string;
    url: string;
    type: 'website' | 'desktop' | 'mobile';
  };
}

const iconMap = {
  website: Globe,
  desktop: Monitor,
  mobile: File, // Assuming 'file' icon for mobile for now, can be changed
};

export default function AppCard({ app }: AppCardProps) {
  const Icon = iconMap[app.type] || Globe; // Default to Globe if type is unknown

  return (
    <Link href={`/app/${app.id}`} className="block">
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200 flex items-center space-x-4">
        <div className="flex-shrink-0">
          <Icon size={32} className="text-primary-DEFAULT" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-secondary-DEFAULT">{app.name}</h3>
          <p className="text-secondary-charcoal text-sm truncate">{app.url}</p>
        </div>
      </div>
    </Link>
  );
}