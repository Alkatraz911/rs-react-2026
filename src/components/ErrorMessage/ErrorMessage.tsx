
interface Props {
  message: string;
}

function ErrorMessage({
  message,
}: Props) {
  return (
    <div data-testid="error-message">
      {message}
    </div>
  );
}

export default ErrorMessage;

