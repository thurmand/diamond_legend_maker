export function ProjectName({ onChange, value }) {
  return (
    <div className="px-2 my-2">
      <input
        type="text"
        className="mt-2 border-b border-gray-600 text-2xl bg-transparent"
        onChange={onChange}
        value={value}
        placeholder="Legend Name"
      />
    </div>
  );
}
