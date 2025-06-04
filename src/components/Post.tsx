import Image from "next/image";

export interface PostInfo {
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  sold: boolean;
  category: string;
  postedBy: string;
}

export default function Post(post: PostInfo) {
  return (
    <div className="w-full relative bg-white">
      <Image
        src={post.imageUrl}
        alt={post.title}
        className="w-full h-full border-2 rounded-md object-cover"
      />
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
      </div>
    </div>
  );
}
