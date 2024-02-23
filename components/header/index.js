import { ProjectName } from "../projectName";

export const PageHeader = ({
  projectName,
  onChangeName,
  children,
  className,
  title,
}) => (
  <>
    <h1 className="font-bold text-xl">{title}</h1>
    <h2>
      Create and print your own Diamond Painting legend. Organize drills your
      way.
    </h2>
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
