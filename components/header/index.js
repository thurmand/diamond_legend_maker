import { ProjectName } from "../projectName";

export const PageHeader = ({
  projectName,
  setProjectName,
  children,
  className,
  title,
}) => (
  <>
    <p className="sm:p-1 font-bold">{title}</p>
    <div className={className}>
      <div>
        <ProjectName
          onChange={({ target }) => {
            setProjectName(target.value);
          }}
          value={projectName}
        />
      </div>
      {children}
    </div>
  </>
);
