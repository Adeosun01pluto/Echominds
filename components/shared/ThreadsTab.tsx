import { redirect } from "next/navigation";

import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { fetchUserPosts, fetchUserQuestions } from "@/lib/actions/user.actions";

import ThreadCard from "../cards/ThreadCard";
import QuestionCard from "../cards/QuestionCard";
import { Community } from "@/lib/types";


interface Props {
  currentUserId: string;
  currentUser_Id: string;
  accountId: string;
  accountType: string;
  type: string;
}
interface Thread {
  _id: string;
  text: string;
  parentId: string | null;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: Community | null;
  createdAt: string;
  children: {
    author: {
      image: string;
    };
  }[];
  // Add any other properties you expect here
}

// Define the type for the 'result' variable
interface Result {
  threads: Thread[];
  // Add any other properties you expect here
}
interface Question {
  _id: string;
  text: string;
  parentId: string | null;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  children: {
    author: {
      image: string;
    };
  }[];
  // Add any other properties you expect here
}


async function ThreadsTab({ currentUserId,currentUser_Id, accountId, accountType, type }: Props) {
  let result: Result | null = null;
  let questions: Question[] = [];
  if (type === "Anonymous") {
        // @ts-ignore

    questions = await fetchUserQuestions(currentUser_Id);
  } else if (type= "Threads") {
    // @ts-ignore
    result = await fetchUserPosts(accountId);
  }
  // console.log(questions)
  return (
    <section className='mt-9 flex flex-col gap-3'>
      {
        type === "Threads" ? 
      // @ts-ignore
        result?.length > 0 ?
      // @ts-ignore
      (result?.map((thread :any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          currentUser_Id={currentUser_Id}
          parentId={thread.parentId}
          content={thread.text}
          likes={thread.likes}
          repost={thread.repost}
          photos={thread.photos}
          author={thread.author}
          community={thread.community}
          // community={
          //   accountType === "Community"
          //     ? { name: result.name, id: result.id, image: result.image }
          //     : thread.community
          // }
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))) : 
      <p className="text-lg font-light ">No Threads</p> 
      : type === "Anonymous" ? 
          // @ts-ignore
      questions?.length > 0 ?
          // @ts-ignore
      (questions?.map((question :any)=>(
        <QuestionCard 
          key={question._id}
          id={question._id}
          likes={question.likes}
          repost={question.repost}
          currentUserId={currentUserId}
          currentUser_Id={currentUser_Id}
          parentId={question.parentId}
          content={question.text}
          author={question.author}
          community={question.community}
          createdAt={question.createdAt}
          comments={question.children}
          photos={question.photos}    
        />
      ))) : <p className="text-lg font-light ">No Anonymous</p>
      : type === "Followers" ? "" : "" 

    }
    </section>
  );
}

export default ThreadsTab;