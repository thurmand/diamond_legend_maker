import { ProjectName } from "../projectName";

export const PageHeader = ({
  projectName,
  onChangeName,
  children,
  className,
  title,
}) => (
  <>
    <h1 className="font-bold text-2xl">{title}</h1>
    <p className="text-gray-800">
      Create and print your own Diamond Painting legend. Organize drills your
      way.
    </p>
    <div className={className}>
      <div>
        <ProjectName
          onChange={({ target }) => {
            onChangeName(target.value);
          }}
          value={projectName}
        />
      </div>
      {children}
    </div>
  </>
);
