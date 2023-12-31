"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";
import Question from "../models/question.model";

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId })
    .populate({
      path: "communities",
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();
    // const user = await User.findOne({ id: userId })
    // Find all threads authored by the user with the given userId
    const user = await User.findOne({ id: userId })
    .populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
        {
          path: "author", // Add this population block for the "author" field
          model: User,
          select: "name image id",
        },
      ],
    })
    .populate({
      path: "repost",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
        {
          path: "author", // Add this population block for the "author" field
          model: User,
          select: "name image id",
        },
      ],
    });      
    const allThreads = [...user.threads, ...user.repost];

    // Sort the array based on the createdAt property in descending order
    const sortedThreads = allThreads.sort((a, b) => {
      // @ts-ignore
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    // const result =[...user.threads, ...user.repost]
    return sortedThreads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

export async function fetchUserQuestions(userId: string) {
  try {
    connectToDB();  
    // Find all threads authored by the user with the given userId
    const user = await User.find({ _id: userId })
    .populate({
      path: "questions",
      model: Question,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id",
        },
        {
          path: "children",
          model: Question,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
        {
          path: "author", // Add this population block for the "author" field
          model: User,
          select: "name image id",
        },
      ],
    })
    .populate({
      path: "repostQuestion",
      model: Question,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id",
        },
        {
          path: "children",
          model: Question,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
        {
          path: "author", // Add this population block for the "author" field
          model: User,
          select: "name image id",
        },
      ],
    });

    const allQuestions =[...user[0].questions, ...user[0].repostQuestion]
    // Sort the array based on the createdAt property in descending order
    const sortedQuestions = allQuestions.sort((a, b) => {
      // @ts-ignore
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    // console.log(result)
    return sortedQuestions;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

// export async function getActivity(userId: string) {
//   try {
//     connectToDB();

//     // Find the user by userId and populate the "author" field
//     const user = await User.findOne({ _id: userId });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     // Extract the 'activities' field from the user document
//     const { activities } = user;

//     // Fetch user information for each activity and add it to the activities array
//     const activitiesWithUserInfo = await Promise.all(
//       activities.map(async (activity : any) => {
//         const activityId = activity._id;
//         const userInfo = await User.findById(activityId).select("name image");
//         return { ...activity.toObject(), userInfo }; // Combine activity and userInfo
//       })
//     );

//     // console.log(activitiesWithUserInfo);

//     // Return the updated 'activities' array
//     return activitiesWithUserInfo;
//   } catch (error) {
//     console.error('Error fetching activities: ', error);
//     throw error;
//   }
// }


export async function searchUsers({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {};

    // If the search string is not empty, add the $or operator to match username, name, or other relevant fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } }, // Match the username field
        { name: { $regex: regex } }, // Match the name field
        // Add more fields to search here if needed
      ];
    }

    // Define the sort options for the fetched users based on createdAt field.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the users based on the search and sort criteria.
    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
}


export async function followUser(currentUserId : string, userIdToFollow :string) {
  try {
    connectToDB();

    // Check if the user to follow exists
    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) {
      throw new Error('User to follow not found');
    }

    // Check if the current user exists
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      throw new Error('Current user not found');
    }
    if(!currentUser.followings.includes(userToFollow._id)){
      // Add the user to follow to the current user's 'followings' list
      currentUser.followings.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
      await currentUser.save();
      await userToFollow.save();
    }    
    
  } catch (error : any ) {
    throw new Error(`Failed to follow user: ${error.message}`);
  }
}

export async function unfollowUser(currentUserId : string, userIdToFollow :string) {
  try {
    connectToDB();

    // Check if the user to follow exists
    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) {
      throw new Error('User to follow not found');
    }

    // Check if the current user exists
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      throw new Error('Current user not found');
    }
    if(currentUser.followings.includes(userToFollow._id)){
      // Add the current user to the user to follow's 'followers' list
      userToFollow.followers.pull(currentUser._id);
      currentUser.followings.pull(userToFollow._id);
      await userToFollow.save();
      await currentUser.save();
    }

  } catch (error : any ) {
    throw new Error(`Failed to follow user: ${error.message}`);
  }
}

