import Image from "next/image";
import ReportButton from "./ReportButton";

export interface PostInfo {
  imageUrl: string;
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
    <div className="w-full w-100 h-[300px] relative bg-white border rounded-md overflow-hidden">
      {/* Background image */}
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
        />
      )}
      <div className="relative z-10 flex flex-col p-5 justify-between">
        {post.sold && (
        <span
          className="
            rotate-45 absolute top-8 right-3 px-2 text-white
            bg-red-700 rounded-md font-bold"
        >
            SOLD
          </span>
        )}
        <div>
          <h3 className="font-bold text-gray-900 text-2xl text-center py-5">
            {post.title}
          </h3>
          <p className="text-sm text-gray-800 font-light">{post.description}</p>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="font-bold text-green-950 text-xl mb-5 p-4 bg-white/70 rounded-md">
            ${post.price}
          </span>
          <span className="bg-amber-300 uppercase text-sm text-gray-900 rounded-2xl font-bold mb-5 p-4 shadow">
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

