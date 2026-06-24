import '../css/tabs.css';
import { useTheme } from '../contexts/ThemeContext';

interface TabOption {
    value: string;
    label: string;
}

interface TabsProps {
    tabs: TabOption[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function Tabs({
    tabs,
    activeTab,
    onTabChange,
}: TabsProps) {
    const { theme } = useTheme();

    return (
        <div className="tabs-container">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    className={`tab-button ${
                        activeTab === tab.value
                            ? theme === 'dark'
                                ? 'tab-active-dark'
                                : 'tab-active-light'
                            : theme === 'dark'
                              ? 'tab-inactive-dark'
                              : 'tab-inactive-light'
                    }`}
                    onClick={() => onTabChange(tab.value)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}