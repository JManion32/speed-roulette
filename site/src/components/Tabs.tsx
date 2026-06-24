import '../css/components/tabs.css';

interface TabOption {
    value: string;
    label: string;
}

interface TabsProps {
    tabs: TabOption[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
    return (
        <div className="tabs-container">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    className={`tab-button ${activeTab === tab.value ? 'tab-active' : 'tab-inactive'}`}
                    onClick={() => onTabChange(tab.value)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
