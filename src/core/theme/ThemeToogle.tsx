
export function ThemeToggle() {
    return (
        <button
            className="button button-block no-margins"
            onClick={() => {
                document.body.classList.toggle('theme-dark');
            }}
        >
            Toogle Theme
        </button>
    );
};

