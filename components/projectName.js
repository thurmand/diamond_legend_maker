export function ProjectName({ onChange, value }) {
  return (
    <div className="px-2 my-2">
      <label
        htmlFor="project-name"
        className="block mb-1 text-sm text-gray-800 font-medium"
      >
        Legend Name
      </label>
      <input
        id="project-name"
        type="text"
        className="border-b border-gray-600 text-2xl bg-transparent focus:outline-none focus:border-pink-500"
        onChange={onChange}
        value={value}
        placeholder="Legend Name"
        maxLength="80"
      />
    </div>
  );
}
