export interface FilterButtonProps {
  category: string;
  handleClick: () => void;
}

export default function FilterButton(filterProps: FilterButtonProps) {
  return (
    <button
      className="rounded-xl bg-black text-gray-50 py-2 px-4
          hover:scale-140 hover:bg-gray-600 text-xs font-medium"
      onClick={filterProps.handleClick}
    >
      {filterProps.category}
    </button>
  );
}
