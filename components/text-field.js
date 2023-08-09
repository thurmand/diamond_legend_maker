export default function TextField({ title }) {
  return (
    <div>
      {title}
      <div>
        <input
          onFocus={(event) => event.target.select()}
          class="border"
          type="text"
          name="colorCount"
          maxLength="1"
          value={value}
          onChange={({ target }) => {
            setValue(target.value);
          }}
          onkeydown={onEnter}
        />
      </div>
    </div>
  );
}
