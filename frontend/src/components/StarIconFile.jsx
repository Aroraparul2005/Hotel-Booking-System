import { assets } from "../assets/assets";

function StarIconFile({ rating = 4 }) {
  return (
    <div className="flex flex-row h-6 mr-2">
      {Array.from({ length: 5 }, (_, i) => (
        <img
          key={i}
          src={i < rating ? assets.starIconFilled : assets.starIconOutlined}
          alt="star"
          className="h-4 w-4"
        />
      ))}
    </div>
  );
}

export default StarIconFile;

