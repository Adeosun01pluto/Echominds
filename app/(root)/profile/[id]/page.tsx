import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { AuthprofileTabs, profileTabs } from "@/constants";

import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchUser } from "@/lib/actions/user.actions";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(params.id);
  const currentUserLogged = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  return (
    <section className="mt-16">
      <ProfileHeader
        createdAt={userInfo.createdAt}
        followers={userInfo.followers}
        followings={userInfo.followings}
        accountId={userInfo.id}
        authUserId={user.id}
        userIdToFollow={userInfo._id}
        currentUserId={currentUserLogged._id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />
      <div className='mt-9'>
        <Tabs defaultValue='threads' className='w-full'>
          {currentUserLogged._id.equals(userInfo._id) ?
            <TabsList className='tab'>
            {AuthprofileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className='rounded-sm dark:bg-primary-500 bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {userInfo.threads.length + userInfo.repost.length}
                  </p>
                )}
                {tab.label === "Anonymous" && (
                  <p className='rounded-sm dark:bg-primary-500 bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {userInfo.questions?.length + userInfo.repostQuestion?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList> :
          <TabsList className='tab'>
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className='rounded-sm dark:bg-primary-500 bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {userInfo.threads.length + userInfo.repost.length}
                  </p>
                )}
                {tab.label === "Anonymous" && (
                  <p className='rounded-sm dark:bg-primary-500 bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {userInfo.questions?.length + userInfo.repostQuestion?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          }
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className='w-full text-light-1'
            >
              {/* @ts-ignore */}
              <ThreadsTab
                currentUserId={user.id}
                currentUser_Id={userInfo._id}
                accountId={userInfo.id}
                accountType='User'
                type={tab.label}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
export default Page;