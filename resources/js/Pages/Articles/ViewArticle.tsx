import { Button } from "@/Components/ui/button";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { applyTailwindClasses } from "@/lib/applyTailwindClasses";
import { Inertia } from "@inertiajs/inertia";
import { Head } from "@inertiajs/react";

export default function ViewArticle({ article }) {

  return (
    <DashboardLayout title={'show article'}>
      <Head title="View" />
      <div className="flex-1 bg-background text-foreground p-2 m-0">
        <div className="flex flex-1 justify-end">
          <Button onClick={() => Inertia.visit(route("article.edit", { id: article.id }))}>Edit Article</Button>
        </div>
        <div className="container max-w-4xl p-0">
          <article className="prose prose-gray dark:prose-invert">
            <div className="mb-8">
              <img
                src={article.thumbnail}
                alt="Article Thumbnail"
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="space-y-2 not-prose">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium text-muted-foreground" dir="rtl">
                {article.category.name}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl" dir="rtl">
                {article.title}
              </h1>
              <p className="text-muted-foreground">{article.created_at}</p>
            </div>
            <div dir="rtl" dangerouslySetInnerHTML={{ __html: applyTailwindClasses(article.content) }} />

          </article>
        </div>
      </div>
    </DashboardLayout>
  )
}