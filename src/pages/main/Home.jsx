// pages/Home.jsx
import CreatePost from "../../components/feed/CreatePost";
import FeedList from "../../components/feed/FeedList";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto w-full py-6">
      <CreatePost />
      <FeedList />
    </div>
  );
}
