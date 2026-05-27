import React from 'react';
import { MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
    { code: 'pl', name: 'Polski', flag: 'poland' },
    { code: 'en', name: 'English', flag: 'united-kingdom' },
];

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    
    const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

    const handleLanguageChange = async (langCode: string) => {
        try {
            await i18n.changeLanguage(langCode);
        }
        catch (error) {
            console.error('❌ Failed to change language:', error);
        }
    };

    return (
        <MDBDropdown>
            <MDBDropdownToggle style={{ cursor: 'pointer' }} tag="a" className="nav-link">
                <i className={`flag flag-${currentLanguage.flag} mx-auto`}></i>
            </MDBDropdownToggle>
            <MDBDropdownMenu>
                {LANGUAGES.map((lang) => (
                    <MDBDropdownItem key={lang.code} onClick={() => handleLanguageChange(lang.code)} link href="#" className={lang.code === i18n.language ? 'active' : ''}>
                        <i className={`flag flag-${lang.flag}`}></i> {lang.name}
                    </MDBDropdownItem>
                ))}
            </MDBDropdownMenu>
        </MDBDropdown>
    );
};
