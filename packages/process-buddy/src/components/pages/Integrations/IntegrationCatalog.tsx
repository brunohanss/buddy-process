import 'react-lazy-load-image-component/src/effects/blur.css';

import {
  PlusCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { AlbumArtwork } from "./components/album-artwork";
import { PodcastEmptyPlaceholder } from "./components/podcast-empty-placeholder";
import { listenNowAlbums, madeForYouAlbums } from "./data/albums";

export default function Catalog() {
  return (
    

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <Tabs defaultValue="music" className="h-full space-y-6">
              <div className="space-between flex items-center">
                <TabsList>
                  <TabsTrigger value="music">Music</TabsTrigger>
                  <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                  <TabsTrigger value="live" disabled>
                    Live
                  </TabsTrigger>
                </TabsList>
                <Button className="ml-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Music
                </Button>
              </div>
              <TabsContent value="music" className="border-none p-0 outline-none">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Listen Now
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Top picks for you. Updated daily.
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <ScrollArea>
                  <div className="flex space-x-4 pb-4">
                    {listenNowAlbums.map((album) => (
                      <AlbumArtwork
                        key={album.name}
                        album={album}
                        className="w-[250px]"
                        aspectRatio="portrait"
                        width={250}
                        height={330}
                      />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <Separator className="my-4" />
                <ScrollArea>
                  <div className="flex space-x-4 pb-4">
                    {madeForYouAlbums.map((album) => (
                      <AlbumArtwork
                        key={album.name}
                        album={album}
                        className="w-[150px]"
                        aspectRatio="square"
                        width={150}
                        height={150}
                      />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="podcasts" className="flex-col p-0">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    New Episodes
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Your favorite podcasts. Updated daily.
                  </p>
                </div>
                <Separator className="my-4" />
                <PodcastEmptyPlaceholder />
              </TabsContent>
            </Tabs>
          </div>
        </main>
  );
}
