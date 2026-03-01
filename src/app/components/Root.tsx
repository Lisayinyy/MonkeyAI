import { Outlet } from 'react-router';
import { BottomNav } from './BottomNav';

export function Root() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-[430px] mx-auto">
      <div className="flex-1 overflow-auto pb-20">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
