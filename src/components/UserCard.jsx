import { Link } from "react-router-dom";

export default function UserCard({ user, onToggleFollow }) {
  return (
    <div className="ucard">
      <img className="avatar" src={user.avatar} alt={user.name} />
      <div className="name">
        <Link to={`/profile/${user.handle}`} style={{ textDecoration: "none", color: "inherit" }}>
          {user.name}
        </Link>
      </div>
      <div className="handle">@{user.handle}</div>
      <div className="bio">{user.bio ?? "Home cook."}</div>
      <button
        className={`follow ${user.following ? "following" : ""}`}
        onClick={onToggleFollow}
      >
        {user.following ? "Following" : "Follow"}
      </button>
    </div>
  );
}
