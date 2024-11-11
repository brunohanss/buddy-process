import { ChevronRight } from "lucide-react";
import { SearchForm } from "@/components/pages/Documentation/components/search-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { LazyLoadImage } from "react-lazy-load-image-component";

import "react-lazy-load-image-component/src/effects/blur.css";


export function AppSidebar({ documentation, ...props }: { documentation: {
  navMain: {
      title: string;
      url: string;
      imageUrl?: string;
      items: {
          id: number;
          name: string;
          title: string;
          url: string;
          isActive: boolean;
      }[];
  }[];
}}) {
  console.log("props", documentation);

  return (
    <aside className="w-64 flex flex-col border-r">
      <div className="p-4 border-b">
        {/* <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} /> */}
        <SearchForm />
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        {/* We create a collapsible section for each parent */}
        {documentation.navMain.map((item) => (
          <Collapsible key={item.title} defaultOpen className="mb-2">
            <div className="flex flex-col">
              <CollapsibleTrigger className="flex items-center justify-between text-sm font-medium  p-2 rounded ">
              <LazyLoadImage
                            alt={``}
                            className="aspect-square rounded-md object-cover"
                            height="20"
                            src={item.imageUrl}
                            width="20"
                            effect="blur"
                          />
                {item.title}
                <ChevronRight className="ml-auto transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4">
                <ul className="flex flex-col space-y-2 mt-2">
                  {item.items.map((subItem) => (
                    <li key={subItem.title}>
                      <a
                        href={subItem.url}
                        className={`block p-2 rounded text-sm ${
                          subItem.isActive
                            ? "bg-muted"
                            : ""
                        }`}
                      >
                        {subItem.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </nav>
    </aside>
  );
}