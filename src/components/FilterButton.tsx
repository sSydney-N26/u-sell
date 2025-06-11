export interface FilterButtonProps {
  category: string;
  handleClick: () => void;
}

export default function FilterButton(filterProps: FilterButtonProps) {
  return (
    <button
      className="rounded-2xl bg-black text-gray-50 py-2 px-4
          hover:scale-140 hover:bg-gray-600 font-bold text-xs"
      onClick={filterProps.handleClick}
    >
      {filterProps.category}
    </button>
  );
}
