import { useState } from "react";
import { GlobalHeader } from "./core/GlobalHeader/GlobalHeader"
import type { CodeOption } from "./core/GlobalHeader/CodeChange";
import { RawApiOutputView } from "./core/views/Raw";
import { DataTableView } from "./core/views/Packages";

function App() {
    const [currentCodeOption, setCurrentCodeOption] = useState<CodeOption>('table');
    const handleCodeOptionChange = (selectedOption: CodeOption) => {
        setCurrentCodeOption(selectedOption);
    };

    const renderContentBlock = () => {
        switch (currentCodeOption) {
            case 'table':
                return <DataTableView />;
            case 'raw-output':
                return <RawApiOutputView />;
            default:
                return null;
        }
    };

    return (
        <main className="container-large">
            <h1 className="visuallyhidden">Sourcing Trust | Challange</h1>
            <GlobalHeader
                selectedCodeOption={currentCodeOption}
                onCodeOptionChange={handleCodeOptionChange}
            />
            {renderContentBlock()}
        </main>
    )
}

export default App

