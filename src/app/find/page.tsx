
'use client'

import { FindClient, FindEventsClient } from './find-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FindPage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold font-headline mb-2">Find</h1>
      <p className="text-muted-foreground mb-6">
        Search for other pet owners or events in your area.
      </p>
      
      <Tabs defaultValue="parents" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="parents">Pet Parents</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="parents" className="mt-6">
            <FindClient />
        </TabsContent>
        <TabsContent value="events">
            <FindEventsClient />
        </TabsContent>
      </Tabs>
    </div>
  );
}
