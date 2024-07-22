import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";

export default function ViewArticle({ article }) {

  return (
    <DashboardLayout title={'show article'}>
      <Head title="View" />

      <div className="bg-background text-foreground">
      <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
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
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              { article.category.name }
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            { article.title }
            </h1>
            <p className="text-muted-foreground">{ article.created_at }</p>
          </div>
          <div dangerouslySetInnerHTML={{ __html: article.content }} />

        </article>
      </div>
    </div>
    </DashboardLayout>
  )
}