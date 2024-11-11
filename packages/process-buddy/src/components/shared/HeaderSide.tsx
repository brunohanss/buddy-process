import { Link, useLocation } from "react-router-dom";
import { Unplug, CircuitBoard, FileText, Settings } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const HeaderTabs = [
  {
    tooltipText: 'Processes',
    icon: <CircuitBoard className="h-5 w-5" />,
    url: '/processes'
  },
  {
    tooltipText: 'Integrations',
    icon: <Unplug className="h-5 w-5" />,
    url: '/integrations'
  },
  {
    tooltipText: 'Documentation',
    icon: <FileText className="h-5 w-5" />,
    url: '/documentation'
  },
  {
    tooltipText: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    url: '/settings'
  },
];

export default function HeaderSide() {
  const location = useLocation();

  // Enum for header tabs
  // const HeaderTab = {
  //   // DASHBOARD: "/",
  //   PROCESSES: "/processes",
  //   INTEGRATIONS: "/integrations",
  //   // CATALOG: "/integrations/catalog",
  //   DOCUMENTATION: "/documentation",
  //   SETTINGS: "/settings",
  // };


  // Determine selected tab based on current location path
  const selectedTab = HeaderTabs.find((tab) =>
    location.pathname.startsWith(tab?.url)
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link to="/" className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
          <LazyLoadImage src="/logo.svg" width={36} height={36} alt="Logo" className="overflow-hidden" effect="blur" />
          <span className="sr-only">Home</span>
        </Link>

        {HeaderTabs.map((tab, i) => (
          tab.url !== "/settings" && ( // Skip settings for the main nav
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Link
                  to={tab.url}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    selectedTab?.url === tab.url
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  } transition-colors hover:text-foreground md:h-8 md:w-8`}
                >
                  {tab.icon}
                  <span className="sr-only">{i}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{tab?.tooltipText}</TooltipContent>
            </Tooltip>
          )
        ))}

      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/settings" className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              selectedTab?.url === '/settings'
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            } transition-colors hover:text-foreground md:h-8 md:w-8`}>
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}