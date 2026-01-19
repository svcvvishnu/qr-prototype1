'use client';

import { useRouter } from 'next/navigation';
import PullToRefresh from '@/app/components/PullToRefresh';

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleRefresh = async () => {
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Refresh the page data
        router.refresh();

        // Small delay for smooth UX
        await new Promise(resolve => setTimeout(resolve, 500));
    };

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <div className="page-enter">
                {children}
            </div>
        </PullToRefresh>
    );
}
