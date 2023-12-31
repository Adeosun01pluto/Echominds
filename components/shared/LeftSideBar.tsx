"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";

// import { sidebarLinks } from "@/constants";

const LeftSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme()
  const sidebarLinks = [
    {
      imgURL: theme === "dark" ? "/assets/home_icon.svg" : "/assets/home.svg",
      route: "/",
      label: "Home",
    },
    {
      imgURL: theme === "dark" ? "/assets/question_icon.svg" : "/assets/question-square.svg",
      route: "/questions",
      label: "Anonymous",
    },
    {
      imgURL: theme === "dark" ? "/assets/create_icon.svg" : "/assets/create.svg",
      route: "/create-thread",
      label: "Create",
    },
    {
      imgURL: theme === "dark" ? "/assets/search_icon.svg" : "/assets/search.svg",
      route: "/search",
      label: "Search",
    },
    {
      imgURL: theme === "dark" ? "/assets/community_icon.svg" : "/assets/community.svg",
      route: "/communities",
      label: "Communities",
    },
    {
      imgURL: theme === "dark" ? "/assets/profile_icon.svg" : "/assets/user.svg",
      route: "/profile",
      label: "Profile",
    },
];

  const { userId } = useAuth();

  return (
    <section className='custom-scrollbar dark:dark_leftsidebar leftsidebar'>
      <div className='flex w-full flex-1 flex-col gap-4 px-6'>
        {sidebarLinks?.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          if (link.route === "/profile") link.route = `${link.route}/${userId}`;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActive && "bg-primary-500"}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />

              <p className={`${isActive && "dark:text-light-1"} text-light-1 dark:text-dark-1 text-xl flex-1 max-lg:hidden`}>{link.label}</p>
            </Link>
          );
        })}
      </div>

      <div className='mt-10 px-6'>
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className='flex cursor-pointer gap-4 p-4'>
              <Image
                src={theme === "dark" ? "/assets/logout-dark.svg" :"/assets/logout.svg"}
                alt='logout'
                width={24}
                height={24}
              />

              <p className='text-light-2 dark:text-dark-2 text-lg flex-1 max-lg:hidden'>Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;