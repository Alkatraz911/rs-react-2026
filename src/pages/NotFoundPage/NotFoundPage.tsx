import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div className="not-found">
            <h1>404</h1>

            <p>Page not found</p>

            <Link to="/">
                Return to Home
            </Link>
        </div>
    );
}

export default NotFoundPage;