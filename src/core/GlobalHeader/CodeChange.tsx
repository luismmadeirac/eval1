import { observer } from "mobx-react";
import React from "react";
import { useTranslation } from "../i18n/hooks/use-translation";

export type CodeOption = 'table' | 'raw-output';

interface CodeSelectProps {
    selectedCodeOption: CodeOption;
    onCodeOptionChange: (selectedOption: CodeOption) => void;
}

export const CodeSelect = observer(({ selectedCodeOption, onCodeOptionChange }: CodeSelectProps) => {
    const { t } = useTranslation();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onCodeOptionChange(event.target.value as CodeOption);
    };

    return (
        <select
            id="code-select"
            value={selectedCodeOption}
            onChange={handleChange}
            aria-label={t('code_select_label')}
        >
            <option value="packages">
                {t('option.table')}
            </option>
            <option value="raw-output">
                {t('option.raw_output')}
            </option>
        </select>
    );
});
