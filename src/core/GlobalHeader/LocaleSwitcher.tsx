import type { TLanguage } from "../i18n";
import { observer } from "mobx-react";
import { useTranslation } from "../i18n/hooks/use-translation";

export const LocaleSwitcher = observer(() => {
    const { t, currentLocale, changeLanguage, languages } = useTranslation();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        changeLanguage(event.target.value as TLanguage);
    };

    return (
        <select
            id="language-select"
            value={currentLocale}
            onChange={handleChange}
            aria-label={t('language_select_label')}
        >
            {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                    {lang.label}
                </option>
            ))}
        </select>
    );
});

