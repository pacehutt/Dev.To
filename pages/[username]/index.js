import UserProfile from "@/components/UserProfile";
import PostFeed from "@/components/PostFeed";
import { db, getUserWithUsername, postToJSON } from "@/lib/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  where,
  query as Query,
} from "firebase/firestore";

// This function is called at build time
export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();

    const postsQuery = Query(
      collection(db, "users", userDoc.id, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    // retrieve the posts data using the query
    posts = (await getDocs(postsQuery)).docs.map(postToJSON);

    console.log(posts, "posts");
  }

  return {
    props: {
      user,
      posts,
    },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}