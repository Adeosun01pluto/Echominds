import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";
import DeleteQuestion from "../forms/DeleteQuestion";
import QContent from "../forms/QContent";

interface Props {
  id: string;
  currentUserId: string;
  currentUser_Id: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    profile: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  photos?:string[]
  likes?:string[]
  repost?:string[]
}

function QuestionCard({
  id,
  currentUserId,
  currentUser_Id,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
  photos,
  likes,
  repost
}: Props) {
  
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-3 py-3 my-1 md:my-2 bg-dark-2 dark:bg-light-2" : "dark:bg-light-2 bg-dark-2 p-3"
      }`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row'>
          {/* <div className='flex flex-col items-center'>
            <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
              <Image
                src={`${author.image}`}
                alt='user_community_image'
                fill
                className='cursor-pointer rounded-full'
              />
            </Link>

            <div className='thread-card_bar' />
          </div> */}

          <QContent likes={likes} repost={repost} contentType={"questions"} author={author} photos={photos} isComment={isComment} content={content} id={id} comments={comments} currentUser_Id={currentUser_Id}/>

        </div>

        <DeleteQuestion
          threadId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>

      {!isComment && comments.length > 0 && (
        <div className='ml-1 mt-3 flex gap-2'>
          {/* {comments.slice(0, 2).map((comment, index) => (
            <Image
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))} */}

          <Link href={`/questions/${id}`}>
            <p className='mt-1 text-subtle-medium text-gray-1'>
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className='mt-5 flex items-center'
        >
          <p className='text-subtle-medium text-gray-1'>
            {formatDateString(createdAt)}
            {community && ` - ${community.name} Community`}
          </p>

          <Image
            src={community?.profile}
            alt={community.name}
            width={14}
            height={14}
            className='ml-1 rounded-full object-cover'
          />
        </Link>
      )}
    </article>
  );
}

export default QuestionCard;