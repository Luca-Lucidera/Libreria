type messageProps = { message: string, class: string }

export default function ErrorComponent({ message, class: style } :messageProps ) {
  return <div className={style}>{message}</div>;
}


