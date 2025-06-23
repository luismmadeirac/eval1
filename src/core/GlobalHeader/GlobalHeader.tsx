import { observer } from "mobx-react";
import { useTranslation } from "../i18n/hooks/use-translation";
import "./globalheader.css";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "../theme/ThemeToogle";
import { CodeSelect, type CodeOption } from "./CodeChange"; // Import CodeOption type

interface GlobalHeaderProps {
    selectedCodeOption: CodeOption;
    onCodeOptionChange: (selectedOption: CodeOption) => void;
}

export const GlobalHeader = observer(({ selectedCodeOption, onCodeOptionChange }: GlobalHeaderProps) => {
    const { t } = useTranslation();

    return (
        <div id="sg-header" className="content">
            <div>
                <h3>Sourcing Trust | {t('eval')}</h3>
            </div>
            <div className="right-side gap-5">
                <CodeSelect selectedCodeOption={selectedCodeOption} onCodeOptionChange={onCodeOptionChange} />
                <LocaleSwitcher />
                <ThemeToggle />
            </div>
        </div>
    )
});
