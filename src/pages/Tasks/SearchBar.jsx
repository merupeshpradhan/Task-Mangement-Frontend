import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    navigate("/taskmanagement");
  };

  return (
    <div>
      <div className="border border-[#85ac85] flex items-center rounded-lg lg:rounded-full ml-1 lg:ml-0">
        <div className="lg:pl-2 pl-1 text-gray-400 mt-0.5">
          <FaSearch className="size-3" />
        </div>
        <input
          onChange={handleSearch}
          type="text"
          placeholder="Search image..."
          className="lg:w-[300px]  pl-1.5 py-0.5 lg:py-1 font-normal text-[12px] lg:text-md tracking-widest outline-none"
        />
      </div>
    </div>
  );
}

export default SearchBar;
