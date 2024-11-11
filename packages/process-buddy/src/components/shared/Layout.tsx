import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import HeaderSide from './HeaderSide';
import HeaderTop from './HeaderTop';

const Layout = ({ children, loading }: any) => {
  return (
    <div className="flex min-h-screen h-screen w-full bg-muted/40">
      {/* Sidebar */}
      <HeaderSide />

      {/* Main Content */}
      <div className="flex flex-1 flex-col sm:gap-4 sm:pl-14 h-full">
        {/* Header */}
        <HeaderTop />

        {/* Main Content or Loader */}
        <ScrollArea className="flex-1 w-full max-w-full">
          <main className="w-full">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                {/* Replace this with your loader component or any loading indicator */}
                <span>Loading...</span>
              </div>
            ) : (
              children
            )}
          </main>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Layout;