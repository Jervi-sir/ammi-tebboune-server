import { Button } from "@/Components/ui/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head } from "@inertiajs/react";
import { LocateIcon, MapIcon, MapPinIcon } from "lucide-react";

export default function ViewEvent({ event }) {

  return (
    <DashboardLayout title={'show event'}>
      <Head title="View" />
      <div className="flex-1 bg-background text-foreground p-2 m-0">
        <div className="flex flex-1 justify-end">
          <Button onClick={() => Inertia.visit(route("event.edit", { id: event.id }))}>Edit Article</Button>
        </div>
        <div className="container max-w-4xl p-0">
          <article className="prose prose-gray dark:prose-invert">
            <div className="mb-8">
              <img
                src={event.thumbnail}
                alt="Article Thumbnail"
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="space-y-2 not-prose">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                {event.event_date}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                {event.title}
              </h1>
              <div className="flex flex-row items-center gap-2">
                <MapPinIcon />
                <p className="text-muted-foreground">{event.location} - {event.wilaya}</p>
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: event.content }} />
          </article>
        </div>
      </div>
    </DashboardLayout>
  )
}