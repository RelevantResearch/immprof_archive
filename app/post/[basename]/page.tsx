import { notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

interface PageProps {
  params: Promise<{
    basename: string;
  }>;
}

// Enable dynamic rendering
export const dynamic = "force-dynamic";

async function getPost(basename: string) {
  await connectDB();
  const post = await BlogPost.findOne({ basename, status: "Publish" }).lean();
  return post ? JSON.parse(JSON.stringify(post)) : null;
}

async function getRelatedPosts(category: string, currentBasename: string) {
  await connectDB();
  const posts = await BlogPost.find({
    category,
    basename: { $ne: currentBasename },
    status: "Publish",
  })
    .sort({ date_parsed: -1 })
    .limit(3)
    .lean();
  return JSON.parse(JSON.stringify(posts));
}

export default async function PostPage({ params }: PageProps) {
  const { basename } = await params;
  const post = await getPost(basename);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, post.basename);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{post.category}</li>
        </ol>
      </nav>

      {/* Article Header */}
      <article className="bg-white rounded-lg shadow-lg p-8 mb-12">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
              {post.category}
            </span>
            <time className="text-gray-500">
              {formatDate(post.date_parsed)}
            </time>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-600">
            <span className="font-medium">{post.author}</span>
            {post.author_email && (
              <>
                <span className="mx-2">•</span>
                <a
                  href={`mailto:${post.author_email}`}
                  className="text-blue-600 hover:underline"
                >
                  {post.author_email}
                </a>
              </>
            )}
          </div>
        </header>

        {/* Article Content */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {post.extended_body && (
          <div
            className="article-content mt-6"
            dangerouslySetInnerHTML={{ __html: post.extended_body }}
          />
        )}

        {/* Article Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to all articles
            </Link>
            {/* {post.unique_url && (
              <a
                href={post.unique_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                View original →
              </a>
            )} */}
          </div>
        </footer>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost: any) => (
              <article
                key={relatedPost._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full mb-3">
                    {relatedPost.category}
                  </span>
                  <Link href={`/post/${relatedPost.basename}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500">
                    {formatDate(relatedPost.date_parsed)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
