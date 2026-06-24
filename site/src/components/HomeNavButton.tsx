import { Link } from 'react-router-dom';

interface NavigationButtonProps {
    to?: string;
    image: string;
    alt: string;
    testId: string;
    className?: string;
    onClick?: () => void;
}

export default function NavigationButton({
    to,
    image,
    alt,
    testId,
    onClick,
}: NavigationButtonProps) {
    const button = (
        <button
            className={`home-navigation-button`}
            data-cy={testId}
            onClick={onClick}
        >
            <img
                src={image}
                alt={alt}
                className="home-navigation-button-icon"
                draggable="false"
            />
        </button>
    );

    return to ? (
        <Link to={to} className="home-navigation-button-link">
            {button}
        </Link>
    ) : (
        button
    );
}