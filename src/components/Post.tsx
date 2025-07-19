import Image from "next/image";
import ReportButton from "./ReportButton";

export interface PostInfo {
  imageUrl: string | null;
  title: string;
  description: string;
  price: number;
  sold: boolean;
  category: string;
  postedBy: string;
  listingId?: number;
  onReportSuccess?: () => void;
}

export default function Post(post: PostInfo) {
  return (
    <div className="w-full relative bg-white">
      {post.imageUrl ? (
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="w-full h-full border-1 rounded-md object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 border-2 rounded-md flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-sm">No Image Available</p>
          </div>
        </div>
      )}
      {post.sold && (
        <span
          className="
            rotate-45 absolute top-8 right-3 px-2 text-white
            bg-red-700 rounded-md font-bold"
        >
          SOLD
        </span>
      )}
      <div className="flex flex-col p-5 justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-2xl text-center py-5">
            {post.title}
          </h3>
          <p className="text-sm text-gray-500 font-light">{post.description}</p>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="font-bold text-green-950 text-xl mb-5 p-4">
            ${post.price}
          </span>
          <span
            className="shadow-s shadow-amber-50 bg-amber-300
            uppercase text-sm text-gray-900 rounded-2xl font-bold mb-5 p-4"
          >
            {post.category}
          </span>
        </div>
        <p className="mt-2 text-gray-400 text-xs">
          Posted by
          <span className="text-sm font-bold"> {post.postedBy} </span>
        </p>
        {post.listingId && (
          <div className="mt-2 flex justify-end">
            <ReportButton
              listingId={post.listingId}
              onReportSuccess={post.onReportSuccess}
            />
          </div>
        )}
      </div>
    </div>
  );
}
