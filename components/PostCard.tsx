import Link from "next/link";
import { Post } from "@/hooks/usePosts";
import { extractTextFromHTML, formatDateToReadable } from "@/lib/utils/helpers";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
            {post.category}
          </span>
          <span className="text-sm text-gray-500">
            {formatDateToReadable(post.date_parsed)}
          </span>
        </div>
        <Link href={`/post/${post.basename}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt || extractTextFromHTML(post.body)}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{post.author}</span>
          <Link
            href={`/post/${post.basename}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
