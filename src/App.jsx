import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// ReactDOM ist nur für die Root-Erstellung in der Haupt-App erforderlich, nicht für die Print-Funktion
// import ReactDOM from 'react-dom/client';

// Konstanten für den Inhalt des Hilfe-Modals
const HELP_STEP_2_CONTENT = `
    <h3 class="text-xl font-semibold mb-4 text-gray-800">CSV-Dateien herunterladen & importieren</h3>
    <p class="mb-4 text-gray-700">
        Um Essensdaten in diese App zu bekommen, benötigst du eine CSV-Datei.
        Diese musst du aus einer Nachricht der <strong>Stayinformed App</strong> exportieren.
        <br/><br/><strong>Nachricht erstellen:</strong>
        <ul class="list-disc list-inside mb-6 text-gray-700">
        <li>Erstelle eine <strong>Nachricht mit Rückmeldung</strong>.</li>
        <li>Gib Rückmeldeoptionen bestehend aus Wochentag + Menüname an (z.B. "Montag Menü 1").</li>
        <li>Konfiguriere den Rest und erstelle die Nachricht.</li>
        </ul>
        <strong>CSV exportieren:</strong>
        <ul class="list-disc list-inside mb-6 text-gray-700">
        <li>Klicke bei der Nachricht von der du die Bestellungen herunterladen willst auf das Icon mit den <strong>3 Strichen</strong> (Rechts neben dem Stift icon).</li>
        <li>Klicke nun oben links auf <strong>Alle Rückmeldungen exportieren</strong>.</li>
        <li>Wähle jetzt <strong>Exportieren als CSV-Datei</strong> und unter "Filtern nach Gruppen" <strong>Alle auswählen aus</strong>.</li>
        <li>Klicke auf <strong>Exportieren</strong>.</li>
        </ul>
        <strong>CSV importieren:</strong>
        <ul class="list-disc list-inside mb-6 text-gray-700">
        <li>Klicke auf das <strong><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block -mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 4v7h7v2h-7v7h-2v-7H4v-2h7V4h2Z"/></svg> Symbol</strong> unten rechts.</li>
        <li>Wähle in der Liste die zu importierende Woche aus.</li>
        <li>Klicke auf <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block -mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 4v7h7v2h-7v7h-2v-7H4v-2h7V4h2Z"/></svg><strong>CSV-Datei auswählen und importieren</strong>.</li>
        <li>wähle im Explorer jetzt die vorhin heruntergeladene CSV Datei.</li>
        </ul>
        Die App versucht automatisch, die Spalten zu erkennen.
    </p>
`;

const HELP_STEP_3_CONTENT = `
    <h3 class="text-xl font-semibold mb-4 text-gray-800">Einstellungen anpassen</h3>
    <p class="mb-4 text-gray-700">
        Über das Zahnrad-Symbol (<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block -mt-1" viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.09-.73-1.72-.98l-.37-2.65c-.06-.24-.27-.42-.52-.42h-4c-.25 0-.46.18-.52.42l-.37 2.65c-.63.25-1.2.58-1.72.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.09.73 1.72.98l.37 2.65c.06.24.27.42.52.42h4c.25 0 .46-.18.52-.42l.37-2.65c.63-.25 1.2-.58 1.72-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>) am unteren rechten Rand kannst du die App-Einstellungen anpassen. Dort kannst du:
    </p>
    <ul class="list-disc list-inside mb-6 text-gray-700">
        <li>Den Preis pro Essen festlegen.</li>
        <li>Die Spaltenzuordnung für deine CSV-Dateien überprüfen und anpassen, falls die automatische Erkennung nicht korrekt war.</li>
        <li>Farben für verschiedene Gruppen und Menüs festlegen, um die Übersichtlichkeit zu erhöhen.</li>
        <li>Daten exportieren und importieren (Backup/Wiederherstellung).</li>
        <li>Die automatische Speicherung deiner Daten in einer verknüpften Datei aktivieren oder deaktivieren.</li>
    </ul>
    <p class="text-gray-700">
        Viel Erfolg bei der Essensplanung!
    </p>
`;

// Definierte Farben für die Farbauswahl (500er-Töne)
const predefinedColors = [
    '#F44336', // Red 500
    '#E91E63', // Pink 500
    '#9C27B0', // Purple 500
    '#673AB7', // Deep Purple 500

    '#3F51B5', // Indigo 500
    '#2196F3', // Blue 500
    '#03A9F4', // Light Blue 500
    '#00BCD4', // Cyan 500

    '#009688', // Teal 500
    '#4CAF50', // Green 500
    '#8BC34A', // Light Green 500
    '#CDDC39', // Lime 500

    '#FFEB3B', // Yellow 500
    '#FFC107', // Amber 500
    '#FF9800', // Orange 500
    '#FF5722'  // Deep Orange 500
];

// Hilfsfunktion zur Bestimmung der Kontrastfarbe (weiß oder schwarz) für besseren Text auf Farbfeldern
const getContrastColor = (hexColor) => {
    if (!hexColor || hexColor.toLowerCase() === 'transparent') return '#000000'; // Standardmäßig schwarz, wenn keine Farbe angegeben oder transparent

    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Luminanz berechnen
    // Formel: (0.299 * R + 0.587 * G + 0.114 * B) / 255;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Schwellenwert für die Textfarbe
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// Hilfsfunktion zum Konvertieren von Hex in RGB
function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    // Behandle 3-stellige Hex-Werte
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
    }
    return [r, g, b];
}

// Hilfsfunktion zum Konvertieren von RGB in Hex
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0')}`;
}

// Funktion zum Mischen einer Hex-Farbe mit Weiß
// mixPercentage: 0-100, wobei 0 die Originalfarbe ist, 100 reines Weiß
function mixHexColorWithWhite(hexColor, mixPercentage) {
    if (!hexColor || hexColor.toLowerCase() === 'transparent') {
        return 'transparent';
    }
    const [r, g, b] = hexToRgb(hexColor);
    const mixRatio = mixPercentage / 100; // Dies ist der Anteil an Weiß

    // Berechnung, um den gewünschten Anteil an Originalfarbe und Weiß zu erreichen
    const newR = Math.round(r * (1 - mixRatio) + 255 * mixRatio);
    const newG = Math.round(g * (1 - mixRatio) + 255 * mixRatio);
    const newB = Math.round(b * (1 - mixRatio) + 255 * mixRatio);

    return rgbToHex(newR, newG, newB);
}


// Konstante für Wochentage, außerhalb von Funktionen definiert, damit sie global zugänglich ist
const daysOfWeek = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag']; // Begrenzt auf Werktage für Essensplanung

// Globale Hilfsfunktionen für Berechnungen (jetzt außerhalb der App-Komponente definiert)
const calculateTotalOrdersPure = (childEntry, corrections, daysOfWeekParam) => {
    let total = 0;
    daysOfWeekParam.forEach(day => {
        const originalMenu = childEntry.dailyMeals[day]?.originalMenu || '';
        const correction = corrections?.[childEntry.group]?.[childEntry.name]?.[day];

        let finalOrderValue;
        if (correction !== undefined) {
            if (correction.toLowerCase() === 'x') {
                finalOrderValue = '';
            } else {
                finalOrderValue = correction;
            }
        } else {
            finalOrderValue = originalMenu;
        }

        if (finalOrderValue && finalOrderValue !== 'x') {
            total++;
        }
    });
    return total;
};

const calculateDailyMenuSummariesPure = (groupChildren, daysOfWeekParam, correctionsParam) => {
    const dailySummaries = {};
    daysOfWeekParam.forEach(day => {
        dailySummaries[day] = {};
    });

    groupChildren.forEach(childEntry => {
        daysOfWeekParam.forEach(day => {
            const originalMenu = childEntry.dailyMeals[day]?.originalMenu || '';
            const correction = correctionsParam?.[childEntry.group]?.[childEntry.name]?.[day];

            let finalOrderValue;
            if (correction !== undefined) {
                if (correction.toLowerCase() === 'x') {
                    finalOrderValue = '';
                } else {
                    finalOrderValue = correction;
                }
            } else {
                finalOrderValue = originalMenu;
            }

            if (finalOrderValue && finalOrderValue !== 'x') {
                if (!dailySummaries[day][finalOrderValue]) {
                    dailySummaries[day][finalOrderValue] = 0;
                }
                dailySummaries[day][finalOrderValue]++;
            }
        });
    });
    return dailySummaries;
};

const calculateGroupTotalMealsPure = (dailySummaries) => {
    let total = 0;
    Object.values(dailySummaries).forEach(daySummary => {
        Object.values(daySummary).forEach(count => {
            total += count;
        });
    });
    return total;
};

const getEffectiveMenuForPrintPure = (childEntry, day, corrections) => {
    const originalMenu = childEntry.dailyMeals[day]?.originalMenu || '';
    const correction = corrections?.[childEntry.group]?.[childEntry.name]?.[day];
    if (correction !== undefined) {
        return correction.toLowerCase() === 'x' ? 'Abbestellt' : correction;
    }
    return originalMenu;
};

const getAllUniqueMenusInWeekPure = (currentMealsData, currentCorrections, daysOfWeekParam) => {
    const uniqueMenus = new Set();
    Object.values(currentMealsData).forEach(groupData => {
        Object.values(groupData).forEach(childEntry => {
            daysOfWeekParam.forEach(day => {
                const effectiveMenu = getEffectiveMenuForPrintPure(childEntry, day, currentCorrections);
                if (effectiveMenu && effectiveMenu !== 'Abbestellt') {
                    uniqueMenus.add(effectiveMenu);
                }
            });
        });
    });
    return Array.from(uniqueMenus).sort();
};

// Globale Hilfsfunktionen für die monatlichen Berechnungen
const getDaysInMonth = (year, monthIndex) => {
    const date = new Date(year, monthIndex, 1);
    const days = [];
    while (date.getMonth() === monthIndex) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
};

// Reine Funktion zur Ermittlung des effektiven Menüs für jeden Tag (wird in monatlichen Berechnungen verwendet)
const getEffectiveMenuForMonthlyCalculationPure = (childEntry, day, corrections) => {
    const originalMenu = childEntry.dailyMeals[day]?.originalMenu || '';
    const correction = corrections?.[childEntry.group]?.[childEntry.name]?.[day];
    if (correction !== undefined) {
        return correction.toLowerCase() === 'x' ? '' : correction; // 'x' bedeutet keine Mahlzeit
    }
    return originalMenu;
};

// Monatliche Zusammenfassung für Kinder berechnen
const calculateMonthlyChildSummary = (allWeeklyMealsData, targetYear, targetMonthIndex, pricePerMeal) => {
    const childSummary = {};

    // Alle Tage im Zielmonat abrufen
    const daysInTargetMonth = getDaysInMonth(targetYear, targetMonthIndex);
    const targetMonthStart = new Date(targetYear, targetMonthIndex, 1).getTime();
    const targetMonthEnd = new Date(targetYear, targetMonthIndex + 1, 0, 23, 59, 59, 999).getTime();

    Object.entries(allWeeklyMealsData).forEach(([weekIso, weekData]) => {
        const mondayOfWeek = new Date(weekIso);
        // Prüfen, ob diese Woche innerhalb des Zielmonats liegt oder sich wesentlich damit überschneidet
        const weekEnd = new Date(mondayOfWeek);
        weekEnd.setDate(mondayOfWeek.getDate() + 6); // Sonntag der Woche

        if (weekEnd.getTime() < targetMonthStart || mondayOfWeek.getTime() > targetMonthEnd) {
            return; // Überspringen, wenn die Woche komplett außerhalb des Monats liegt
        }

        const mealsForWeek = weekData.meals || {};
        const correctionsForWeek = weekData.corrections || {};

        Object.values(mealsForWeek).forEach(groupEntry => {
            Object.values(groupEntry).forEach(childEntry => {
                if (!childSummary[childEntry.name]) {
                    childSummary[childEntry.name] = {
                        name: childEntry.name,
                        group: childEntry.group, // Gruppe bleibt in der Datenstruktur, aber nicht mehr in der Tabelle angezeigt
                        parentLastName: childEntry.parentLastName, // Nachname der Eltern hinzufügen
                        totalMeals: 0,
                        totalCost: 0
                    };
                }

                daysInTargetMonth.forEach(dayInMonth => {
                    // Prüfen, ob dieser Tag ein Wochentag ist (Montag bis Freitag)
                    const dayOfWeekNum = dayInMonth.getDay(); // 0 = Sonntag, 1 = Montag, ..., 6 = Samstag
                    if (dayOfWeekNum >= 1 && dayOfWeekNum <= 5) { // Nur Montag bis Freitag
                        // Den Montag der Woche für diesen spezifischen dayInMonth finden
                        const mondayOfCurrentDayWeek = new Date(dayInMonth);
                        mondayOfCurrentDayWeek.setDate(dayInMonth.getDate() - (dayOfWeekNum === 0 ? 6 : dayOfWeekNum - 1));
                        mondayOfCurrentDayWeek.setHours(0, 0, 0, 0);

                        // Wenn der Montag dieser Tageswoche mit der weekIso der aktuellen Schleife übereinstimmt,
                        // und der Tag einer der `daysOfWeek` ist (Montag-Freitag)
                        if (mondayOfCurrentDayWeek.toISOString() === weekIso) {
                            const dayName = daysOfWeek[dayOfWeekNum - 1]; // Konvertiere 1=Mo zu 'Montag' usw.

                            const effectiveMenu = getEffectiveMenuForMonthlyCalculationPure(childEntry, dayName, correctionsForWeek);
                            if (effectiveMenu) { // Wenn eine Mahlzeit bestellt wird (nicht leer und nicht 'x')
                                childSummary[childEntry.name].totalMeals++;
                            }
                        }
                    }
                });
            });
        });
    });

    Object.values(childSummary).forEach(summary => {
        summary.totalCost = summary.totalMeals * pricePerMeal;
    });

    // Default sort is by parentLastName, then child name (Vorname Nachname)
    return Object.values(childSummary).sort((a, b) => {
        const parentLastNameA = a.parentLastName || '';
        const parentLastNameB = b.parentLastName || '';
        const nameA = a.name || '';
        const nameB = b.name || '';

        if (parentLastNameA.localeCompare(parentLastNameB) !== 0) {
            return parentLastNameA.localeCompare(parentLastNameB);
        }
        return nameA.localeCompare(b.name);
    }); // Korrigiert: Fehlende '}' hinzugefügt
};

// Funktion zum Abrufen aller einzigartigen Menüs über alle Daten hinweg für die Caterer-Zusammenfassung
const getAllUniqueMenusAcrossAllData = (allWeeklyMealsData) => {
    const uniqueMenus = new Set();
    Object.values(allWeeklyMealsData).forEach(weeklyData => {
        Object.values(weeklyData.meals || {}).forEach(groupData => {
            Object.values(groupData).forEach(childEntry => {
                daysOfWeek.forEach(day => {
                    const originalMenu = childEntry.dailyMeals[day]?.originalMenu;
                    const correction = weeklyData.corrections?.[childEntry.group]?.[childEntry.name]?.[day];
                    let effectiveMenu = originalMenu;
                    if (correction !== undefined) {
                        effectiveMenu = correction.toLowerCase() === 'x' ? '' : correction;
                    }
                    if (effectiveMenu && effectiveMenu !== 'Abbestellt') {
                        uniqueMenus.add(effectiveMenu);
                    }
                });
            });
        });
    });
    return Array.from(uniqueMenus).sort();
};


// Monatliche Caterer-Zusammenfassung berechnen
const calculateMonthlyCatererSummary = (allWeeklyMealsData, targetYear, targetMonthIndex) => {
    const dailyCatererSummary = {}; // { 'JJJJ-MM-TT': { 'MenüName': Anzahl, ... }, ... }
    const uniqueMenus = new Set();


    Object.entries(allWeeklyMealsData).forEach(([weekIso, weekData]) => {
        // mondayOfWeek repräsentiert den Montag der Woche, in *lokaler* Zeit, um Mitternacht.
        const mondayOfWeek = new Date(weekIso);


        const mealsForWeek = weekData.meals || {};
        const correctionsForWeek = weekData.corrections || {};

        // Über jeden Tag innerhalb dieser spezifischen Woche iterieren (Montag bis Freitag)
        for (let i = 0; i < 5; i++) {
            const currentDay = new Date(mondayOfWeek); // Erstelle ein neues Date-Objekt basierend auf dem lokalen Montag
            currentDay.setDate(mondayOfWeek.getDate() + i); // Zum spezifischen Wochentag vorrücken

            // Dies ist die entscheidende Prüfung: Liegt dieser spezifische Wochentag innerhalb des Zielmonats und -jahres?

            if (currentDay.getMonth() === targetMonthIndex && currentDay.getFullYear() === targetYear) {
                // Den ISO-ähnlichen Jamboree-MM-TT-String aus den LOKALEN Komponenten von currentDay erstellen
                const dayIsoString = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, '0')}-${String(currentDay.getDate()).padStart(2, '0')}`;


                if (!dailyCatererSummary[dayIsoString]) {
                    dailyCatererSummary[dayIsoString] = {};
                }

                const dayName = daysOfWeek[i]; // 'Montag', 'Dienstag', etc.

                Object.values(mealsForWeek).forEach(groupEntry => {
                    Object.values(groupEntry).forEach(childEntry => {
                        const effectiveMenu = getEffectiveMenuForMonthlyCalculationPure(childEntry, dayName, correctionsForWeek);
                        if (effectiveMenu) {
                            if (!dailyCatererSummary[dayIsoString][effectiveMenu]) {
                                dailyCatererSummary[dayIsoString][effectiveMenu] = 0;
                            }
                            dailyCatererSummary[dayIsoString][effectiveMenu]++;
                            uniqueMenus.add(effectiveMenu);
                        }
                    });
                });
            }
        }
    });

    const sortedDates = Array.from(Object.keys(dailyCatererSummary)).sort();
    const sortedMenus = Array.from(uniqueMenus).sort();


    return { dailyCatererSummary, sortedDates, sortedMenus };
};

// Modal Komponente (Verschoben nach oben)
const Modal = ({ show, onClose, title, children }) => {
    const modalContentRef = useRef(null);

    useEffect(() => {
        if (!show) return;

        const handleClickOutside = (event) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, onClose]);

    if (!show) return null;

    return (
        // Added py-4 to give vertical padding to the overlay container
        // Z-index higher than Toast message for Modals themselves
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[900] py-4">
            {/* max-h-full to ensure it uses available height, overflow-y-auto for scrollability */}
            <div ref={modalContentRef} className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full relative max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};


// PrintOptionsModal Komponente entfernt, da sie nicht mehr benötigt wird.


const HomePage = () => {
    return (
        <div className="p-4 space-y-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Willkommen zum Kindergarten Essensplaner!</h2>
            <p className="mb-6 text-center text-gray-700">
                Navigiere zum Tab "Woche", um den Essensplan zu sehen.
                Importiere neue Daten über den '+' Button unten rechts oder passe die Einstellungen über das Zahnrad-Symbol an.
            </p>
        </div>
    );
};


const SettingsPage = ({ settings, saveSettings, csvData, showToast, allWeeklyMealsData, setAllWeeklyMealsData, fileHandle, setFileHandle, autoSaveEnabled, setAutoSaveEnabled, handleJsonImportAppLevel, reprocessAllMealsData }) => {
    const [currentSettings, setCurrentSettings] = useState(settings);
    const csvHeaders = csvData.length > 0 ? csvData[0] : [];
    const [showGroupColorPicker, setShowGroupColorPicker] = useState({});
    const [showMenuColorPicker, setShowMenuColorPicker] = useState({}); // Corrected: useState for showMenuColorPicker
    const jsonImportInputRef = useRef(null); // Ref for the file input for JSON import fallback

    // Refs für die Farbwähler-Container
    const groupColorPickerRefs = useRef({});
    const menuColorPickerRefs = useRef({});


    // Effect zum Synchronisieren des lokalen Zustands mit den Props
    useEffect(() => {
        setCurrentSettings(settings);
    }, [settings]);


    // Funktion zum Sammeln aller einzigartigen Menünamen über alle Wochen hinweg
    const getAllUniqueMenusFromAllWeeks = useCallback(() => {
        const uniqueMenus = new Set();
        Object.values(allWeeklyMealsData).forEach(weeklyData => {
            // weeklyData ist jetzt { meals: {...}, corrections: {...} }
            Object.values(weeklyData.meals || {}).forEach(groupData => { // Zugriff auf weeklyData.meals
                Object.values(groupData).forEach(childEntry => {
                    daysOfWeek.forEach(day => {
                        if (childEntry.dailyMeals && childEntry.dailyMeals[day]?.originalMenu) {
                            uniqueMenus.add(childEntry.dailyMeals[day].originalMenu);
                        }
                    });
                });
            });
        });
        return Array.from(uniqueMenus).sort();
    }, [allWeeklyMealsData]);

    const uniqueMenus = getAllUniqueMenusFromAllWeeks();

    // Determine which groups to display in the settings, considering both persisted and newly imported groups
    const groupsToDisplay = useMemo(() => {
        const groups = new Set();
        // Add groups from settings (persisted colors)
        Object.keys(settings.groupColors).forEach(group => groups.add(group));
        // Add groups from current CSV data if available (for new imports)
        if (csvData.length > 0 && settings.columnMappings.groupName) {
            const groupColIndex = csvData[0].indexOf(settings.columnMappings.groupName);
            if (groupColIndex !== -1) {
                csvData.slice(1).forEach(row => {
                    if (row[groupColIndex]) {
                        groups.add(row[groupColIndex].trim());
                    }
                });
            }
        }
        return Array.from(groups).sort();
    }, [settings.groupColors, csvData, settings.columnMappings.groupName]);


    // Handler für allgemeine Einstellungsänderungen (jetzt nur für Textfelder und Selects, Slider direkt aktualisiert)
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'pricePerMeal') {
            saveSettings({ ...settings, [name]: parseFloat(value) || 0 }); // Globales Einstellungen direkt aktualisieren
        } else if (name.startsWith('columnMappings.')) {
            const key = name.split('.')[1];
            const updatedMappings = { ...settings.columnMappings, [key]: value };
            saveSettings({ ...settings, columnMappings: updatedMappings }); // Globales Einstellungen direkt aktualisieren
        } else {
            saveSettings({ ...settings, [name]: value }); // Globales Einstellungen direkt aktualisieren
        }
    };

    // Handler für die Änderung des Slider-Werts (aktualisiert den lokalen Zustand für reibungsloses Ziehen)
    const handleSliderInput = (e) => {
        const { name, value } = e.target;
        const newValue = parseInt(value, 10) || 0;
        setCurrentSettings(prev => ({ ...prev, [name]: newValue }));
    };

    // Handler für das Loslassen des Sliders (aktualisiert den globalen Zustand)
    const handleSliderRelease = (e) => {
        const { name, value } = e.target;
        const newValue = parseInt(value, 10) || 0;
        saveSettings({ ...settings, [name]: newValue });
        showToast('Slider-Einstellung gespeichert!', 'success'); // Optional: Toast anzeigen
    };


    // Handler für Farbe einer Gruppe ändern (jetzt mit Grid und sofortiger Aktualisierung)
    const handleGroupColorChange = (groupName, newColor) => {
        saveSettings({ // Globales Einstellungen sofort aktualisieren
            ...settings,
            groupColors: {
                ...settings.groupColors,
                [groupName]: newColor
            }
        });
        setShowGroupColorPicker(prev => ({ ...prev, [groupName]: false })); // Farbwähler schließen
    };

    // Toggle-Funktion für den Farbwähler einer spezifischen Gruppe
    const toggleGroupColorPicker = (groupName) => {
        setShowGroupColorPicker(prev => {
            const newState = {};
            Object.keys(prev).forEach(key => (newState[key] = false));
            newState[groupName] = !prev[groupName];
            return newState;
        });
        setShowMenuColorPicker({}); // Alle Menü-Farbwähler schließen
    };

    // NEU: Handler für Farbe eines Menüs ändern
    const handleMenuColorChange = (menuName, newColor) => {
        saveSettings({ // Globales Einstellungen sofort aktualisieren
            ...settings,
            menuColors: {
                ...settings.menuColors,
                [menuName]: newColor
            }
        });
        setShowMenuColorPicker(prev => ({ ...prev, [menuName]: false })); // Farbwähler schließen
    };

    // NEU: Toggle-Funktion für den Farbwähler eines spezifischen Menüs
    const toggleMenuColorPicker = (menuName) => {
        setShowMenuColorPicker(prev => {
            const newState = {};
            Object.keys(prev).forEach(key => (newState[key] = false));
            newState[menuName] = !prev[menuName];
            return newState;
        });
        setShowGroupColorPicker({}); // Alle Gruppen-Farbwähler schließen
    };

    // useEffect für das Schließen der Farbauswahl bei Klicks außerhalb
    useEffect(() => {
        const handleClickOutside = (event) => {
            let clickedInsidePicker = false;

            Object.entries(showGroupColorPicker).forEach(([groupName, isOpen]) => {
                const pickerElement = groupColorPickerRefs.current[groupName];
                if (isOpen && pickerElement && pickerElement.contains(event.target)) {
                    clickedInsidePicker = true;
                }
            });

            Object.entries(showMenuColorPicker).forEach(([menuName, isOpen]) => {
                const pickerElement = menuColorPickerRefs.current[menuName];
                if (isOpen && pickerElement && pickerElement.contains(event.target)) {
                    clickedInsidePicker = true;
                }
            });

            if (!clickedInsidePicker) {
                setShowGroupColorPicker({});
                setShowMenuColorPicker({});
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showGroupColorPicker, showMenuColorPicker]);

    // Hilfsfunktion zur Generierung des dynamischen Dateinamens
    const generateTimestampedFilename = useCallback(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}_${minutes}-${day}_${month}_${year}.essen`;
    }, []);

    // Daten herunterladen (Browser Download) - reiner Backup-Button
    const handleJsonDownload = useCallback(() => {
        try {
            const dataToExport = {
                settings: settings,
                allWeeklyMealsData: allWeeklyMealsData
            };
            const jsonString = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = generateTimestampedFilename(); // Dynamischer Dateiname mit .essen Endung
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Clean up

            showToast('Daten erfolgreich als ESSEN-Datei heruntergeladen!', 'success');
        } catch (error) {
            showToast('Fehler beim Exportieren der Daten als ESSEN-Datei: ' + error.message, 'error');
        }
    }, [settings, allWeeklyMealsData, showToast, generateTimestampedFilename]);

    // **NEU**: Fallback-Import für .essen Dateien (wenn File System Access API nicht unterstützt wird)
    const handleFallbackJsonImport = useCallback(async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const jsonString = e.target.result;
                    const importedData = JSON.parse(jsonString);
                    if (importedData.settings && importedData.allWeeklyMealsData) {
                        saveSettings(importedData.settings);
                        setAllWeeklyMealsData(importedData.allWeeklyMealsData);
                        setFileHandle(null); // No file handle when using fallback
                        setAutoSaveEnabled(false);
                        showToast('Daten erfolgreich aus ESSEN-Datei importiert (manuell)!', 'success');
                    } else {
                        showToast('Ungültiges Dateiformat. Erwartete Struktur: { settings: ..., allWeeklyMealsData: ... }', 'error');
                    }
                } catch (error) {
                    showToast('Fehler beim Importieren der ESSEN-Daten: ' + error.message, 'error');
                }
            };
            reader.onerror = () => {
                showToast('Fehler beim Lesen der Datei.', 'error');
            };
            reader.readAsText(file);
        } else {
            showToast('Keine Datei ausgewählt.', 'error');
        }
        // Clear the input value so the same file can be selected again
        if (event.target) {
            event.target.value = '';
        }
    }, [saveSettings, setAllWeeklyMealsData, setFileHandle, setAutoSaveEnabled, showToast]);


    // Speicherort auswählen (Speichern unter...) - Initialisiert oder speichert in die verknüpfte Datei
    const handleSaveLocationAndSave = useCallback(async () => {
        if (!('showSaveFilePicker' in window)) {
            showToast('Dein Browser unterstützt diese Funktion nicht (File System Access API).', 'error');
            return;
        }

        try {
            let currentHandle = fileHandle;

            if (!currentHandle) { // If no file handle is currently set, ask the user to pick one
                currentHandle = await window.showSaveFilePicker({
                    suggestedName: generateTimestampedFilename(), // Dynamischer Dateiname mit .essen Endung
                    types: [{
                        description: 'Essensplan-Dateien', // Beschreibung geändert
                        accept: {
                            'application/json': ['.essen'], // Akzeptiert .essen Dateien
                        },
                    }],
                });
                setFileHandle(currentHandle); // Store this new handle
            } else {
                // If a handle exists, ensure we still have write permission
                const permissionStatus = await currentHandle.queryPermission({ mode: 'readwrite' });
                if (permissionStatus === 'denied') {
                    const requestPermission = await currentHandle.requestPermission({ mode: 'readwrite' });
                    if (requestPermission !== 'granted') {
                        showToast('Schreibzugriff auf die verknüpfte Datei wurde verweigert.', 'error');
                        return;
                    }
                } else if (permissionStatus === 'prompt') {
                     // If permission is 'prompt', ask again (user might have revoked or it's a new session)
                     const requestPermission = await currentHandle.requestPermission({ mode: 'readwrite' });
                     if (requestPermission !== 'granted') {
                         showToast('Schreibzugriff auf die verknüpfte Datei wurde verweigert.', 'error');
                         return;
                     }
                }
            }

            // Write data to the file
            const dataToExport = {
                settings: settings,
                allWeeklyMealsData: allWeeklyMealsData
            };
            const jsonString = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });

            const writableStream = await currentHandle.createWritable();
            await writableStream.write(blob);
            await writableStream.close();

            setAutoSaveEnabled(true); // Enable auto-save now that a handle is established
            showToast(`Daten erfolgreich in "${currentHandle.name}" gespeichert und automatische Speicherung aktiviert!`, 'success');
        } catch (error) {
            if (error.name === 'AbortError') {
                showToast('Speichervorgang abgebrochen.', 'info');
            } else {
                showToast('Fehler beim Speichern der Daten: ' + error.message, 'error');
                console.error("Save error:", error);
            }
        }
    }, [settings, allWeeklyMealsData, showToast, fileHandle, setFileHandle, setAutoSaveEnabled, generateTimestampedFilename]);


    return (
        <div className="p-4 bg-white rounded-lg shadow-md space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Preis pro Essen */}
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Preis pro Essen</h3>
                    <div>
                        <label htmlFor="pricePerMeal" className="block text-sm font-medium text-gray-700">
                            Preis pro Essen (€)
                        </label>
                        <input
                            type="number"
                            id="pricePerMeal"
                            name="pricePerMeal"
                            value={currentSettings.pricePerMeal}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                    </div>
                </div>

                {/* Spaltenzuordnung */}
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">CSV-Spaltenzuordnung</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Wähle die entsprechenden Spalten aus der importierten CSV-Datei aus.
                        Die Optionen basieren auf dem Header der zuletzt geladenen CSV-Datei.
                        Spalten werden, wenn möglich, automatisch zugewiesen.
                    </p>
                    <div className="grid grid-cols-1 gap-4"> {/* Nested grid for column mappings */}
                        <div className="col-span-1">
                            <label htmlFor="childNameCol" className="block text-sm font-medium text-gray-700">
                                Spalte 'Name des Kindes'
                            </label>
                            <select
                                id="childNameCol"
                                name="columnMappings.childName"
                                value={currentSettings.columnMappings.childName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            >
                                <option value="">-- Auswählen --</option>
                                {csvHeaders.map((header, index) => (
                                    <option key={index} value={header}>{header}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-1">
                            <label htmlFor="groupNameCol" className="block text-sm font-medium text-gray-700">
                                Spalte 'Gruppe'
                            </label>
                            <select
                                id="groupNameCol"
                                name="columnMappings.groupName"
                                value={currentSettings.columnMappings.groupName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            >
                                <option value="">-- Auswählen --</option>
                                {csvHeaders.map((header, index) => (
                                    <option key={index} value={header}>{header}</option>
                                ))}
                            </select>
                        </div>
                        {/* NEU: Spalte für Nachname Eltern */}
                        <div className="col-span-1">
                            <label htmlFor="parentLastNameCol" className="block text-sm font-medium text-gray-700">
                                Spalte 'Nachname Eltern'
                            </label>
                            <select
                                id="parentLastNameCol"
                                name="columnMappings.parentLastName"
                                value={currentSettings.columnMappings.parentLastName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            >
                                <option value="">-- Auswählen --</option>
                                {csvHeaders.map((header, index) => (
                                    <option key={index} value={header}>{header}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Automatisch erkannte Essensspalten:</p>
                        {currentSettings.columnMappings.mealQuestionColumns.length > 0 ? (
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {currentSettings.columnMappings.mealQuestionColumns.map((col, index) => (
                                    <li key={index}>{col} / {currentSettings.columnMappings.mealAnswerColumns[index]}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">Keine Essensspalten automatisch erkannt. Bitte stelle sicher, dass die CSV-Header dem Muster "FRAGE X" und "ANTWORT X" entsprechen.</p>
                        )}
                    </div>
                    {/* NEU: Button zum Neuverarbeiten der Daten - hierher verschoben */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={reprocessAllMealsData}
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 flex items-center justify-center text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 4V1l-4 4 4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.01 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8V23l4-4-4-4v3z"/>
                            </svg>
                            Daten neu verarbeiten
                        </button>
                    </div>
                </div>
            </div> {/* End of grid for price and column mapping */}


            {/* Gruppenverwaltung & Menüfarben - Angezeigt, wenn Gruppen oder Menüs vorhanden sind */}
            {(groupsToDisplay.length > 0 || uniqueMenus.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">Gruppenfarben</h3>
                        {/* Slider für Gruppenfarben */}
                        <div className="mb-4">
                            <label htmlFor="groupColorMixRatio" className="block text-sm font-medium text-gray-700 mb-2">
                                Mischung mit Weiß: <span className="font-bold">{currentSettings.groupColorMixPercentage}%</span> Weiß, <span className="font-bold">{100 - currentSettings.groupColorMixPercentage}%</span> Originalfarbe
                            </label>
                            <input
                                type="range"
                                id="groupColorMixRatio"
                                name="groupColorMixPercentage"
                                min="0"
                                max="100"
                                step="5"
                                value={currentSettings.groupColorMixPercentage}
                                onChange={handleSliderInput} // Aktualisiert den lokalen Zustand für reibungsloses Ziehen
                                onMouseUp={handleSliderRelease} // Aktualisiert den globalen Zustand beim Loslassen der Maus
                                onTouchEnd={handleSliderRelease} // Für Touch-Geräte
                                className="mt-1 block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        {groupsToDisplay.length > 0 ? (
                            <div className="space-y-3">
                                {groupsToDisplay.map(groupName => (
                                    <div key={groupName} className="relative flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-100">
                                        <span
                                            className="font-medium px-2 py-1 rounded-md flex-grow flex justify-between items-center cursor-pointer"
                                            style={{
                                                backgroundColor: settings.groupColors[groupName],
                                                color: getContrastColor(settings.groupColors[groupName])
                                            }}
                                            onClick={() => toggleGroupColorPicker(groupName)}
                                        >
                                            {groupName}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-5 w-5 ml-2 transition-transform duration-200 ${showGroupColorPicker[groupName] ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                        <div className="flex items-center space-x-3">
                                            {showGroupColorPicker[groupName] && (
                                                <div ref={el => groupColorPickerRefs.current[groupName] = el} className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg p-2 right-0 top-full mt-1">
                                                    <div className="grid grid-cols-4 gap-1">
                                                        {predefinedColors.map(pc => (
                                                            <div
                                                                key={pc}
                                                                className={`w-7 h-7 rounded-md cursor-pointer ${
                                                                    settings.groupColors[groupName] === pc ? 'border-2 border-gray-800 shadow-md' : 'border border-gray-300'
                                                                }`}
                                                                style={{ backgroundColor: pc }}
                                                                onClick={() => handleGroupColorChange(groupName, pc)}
                                                                title={pc}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center">Noch keine Gruppen gefunden. Bitte importiere eine CSV-Datei oder stelle sicher, dass die Spalte 'Gruppe' zugewiesen ist.</p>
                        )}
                    </div>

                    {/* NEU: Menüfarben - Nur anzeigen, wenn Menüs gefunden wurden */}
                    <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">Menüfarben</h3>
                        {/* Slider für Menüfarben */}
                        <div className="mb-4">
                            <label htmlFor="menuColorMixRatio" className="block text-sm font-medium text-gray-700 mb-2">
                                Mischung mit Weiß: <span className="font-bold">{currentSettings.menuColorMixPercentage}%</span> Weiß, <span className="font-bold">{100 - currentSettings.menuColorMixPercentage}%</span> Originalfarbe
                            </label>
                            <input
                                type="range"
                                id="menuColorMixRatio"
                                name="menuColorMixPercentage"
                                min="0"
                                max="100"
                                step="5"
                                value={currentSettings.menuColorMixPercentage}
                                onChange={handleSliderInput} // Aktualisiert den lokalen Zustand für reibungsloses Ziehen
                                onMouseUp={handleSliderRelease} // Aktualisiert den globalen Zustand beim Loslassen der Maus
                                onTouchEnd={handleSliderRelease} // Für Touch-Geräte
                                className="mt-1 block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            Weise den Menüs Farben zu, die in der Wochenansicht angezeigt werden.
                        </p>
                        {uniqueMenus.length > 0 ? ( // This is the correct condition to show the list of menus
                            <div className="space-y-3">
                                {uniqueMenus.map(menuName => (
                                    <div key={menuName} className="relative flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-100">
                                        <span
                                            className="font-medium px-2 py-1 rounded-md flex-grow flex justify-between items-center cursor-pointer"
                                            style={{
                                                backgroundColor: settings.menuColors[menuName] || 'transparent',
                                                color: getContrastColor(settings.menuColors[menuName])
                                            }}
                                            onClick={() => toggleMenuColorPicker(menuName)}
                                        >
                                            {menuName}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-5 w-5 ml-2 transition-transform duration-200 ${showMenuColorPicker[menuName] ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                        {showMenuColorPicker[menuName] && (
                                            <div ref={el => menuColorPickerRefs.current[menuName] = el} className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg p-2 right-0 top-full mt-1">
                                                <div className="grid grid-cols-4 gap-1">
                                                            {predefinedColors.map(pc => (
                                                                <div
                                                                    key={pc}
                                                                    className={`w-7 h-7 rounded-md cursor-pointer ${
                                                                        settings.menuColors[menuName] === pc ? 'border-2 border-gray-800 shadow-md' : 'border border-gray-300'
                                                                    }`}
                                                                    style={{ backgroundColor: pc }}
                                                                    onClick={() => handleMenuColorChange(menuName, pc)}
                                                                    title={pc}
                                                            ></div>
                                                        ))}
                                                    </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center">Keine Menüdaten gefunden.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Datenverwaltung Section */}
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-700">Datenverwaltung</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* JSON Import */}
                    <div className="col-span-1 flex flex-col items-center">
                        <input
                            type="file"
                            id="jsonImportFile"
                            accept=".essen"
                            className="hidden"
                            // This onChange handles the fallback for browsers that do not support File System Access API
                            onChange={handleFallbackJsonImport}
                            ref={jsonImportInputRef}
                        />
                        <label
                            htmlFor="jsonImportFile"
                            className={`mt-2 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 flex items-center justify-center cursor-pointer
                                ${'showOpenFilePicker' in window ? '' : 'opacity-50'}`}
                            onClick={() => {
                                if (!('showOpenFilePicker' in window)) {
                                    jsonImportInputRef.current.click(); // Trigger the hidden file input
                                } else {
                                    handleJsonImportAppLevel(); // Use the main App's import function
                                }
                            }}
                            title={!('showOpenFilePicker' in window) ? "Dein Browser unterstützt die erweiterte Dateiintegration nicht." : "Daten von einer .essen Datei importieren"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-2" viewBox="0 0 15 15" fill="currentColor">
                                <path d="M11.78 7.159a.75.75 0 0 0-1.06 0l-1.97 1.97V1.75a.75.75 0 0 0-1.5 0v7.379l-1.97-1.97a.75.75 0 0 0-1.06 1.06l3.25 3.25L8 12l.53-.53l3.25-3.25a.75.75 0 0 0 0-1.061ZM2.5 9.75a.75.75 0 1 0-1.5 0V13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.75a.75.75 0 0 0-1.5 0V13a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V9.75Z"/>
                            </svg>
                            Daten importieren
                        </label>
                        <p className="text-xs text-gray-500 mt-1 text-center">Wähle 2x die selbe .essen Datei um die automatische Speicherung zu aktivieren</p>
                    </div>

                    {/* Save As button (now next to Import) */}
                    <div className="col-span-1 flex flex-col items-center justify-start">
                        <button
                            onClick={handleSaveLocationAndSave}
                            className={`mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 flex items-center justify-center
                                ${'showSaveFilePicker' in window ? '' : 'opacity-50 cursor-not-allowed'}`}
                            disabled={!('showSaveFilePicker' in window)}
                            title={!('showSaveFilePicker' in window) ? "Dein Browser unterstützt diese Funktion nicht" : "Daten direkt auf deinem Computer speichern"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                            </svg>
                            {fileHandle ? "Speichern" : "Speichern unter"}
                        </button>
                        {!fileHandle && (
                            <p className="text-xs text-gray-500 mt-1 text-center">
                                Wähle einen Ort und speichere eine neue Datei mit den aktuellen Daten welche dann automatisch aktualisiert wird
                            </p>
                        )}
                    </div>
                </div>

                {/* Backup Download Button (now centered below) */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleJsonDownload}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-2" viewBox="0 0 15 15" fill="currentColor">
                            <path d="M11.78 5.841a.75.75 0 0 1-1.06 0l-1.97-1.97v7.379a.75.75 0 0 1-1.5 0V3.871l-1.97 1.97a.75.75 0 0 1-1.06-1.06l3.25-3.25L8 1l.53.53l3.25 3.25a.75.75 0 0 1 0 1.061ZM2.5 9.75a.75.75 0 0 0-1.5 0V13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.75a.75.75 0 0 0-1.5 0V13a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V9.75Z"/>
                        </svg>
                        Backup herunterladen
                    </button>
                </div>


                {/* Auto-Save Toggle integrated */}
                <div className="flex items-center mt-6 flex-col sm:flex-row sm:justify-center">
                    <input
                        type="checkbox"
                        id="autoSaveToggle"
                        checked={autoSaveEnabled && !!fileHandle}
                        onChange={() => setAutoSaveEnabled(!autoSaveEnabled && !!fileHandle)}
                        disabled={!fileHandle}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    />
                    <label htmlFor="autoSaveToggle" className={`ml-2 text-gray-700 ${!fileHandle ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        Automatische Speicherung {fileHandle ? `aktiviert für "${fileHandle.name}"` : '(Keine Datei verknüpft)'}
                    </label>
                </div>
                {!fileHandle && <p className="text-sm text-gray-500 mt-1 text-center">Um die automatische Speicherung zu nutzen, musst du zuerst eine Datei über "Daten importieren" oder "Speichern unter" verknüpfen.</p>}
                {fileHandle && autoSaveEnabled && <p className="text-sm text-gray-500 mt-2 text-center">Daten werden automatisch in "{fileHandle.name}" gespeichert, wenn Änderungen vorgenommen werden.</p>}
                {fileHandle && !autoSaveEnabled && <p className="text-sm text-red-500 mt-2 text-center">Automatische Speicherung ist derzeit deaktiviert. Aktiviere die Checkbox, um sie zu starten.</p>}
            </div>
        </div>
    );
};


// Neue Komponente zur Verwaltung der Hauptplaneransicht (Woche oder Monat)
const PlannerView = ({ activeTab, settings, showToast, displayedWeekIso, setDisplayedWeekIso, allWeeklyMealsData, setAllWeeklyMealsData, selectedKindergartenYear, selectedMonthIndex, generateWeeksForYearAndMonth, handlePrint, formatDate, getWeekRange, targetYear, setShowImportModal, handleDeleteWeek, isPrinting, printOptions, allRegisteredMenus, groupSortConfig, setGroupSortConfig, monthlyChildSortConfig, setMonthlyChildSortConfig }) => {
    const fullMonthName = new Date(targetYear, selectedMonthIndex).toLocaleString('de-DE', { month: 'long' });

    // Sortierkonfigurationen werden jetzt von der App-Komponente über Props verwaltet und übergeben.
    // Daher werden die lokalen useState-Definitionen hier entfernt.
    // const [groupSortConfig, setGroupSortConfig] = useState({ key: 'name', direction: 'ascending' }); // ENTFERNT
    // const [monthlyChildSortConfig, setMonthlyChildSortConfig] = useState({ key: 'parentLastName', direction: 'ascending' }); // ENTFERNT

    // Hilfsfunktion zur Anzeige des Sortierindikators
    const getSortIndicator = (currentKey, columnKey, sortConfig) => {
        if (sortConfig.key !== columnKey) return '';
        return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    };

    // Handler für Klick zum Sortieren von Tabellen
    const handleSort = useCallback((columnKey, currentSortConfig, setSortConfig) => {
        // Erlaube Sortier-Klicks nur, wenn NICHT gedruckt wird.
        // Die Sortierlogik in useMemo sollte das Beibehalten der Sortierung während des Drucks übernehmen.
        if (isPrinting) {
            // Im Druckmodus kann die Sortierung nicht geändert werden, zeige nur einen Toast an.
            showToast('Sortierung kann im Druckmodus nicht geändert werden.', 'info');
            return;
        }

        let direction = 'ascending';
        if (currentSortConfig.key === columnKey) {
            if (currentSortConfig.direction === 'ascending') {
                direction = 'descending';
            } else if (currentSortConfig.direction === 'descending') {
                direction = null; // Keine Sortierung
                columnKey = null; // Schlüssel zurücksetzen
            }
        }
        setSortConfig({ key: columnKey, direction: direction });
    }, [isPrinting, showToast]);

    // Die Wochen, die in den aktuell ausgewählten Monat und das Jahr fallen
    const weeksInSelectedMonth = generateWeeksForYearAndMonth(targetYear, selectedMonthIndex);

    // Die Daten für die aktuell angezeigte Woche bestimmen
    const currentWeekDataCombined = allWeeklyMealsData[displayedWeekIso] || { meals: {}, corrections: {} };
    const currentMealsData = currentWeekDataCombined.meals;
    const currentCorrections = currentWeekDataCombined.corrections; // Korrekturen laden

    const groupsInCurrentWeek = Object.keys(currentMealsData).sort();

    // Funktion zur Berechnung der Gesamtbestellungen pro Kind
    const calculateTotalOrders = useCallback((childEntry) => {
        return calculateTotalOrdersPure(childEntry, currentCorrections, daysOfWeek);
    }, [currentCorrections]);

    // Funktion zur Berechnung der täglichen Menü-Zusammenfassungen pro Tag und Gruppe
    const calculateDailyMenuSummaries = useCallback((groupChildren, daysOfWeekParam, correctionsParam) => {
        return calculateDailyMenuSummariesPure(groupChildren, daysOfWeekParam, correctionsParam);
    }, []);

    // Funktion zur Berechnung der Gesamtzahl der Mahlzeiten für eine Gruppe
    const calculateGroupTotalMeals = useCallback((dailySummaries) => {
        return calculateGroupTotalMealsPure(dailySummaries);
    }, []);


    // Verarbeitete Daten für jede Gruppe memoizen, um Neuberechnungen zu verhindern und Stabilität zu gewährleisten
    const memoizedGroupData = useMemo(() => {
        const result = {};
        groupsInCurrentWeek.forEach(groupName => {
            let childrenInGroup = Object.values(currentMealsData[groupName] || {});

            // Sortierung für Kinder innerhalb jeder Gruppe anwenden
            const defaultGroupSortFunction = (a, b) => a.name.localeCompare(b.name);

            if (groupSortConfig.key) { // Wenn eine Sortierkonfiguration gesetzt ist (unabhängig vom Druckmodus)
                childrenInGroup = [...childrenInGroup].sort((a, b) => {
                    let aValue, bValue;
                    if (groupSortConfig.key === 'name') {
                        aValue = a.name;
                        bValue = b.name;
                    } else if (groupSortConfig.key === 'totalMeals') {
                        aValue = calculateTotalOrdersPure(a, currentCorrections, daysOfWeek);
                        bValue = calculateTotalOrdersPure(b, currentCorrections, daysOfWeek);
                    }

                    if (typeof aValue === 'string' && typeof bValue === 'string') {
                        return groupSortConfig.direction === 'ascending' ?
                            aValue.localeCompare(bValue) :
                            bValue.localeCompare(aValue);
                    } else { // Numerische Sortierung
                        return groupSortConfig.direction === 'ascending' ?
                            aValue - bValue :
                            bValue - aValue;
                    }
                });
            } else {
                // Standardmäßige Sortierung nach Name anwenden, wenn keine spezifische Sortierung aktiv ist
                childrenInGroup = [...childrenInGroup].sort(defaultGroupSortFunction);
            }


            const dailyMenuSummaries = calculateDailyMenuSummaries(childrenInGroup, daysOfWeek, currentCorrections);

            if (childrenInGroup.length > 0) {
                const groupTotalMeals = calculateGroupTotalMeals(dailyMenuSummaries);
                result[groupName] = { childrenInGroup, dailyMenuSummaries, groupTotalMeals };
            }
        });
        return result;
    }, [currentMealsData, groupsInCurrentWeek, calculateDailyMenuSummaries, currentCorrections, calculateGroupTotalMeals, groupSortConfig, isPrinting]);


    // Funktion zum Sammeln aller einzigartigen Menünummern für einen bestimmten Tag (innerhalb der aktuellen Woche)
    // NEU: Diese Funktion verwendet jetzt 'allRegisteredMenus'
    const getUniqueMenusForDay = useCallback(() => {
        const options = allRegisteredMenus.map(menu => ({ value: menu, label: menu }));
        options.push({ value: 'x', label: 'Abbestellt' });
        return options;
    }, [allRegisteredMenus]);


    // Menüoptionen für alle Tage vorab berechnen (diese hängen jetzt von allRegisteredMenus ab, nicht mehr von currentMealsData)
    const allMenusByDay = useMemo(() => {
        const menus = {};
        const commonOptions = getUniqueMenusForDay(); // Einmal berechnen
        daysOfWeek.forEach(day => {
            menus[day] = commonOptions; // Dieselben Optionen für jeden Tag
        });
        return menus;
    }, [getUniqueMenusForDay]);


    // Funktion zum Sammeln aller einzigartigen Menünamen über die gesamte Woche (für die Caterer-Tabelle)
    const getAllUniqueMenusInWeek = useCallback(() => {
        return getAllUniqueMenusInWeekPure(currentMealsData, currentCorrections, daysOfWeek);
    }, [currentMealsData, currentCorrections]);

    const allChildrenInCurrentWeek = useMemo(() => {
        return Object.values(currentMealsData).flatMap(groupData => Object.values(groupData));
    }, [currentMealsData]);

    const globalDailyMenuSummaries = useMemo(() => {
        // FIX: Swapped currentCorrections and daysOfWeek to match function signature
        return calculateDailyMenuSummariesPure(allChildrenInCurrentWeek, daysOfWeek, currentCorrections);
    }, [allChildrenInCurrentWeek, currentCorrections, daysOfWeek]);


    // Handler für Änderungen im Menü-Dropdown
    const handleMenuChange = useCallback((groupName, childName, day, value) => {
        setAllWeeklyMealsData(prevAllWeeklyMealsData => {
            const newAllWeeklyMealsData = { ...prevAllWeeklyMealsData };
            const weekEntry = newAllWeeklyMealsData[displayedWeekIso];

            if (!weekEntry) {
                return prevAllWeeklyMealsData;
            }

            // Eine tiefe Kopie der Korrekturen erstellen, um die Unveränderlichkeit zu gewährleisten
            const newCorrections = JSON.parse(JSON.stringify(weekEntry.corrections || {}));

            if (!newCorrections[groupName]) {
                newCorrections[groupName] = {};
            }
            if (!newCorrections[groupName][childName]) {
                newCorrections[groupName][childName] = {};
            }

            const cleanedValue = value.trim();
            if (cleanedValue === '') {
                delete newCorrections[groupName][childName][day];
            } else {
                newCorrections[groupName][childName][day] = cleanedValue;
            }

            // Leere Objekte aufräumen
            if (Object.keys(newCorrections[groupName][childName]).length === 0) {
                delete newCorrections[groupName][childName];
            }
            if (Object.keys(newCorrections[groupName]).length === 0) {
                delete newCorrections[groupName];
            }

            // Das Korrekturen-Objekt für die spezifische Woche aktualisieren
            newAllWeeklyMealsData[displayedWeekIso] = {
                ...weekEntry,
                corrections: newCorrections
            };

            return newAllWeeklyMealsData;
        });
    }, [displayedWeekIso, setAllWeeklyMealsData]);

    // Funktion zum Kopieren der Caterer-Daten in die Zwischenablage (WÖCHENTLICH)
    const handleCopyCatererData = useCallback(() => {
        let contentToCopy = "";

        // Die bereits memoisierten globalDailyMenuSummaries verwenden
        const allUniqueMenus = getAllUniqueMenusInWeekPure(currentMealsData, currentCorrections, daysOfWeek);

        allUniqueMenus.forEach((menuName, index) => {
            let rowValues = [];
            daysOfWeek.forEach(day => {
                const count = globalDailyMenuSummaries[day]?.[menuName] || 0; // Das memoizede verwenden
                rowValues.push(count);
            });
            contentToCopy += rowValues.join('\t') + "\n"; // Datenzeile hinzufügen
            if (index < allUniqueMenus.length - 1) { // Wenn nicht das letzte Menü
                contentToCopy += "\n"; // Eine zusätzliche Leerzeile hinzufügen
            }
        });

        try {
            const textarea = document.createElement('textarea');
            textarea.value = contentToCopy.trim();
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('Zahlen erfolgreich in die Zwischenablage kopiert!', 'success');
        } catch (err) {
            showToast('Fehler beim Kopieren der Zahlen.', 'error');
        }
    }, [currentMealsData, currentCorrections, globalDailyMenuSummaries, showToast]);

    // Monatliche Zusammenfassungsberechnungen für die Monatsansicht
    const monthlyChildSummary = useMemo(() => {
        let summary = calculateMonthlyChildSummary(allWeeklyMealsData, targetYear, selectedMonthIndex, settings.pricePerMeal);

        // Sortierung für die monatliche Kinder-Zusammenfassung anwenden
        const defaultSortFunction = (a, b) => {
            const parentLastNameA = a.parentLastName || '';
            const parentLastNameB = b.parentLastName || '';
            const nameA = a.name || '';
            const nameB = b.name || '';

            if (parentLastNameA.localeCompare(parentLastNameB) !== 0) {
                return parentLastNameA.localeCompare(parentLastNameB);
            }
            return nameA.localeCompare(b.name);
        };

        // Wenn eine Sortierkonfiguration gesetzt ist, diese anwenden, unabhängig vom Druckmodus.
        if (monthlyChildSortConfig.key) {
            summary = [...summary].sort((a, b) => {
                let aValue, bValue;
                switch (monthlyChildSortConfig.key) {
                    case 'name':
                        aValue = a.name; // Sortiere nach originalem Namen
                        bValue = b.name; // Sortiere nach originalem Namen
                        break;
                    case 'parentLastName':
                        aValue = a.parentLastName || ''; // Sicherstellen, dass es ein String für den Vergleich ist
                        bValue = b.parentLastName || '';
                        break;
                    case 'totalMeals':
                        aValue = a.totalMeals;
                        bValue = b.totalMeals;
                        break;
                    case 'totalCost':
                        aValue = a.totalCost;
                        bValue = b.totalCost;
                        break;
                    default:
                        return defaultSortFunction(a, b); // Fallback zur Standardsortierung
                }

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return monthlyChildSortConfig.direction === 'ascending' ?
                        aValue.localeCompare(bValue) :
                        bValue.localeCompare(aValue);
                } else { // Numerische Sortierung
                    return monthlyChildSortConfig.direction === 'ascending' ?
                        aValue - bValue :
                        bValue - aValue;
                }
            });
        } else {
            // Standardmäßige Sortierung anwenden, wenn keine spezifische Sortierung aktiv ist
            summary = [...summary].sort(defaultSortFunction);
        }
        return summary;
    }, [allWeeklyMealsData, targetYear, selectedMonthIndex, settings.pricePerMeal, monthlyChildSortConfig]); // 'isPrinting' wurde aus den Abhängigkeiten entfernt


    const monthlyCatererData = useMemo(() => {
        return calculateMonthlyCatererSummary(allWeeklyMealsData, targetYear, selectedMonthIndex);
    }, [allWeeklyMealsData, targetYear, selectedMonthIndex]);

    const { dailyCatererSummary, sortedDates, sortedMenus } = monthlyCatererData;

    const overallTotalMeals = monthlyChildSummary.reduce((sum, child) => sum + child.totalMeals, 0);
    const overallTotalCost = monthlyChildSummary.reduce((sum, child) => sum + child.totalCost, 0);

    // Funktion zum Kopieren der Caterer-Daten in die Zwischenablage (MONATLICH)
    const handleCopyCatererDataMonthly = useCallback(() => {
        let contentToCopy = ""; // Leere Zeichenkette beginnen, keine Header/Menünamen

        sortedMenus.forEach((menuName, index) => {
            let rowValues = [];
            sortedDates.forEach(date => {
                const count = dailyCatererSummary[date]?.[menuName] || 0;
                rowValues.push(count);
            });
            contentToCopy += rowValues.join('\t') + "\n"; // Datenzeile hinzufügen
            if (index < sortedMenus.length - 1) { // Wenn nicht das letzte Menü
                contentToCopy += "\n"; // Eine zusätzliche Leerzeile hinzufügen
            }
        });

        try {
            const textarea = document.createElement('textarea');
            textarea.value = contentToCopy.trim();
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('Caterer-Monatsdaten erfolgreich in die Zwischenablage kopiert!', 'success');
        } catch (err) {
            showToast('Fehler beim Kopieren der Caterer-Monatsdaten.', 'error');
        }
    }, [dailyCatererSummary, sortedDates, sortedMenus, showToast]);


    return (
        <div className={`p-4 bg-white rounded-lg shadow-md ${isPrinting ? 'print-area' : ''}`}>
            {/* Monthly Title (appears only once at the top for monthly view) */}
            {isPrinting && printOptions?.selectedPrintType === 'monthly' &&
                <h1 className="print-title">{`Monatsübersicht für ${fullMonthName} ${targetYear}`}</h1>
            }

            {/* Wochenansicht (Gruppiert oder Alle Kinder) */}
            {(!isPrinting || printOptions?.selectedPrintType === 'weeklyGrouped') && (activeTab === 'Woche' || isPrinting) && (
                <>
                    {Object.keys(memoizedGroupData).length > 0 ? (
                        Object.keys(memoizedGroupData).sort().map(groupName => {
                            const { childrenInGroup, dailyMenuSummaries, groupTotalMeals } = memoizedGroupData[groupName];

                            const groupColor500 = settings.groupColors[groupName] || '#333333';
                            // Nur den Hintergrund für den umgebenden Div setzen, nicht für die Zellen im Druck
                            const groupBackgroundColor = isPrinting
                                ? (printOptions.selectedPrintType === 'weeklyGrouped' ? mixHexColorWithWhite(groupColor500, settings.groupColorMixPercentage) : 'transparent')
                                : mixHexColorWithWhite(groupColor500, settings.groupColorMixPercentage);
                            const textColor = getContrastColor(groupBackgroundColor); // Text color determined by background

                            // Border color for the group table wrapper
                            const groupBorderColor = isPrinting && printOptions.selectedPrintType === 'weeklyGrouped'
                                ? groupColor500
                                : '#e5e7eb'; // Default border color for app view

                            return (
                                <div key={groupName} className={`mb-8 p-4 rounded-lg shadow-sm ${isPrinting ? 'group-table-print' : ''}`}
                                    style={{
                                        backgroundColor: groupBackgroundColor,
                                        borderColor: groupBorderColor, // Apply dynamic border color here
                                        borderWidth: '1px',
                                        borderStyle: 'solid'
                                    }}
                                >
                                    {/* Weekly Title (appears for each group in weeklyGrouped print) */}
                                    {isPrinting && printOptions?.selectedPrintType === 'weeklyGrouped' &&
                                        <h1 className="print-title print-title-weekly" style={{ color: getContrastColor(groupBackgroundColor) }}>{`Essensplan für Woche ${getWeekRange(new Date(displayedWeekIso))}`}</h1>
                                    }
                                    <h3 className="text-xl font-semibold mb-4" style={{ color: textColor }}>
                                        Gruppe: {groupName}
                                    </h3>
                                    <div className="overflow-x-auto rounded-xl shadow-inner border border-[#e5e7eb] print-table-wrapper">
                                        <table className="min-w-full bg-white border-collapse">
                                            <thead>
                                                <tr>
                                                    <th
                                                        key="name-header"
                                                        className={`px-3 py-2 border border-[#e5e7eb] text-left text-gray-700 ${!isPrinting ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                                                        onClick={() => handleSort('name', groupSortConfig, setGroupSortConfig)}
                                                    >
                                                        Name{!isPrinting && getSortIndicator('name', 'name', groupSortConfig)}
                                                    </th>
                                                    {daysOfWeek.map(day => (
                                                        <th key={day} className="px-3 py-2 border border-[#e5e7eb] text-center text-gray-700">{day}</th>
                                                    ))}
                                                    <th
                                                        key="total-header"
                                                        className={`px-3 py-2 border border-[#e5e7eb] text-center text-gray-700 ${!isPrinting ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                                                        onClick={() => handleSort('totalMeals', groupSortConfig, setGroupSortConfig)}
                                                    >
                                                        Gesamt{!isPrinting && getSortIndicator('totalMeals', 'totalMeals', groupSortConfig)}
                                                    </th>
                                                </tr>
                                            </thead><tbody>
                                                {childrenInGroup.map((childEntry, childIdx) => (
                                                    <tr key={childIdx} className="odd:bg-gray-50 hover:bg-gray-100">
                                                        <td key={`${childIdx}-name`} className="px-3 py-2 border border-[#e5e7eb] font-medium text-gray-800">{childEntry.name}</td>
                                                        {daysOfWeek.map(day => {
                                                            const originalMenu = childEntry.dailyMeals[day]?.originalMenu || '';
                                                            const currentCorrection = currentCorrections?.[groupName]?.[childEntry.name]?.[day];

                                                            let effectiveSelectValue;
                                                            if (currentCorrection !== undefined) {
                                                                effectiveSelectValue = currentCorrection;
                                                                // Check if it's an 'x' from a correction, and the original was not 'x' or empty
                                                                // This means it was an original meal that is now cancelled
                                                                if ((originalMenu !== '' && originalMenu.toLowerCase() !== 'x') && effectiveSelectValue.toLowerCase() === 'x') {
                                                                    // This is a cancellation of an original order
                                                                }
                                                            } else {
                                                                effectiveSelectValue = originalMenu;
                                                            }

                                                            let displayedTextForButton = '';
                                                            if (effectiveSelectValue.toLowerCase() === 'x') {
                                                                displayedTextForButton = 'Abbestellt';
                                                            } else if (effectiveSelectValue) {
                                                                displayedTextForButton = effectiveSelectValue;
                                                            }

                                                            // KEINE MENÜ-KÜRZUNG MEHR IN DER DRUCKBANSICHT FÜR DIESE TABELLEN
                                                            const finalDisplayedText = displayedTextForButton;

                                                            const rawMenuColor = settings.menuColors[effectiveSelectValue];
                                                            const buttonBackgroundColor = effectiveSelectValue.toLowerCase() === 'x'
                                                                ? 'transparent'
                                                                : (rawMenuColor ? mixHexColorWithWhite(rawMenuColor, settings.menuColorMixPercentage) : 'transparent');

                                                            const buttonTextColor = effectiveSelectValue.toLowerCase() === 'x'
                                                                ? '#999' // Lighter gray for cancelled items in print
                                                                : getContrastColor(buttonBackgroundColor);

                                                            // Determine if the order has been changed (but not cancelled)
                                                            const isOrderCorrectedButNotCancelled =
                                                                currentCorrection !== undefined && // A correction exists
                                                                currentCorrection.toLowerCase() !== 'x' && // And it's not a cancellation
                                                                currentCorrection !== originalMenu; // And it's different from the original menu

                                                            const menuOptionsForCurrentDay = allMenusByDay[day];

                                                            return (
                                                                <td key={`${childIdx}-${day}-select`} className="relative px-2 py-1 border border-[#e5e7eb] text-center">
                                                                    <div
                                                                        className={`w-full flex items-center justify-center text-sm rounded-md transition-colors duration-100 ${
                                                                            displayedTextForButton.toLowerCase() === 'abbestellt'
                                                                                ? 'is-abbestellt' // New class for print-specific styling
                                                                                : 'font-semibold'
                                                                        }`}
                                                                        style={{ // Always apply inline styles
                                                                            backgroundColor: buttonBackgroundColor,
                                                                            color: buttonTextColor,
                                                                            minHeight: '2rem',
                                                                            padding: '0.25rem 0.5rem',
                                                                            boxSizing: 'border-box',
                                                                            border: (displayedTextForButton && displayedTextForButton.toLowerCase() !== 'abbestellt') ? '1px solid ' + buttonBackgroundColor : '1px solid #e5e7eb',
                                                                            // Conditional box-shadow: only if changed, and not printing
                                                                            boxShadow: (isOrderCorrectedButNotCancelled && !isPrinting) ? 'inset 0 0 0 2px #a0aec0' : 'none'
                                                                        }}
                                                                    >
                                                                        {finalDisplayedText} {/* Use finalDisplayedText here */}
                                                                    </div>
                                                                    {!isPrinting && ( // Render select only if NOT printing
                                                                        <select
                                                                            value={effectiveSelectValue}
                                                                            onChange={(e) => handleMenuChange(groupName, childEntry.name, day, e.target.value)}
                                                                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                                            aria-label={`Menü für ${childEntry.name} am ${day}`}
                                                                        >
                                                                            <option value="">Standard</option> {/* Changed from empty to "Standard" */}
                                                                            {menuOptionsForCurrentDay.map(option => (
                                                                                <option key={option.value} value={option.value}>
                                                                                    {option.label}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                        <td key={`${childIdx}-total`} className="px-3 py-2 border border-[#e5e7eb] font-bold text-center bg-blue-50 text-gray-800">{calculateTotalOrders(childEntry)}</td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-blue-100 font-semibold">
                                                    <td key="summary-label" className="px-3 py-2 border border-[#e5e7eb] text-left text-blue-800">Zusammenfassung:</td>
                                                    {daysOfWeek.map(day => {
                                                        const daySummary = dailyMenuSummaries[day] || {};
                                                        return (
                                                            <td key={`summary-${day}`} className="px-3 py-2 border border-[#e5e7eb] text-center text-blue-800">
                                                                {Object.keys(daySummary).length > 0 ? (
                                                                    Object.entries(daySummary)
                                                                        .sort(([menuA], [menuB]) => menuA.localeCompare(menuB))
                                                                        .map(([menuName, count]) => (
                                                                            <div key={menuName} className="whitespace-nowrap">
                                                                                {/* KEINE MENÜ-KÜRZUNG MEHR IN DER DRUCKBANSICHT FÜR DIESE TABELLEN */}
                                                                                {menuName}: {count}
                                                                            </div>
                                                                        ))
                                                                ) : (
                                                                    <span>-</span>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                    <td key="group-total" className="px-3 py-2 border border-[#e5e7eb] text-center text-blue-800">{groupTotalMeals}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
                            <p className="text-gray-600 mb-4 text-center">
                                Für den Monat {fullMonthName} {targetYear} sind noch keine Essenslisten importiert.
                            </p>
                            {!isPrinting && ( // Hide import button in print mode
                                <button
                                    onClick={() => setShowImportModal(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out shadow-lg hover:shadow-xl flex items-center justify-center text-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-10" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M13 4v7h7v2h-7v7h-2v-7H4v-2h7V4h2Z"/>
                                    </svg>
                                    CSV-Datei für diesen Monat importieren
                                </button>
                            )}
                        </div>
                    )}

                    {/* Caterer summary table for the week (added again) */}
                    {Object.keys(memoizedGroupData).length > 0 && ( // Only show if data is present in the current week
                        (!isPrinting || printOptions?.selectedPrintType !== 'weeklyGrouped') && ( // Condition to hide when printing weeklyGrouped
                            <div className={`mt-12 p-4 bg-gray-50 rounded-lg shadow-md border border-[#e5e7eb] ${isPrinting ? 'caterer-summary-print' : ''}`}>
                                <h2 className="text-xl font-bold mb-3 text-gray-800">Caterer-Bestellübersicht (Woche)</h2>
                                {!isPrinting && ( // Hide copy/delete buttons in print mode
                                    <div className="flex justify-end mb-3 space-x-2">
                                        <button
                                            onClick={handleCopyCatererData}
                                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                            </svg>
                                            Zahlen kopieren
                                        </button>
                                        <button
                                            onClick={() => handleDeleteWeek(displayedWeekIso)}
                                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Woche löschen
                                        </button>
                                    </div>
                                )}
                                <div className="overflow-x-auto rounded-xl shadow-inner border border-[#e5e7eb] print-table-wrapper">
                                    <table className="min-w-full bg-white border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="px-3 py-2 border border-[#e5e7eb]">Menü</th>
                                                {daysOfWeek.map(day => (
                                                    <th key={`caterer-th-${day}`} className="px-3 py-2 border border-[#e5e7eb]">{day}</th>
                                                ))}
                                            </tr>
                                        </thead><tbody>
                                            {getAllUniqueMenusInWeek().length > 0 ? (
                                                getAllUniqueMenusInWeek().map(menuName => {
                                                    const rawMenuColor = settings.menuColors[menuName] || 'transparent';
                                                    const rowBackgroundColor = mixHexColorWithWhite(rawMenuColor, settings.menuColorMixPercentage);
                                                    const rowTextColor = getContrastColor(rowBackgroundColor);
                                                    return (
                                                        <tr key={`caterer-tr-${menuName}`} style={{ backgroundColor: rowBackgroundColor, color: rowTextColor }}>
                                                            {/* HIER wird Menüname in Caterer-Wochenübersicht nicht gekürzt */}
                                                            <td className="px-3 py-2 border border-[#e5e7eb]">{menuName}</td>
                                                            {daysOfWeek.map(day => (
                                                                <td key={`caterer-td-${menuName}-${day}`} className="px-3 py-2 border border-[#e5e7eb] text-center">
                                                                    {globalDailyMenuSummaries[day]?.[menuName] || 0}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={daysOfWeek.length + 1} className="px-3 py-2 text-center text-gray-500 border border-[#e5e7eb]">Keine Menüdaten für die Caterer-Übersicht.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    )}
                </>
            )}

            {/* Monatsansicht */}
            {(!isPrinting || printOptions?.selectedPrintType === 'monthly') && (activeTab === 'Monat' || isPrinting) && (
                <>
                    <div className={`mb-8 p-4 rounded-lg shadow-sm border border-[#e5e7eb] ${isPrinting ? 'child-orders-table' : ''}`}>
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">Kinder: Bestellungen & Kosten</h3>
                        <div className="overflow-x-auto rounded-xl shadow-inner border border-[#e5e7eb] print-table-wrapper">
                            <table className="min-w-full bg-white border-collapse">
                                <thead>
                                    <tr>
                                        <th
                                            key="parent-lastname-header"
                                            className={`px-3 py-2 border border-[#e5e7eb] text-left text-gray-700 ${!isPrinting ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                                            onClick={() => handleSort('parentLastName', monthlyChildSortConfig, setMonthlyChildSortConfig)}
                                        >
                                            Nachname Eltern{!isPrinting && getSortIndicator('parentLastName', 'parentLastName', monthlyChildSortConfig)}
                                        </th>
                                        <th
                                            key="child-name-header"
                                            className={`px-3 py-2 border border-[#e5e7eb] text-left text-gray-700 ${!isPrinting ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                                            onClick={() => handleSort('name', monthlyChildSortConfig, setMonthlyChildSortConfig)}
                                        >
                                            Name{!isPrinting && getSortIndicator('name', 'name', monthlyChildSortConfig)}
                                        </th>
                                        <th
                                            key="child-total-meals-header"
                                            className={`px-3 py-2 border border-[#e5e7eb] text-center text-gray-700 ${!isPrinting ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                                            onClick={() => handleSort('totalMeals', monthlyChildSortConfig, setMonthlyChildSortConfig)}
                                        >
                                            Gesamtessen{!isPrinting && getSortIndicator('totalMeals', 'totalMeals', monthlyChildSortConfig)}
                                        </th>
                                        <th
                                            key="child-total-cost-header"
                                            className={`px-3 py-2 border border-[#e5e7eb] text-center text-gray-700 ${!isPrinting ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                                            onClick={() => handleSort('totalCost', monthlyChildSortConfig, setMonthlyChildSortConfig)}
                                        >
                                            Gesamtkosten{!isPrinting && getSortIndicator('totalCost', 'totalCost', monthlyChildSortConfig)}
                                        </th>
                                    </tr>
                                </thead><tbody>
                                    {monthlyChildSummary.length > 0 ? (
                                        monthlyChildSummary.map((child, idx) => (
                                            <tr key={idx} className="odd:bg-gray-50 hover:bg-gray-100">
                                                <td className="px-3 py-2 border border-[#e5e7eb]">{child.parentLastName || '-'}</td>
                                                <td className="px-3 py-2 border border-[#e5e7eb]">{child.name}</td>
                                                <td className="px-3 py-2 border border-[#e5e7eb] text-center">{child.totalMeals}</td>
                                                <td className="px-3 py-2 border border-[#e5e7eb] text-center">
                                                    {child.totalCost.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-3 py-2 text-center text-gray-500 border border-[#e5e7eb]">Keine Daten für diesen Monat verfügbar.</td>
                                        </tr>
                                    )}
                                    <tr className="bg-blue-100 font-semibold">
                                        <td key="total-children-label" colSpan="2" className="px-3 py-2 border border-[#e5e7eb] text-left text-blue-800">Gesamt aller Kinder:</td>
                                        <td key="overall-total-meals" className="px-3 py-2 border border-[#e5e7eb] text-center text-blue-800">{overallTotalMeals}</td>
                                        <td key="overall-total-cost" className="px-3 py-2 border border-[#e5e7eb] text-center text-blue-800">
                                            {overallTotalCost.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className={`mt-12 p-4 bg-gray-50 rounded-lg shadow-md border border-[#e5e7eb] ${isPrinting ? 'caterer-monthly-summary-table' : ''}`}>
                        <h3 className="text-xl font-bold mb-4 text-gray-800 flex justify-between items-center">
                            Caterer-Bestellübersicht (Monat)
                            {!isPrinting && ( // Hide copy button in print mode
                                <button
                                    onClick={handleCopyCatererDataMonthly}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                    </svg>
                                    Zahlen kopieren
                                </button>
                            )}
                        </h3>
                        <div className="overflow-x-auto rounded-xl shadow-inner border border-[#e5e7eb] print-table-wrapper">
                            <table className="min-w-full bg-white border-collapse">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-2 border border-[#e5e7eb]">Menü</th>
                                        {sortedDates.length > 0 ?
                                            sortedDates.map(date => (
                                                <th key={date} className="px-3 py-2 border border-[#e5e7eb]">{formatDate(new Date(date)).substring(0, 5)}</th>
                                            ))
                                            :
                                            <th key="caterer-th-no-days" className="px-3 py-2 border border-[#e5e7eb]">Keine Tage</th>
                                        }
                                    </tr>
                                </thead><tbody>
                                    {sortedMenus.length > 0 ? (
                                        sortedMenus.map(menuName => {
                                            const rawMenuColor = settings.menuColors[menuName] || 'transparent';
                                            const rowBackgroundColor = mixHexColorWithWhite(rawMenuColor, settings.menuColorMixPercentage);
                                            const rowTextColor = getContrastColor(rowBackgroundColor);
                                            return (
                                                <tr key={menuName} style={{ backgroundColor: rowBackgroundColor, color: rowTextColor }}>
                                                    {/* HIER wird Menüname in Caterer-Monatsübersicht NICHT gekürzt */}
                                                    <td className="px-3 py-2 border border-[#e5e7eb]">{menuName}</td>
                                                    {sortedDates.map(date => (
                                                        <td key={`${menuName}-${date}`} className="px-3 py-2 border border-[#e5e7eb] text-center">
                                                            {dailyCatererSummary[date]?.[menuName] || 0}
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={sortedDates.length > 0 ? sortedDates.length + 1 : 2} className="px-3 py-2 text-center text-gray-500 border border-[#e5e7eb]">Keine Menüdaten für die Caterer-Übersicht.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};


// IndexedDB Wrapper Functions
// This part is for persisting the FileSystemFileHandle
const DB_NAME = 'kindergarten_planner_db';
const STORE_NAME = 'file_handles';
const AUTO_SAVE_PREFERENCE_KEY = 'autoSavePreference'; // New key for user preference

const openDb = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(STORE_NAME);
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject('IndexedDB error: ' + event.target.errorCode);
        };
    });
};

const saveFileHandleToDb = async (handle) => {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(handle, 'currentFileHandle'); // Store with a fixed key

        request.onsuccess = () => resolve();
        request.onerror = (event) => reject('Error saving handle: ' + event.target.error);
    });
};

const getFileHandleFromDb = async () => {
    const db = await openDb();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get('currentFileHandle');

        request.onsuccess = (event) => resolve(event.target.result || null);
        request.onerror = (event) => reject('Error getting handle: ' + event.target.error);
    });
};

// Neue Komponente für das Hilfe-Modal
const HelpModal = ({ show, onClose }) => {
    return (
        <Modal show={show} onClose={onClose} title="Anleitung">
            <div className="p-4 space-y-6">
                {/* Inhalt von Schritt 2 */}
                {/* Nutzung von dangerouslySetInnerHTML, da der Inhalt bereits HTML-Tags enthält */}
                <div dangerouslySetInnerHTML={{ __html: HELP_STEP_2_CONTENT }} />

                {/* Inhalt von Schritt 3 */}
                <div dangerouslySetInnerHTML={{ __html: HELP_STEP_3_CONTENT }} />
            </div>
        </Modal>
    );
};

// Hauptkomponente der Anwendung
const App = () => {
    // Hilfsfunktionen für Datum und Woche (nach oben verschoben, damit sie vor der Initialisierung von `selectedWeekGlobal` verfügbar sind)
    const getMonday = useCallback((d) => {
        d = new Date(d);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Montag = 1, Sonntag = 0 (für Sonntag den Montag der Vorwoche)
        const monday = new Date(d.setDate(diff));
        monday.setHours(0, 0, 0, 0); // Setze Zeit auf Mitternacht für konsistente Wochenstarts
        return monday;
    }, []);

    const formatDate = useCallback((date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    }, []);

    const getWeekRange = useCallback((monday) => {
        const friday = new Date(monday);
        friday.setDate(monday.getDate() + 4); // Montag + 4 Tage = Freitag
        return `${formatDate(monday)} - ${formatDate(friday)}`;
    }, [formatDate]);

    // Generiert eine Liste von Wochen für das Dropdown basierend auf Jahr und Monat
    const generateWeeksForYearAndMonth = useCallback((targetYear, targetMonthIndex) => {
        const weeks = [];
        const uniqueMondayIsos = new Set();

        const firstDayOfTargetMonth = new Date(targetYear, targetMonthIndex, 1);
        const lastDayOfTargetMonth = new Date(targetYear, targetMonthIndex + 1, 0);

        let currentMonday = getMonday(firstDayOfTargetMonth);

        // Zurückjustieren, um sicherzustellen, dass die Woche, die möglicherweise im Vormonat beginnt, abgedeckt wird
        const dayOfWeek = firstDayOfTargetMonth.getDay(); // 0 (Sonntag) - 6 (Samstag)
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Anzahl der Tage, die abgezogen werden müssen, um zum Montag zu gelangen
        currentMonday = new Date(firstDayOfTargetMonth); // currentMonday auf firstDayOfTargetMonth zurücksetzen, bevor abgezogen wird
        currentMonday.setDate(currentMonday.getDate() - daysToSubtract);
        currentMonday.setHours(0, 0, 0, 0); // Sicherstellen, dass es genau Montag Mitternacht ist

        let safetyBreak = 0;
        const maxIterations = 8; // Um unendliche Schleifen zu verhindern (ein Monat erstreckt sich über maximal maximal 6-7 Wochen)

        while (safetyBreak < maxIterations) {
            let containsWeekdayInTargetMonth = false;
            for (let i = 0; i < 5; i++) { // Montag bis Freitag prüfen
                const dayToCheck = new Date(currentMonday);
                dayToCheck.setDate(currentMonday.getDate() + i);

                // Wenn ein Wochentag in den Zielmonat fällt, die Woche einschließen
                if (dayToCheck.getFullYear() === targetYear && dayToCheck.getMonth() === targetMonthIndex) {
                    containsWeekdayInTargetMonth = true;
                    break;
                }
            }

            if (containsWeekdayInTargetMonth) {
                const mondayIso = currentMonday.toISOString();
                if (!uniqueMondayIsos.has(mondayIso)) {
                    weeks.push({ value: mondayIso, label: getWeekRange(currentMonday) });
                    uniqueMondayIsos.add(mondayIso);
                }
            }

            // Zum nächsten Montag wechseln
            currentMonday.setDate(currentMonday.getDate() + 7);

            // Abbruchbedingung: Wenn der Montag der *nächsten* Woche deutlich nach dem Ende des Zielmonats liegt, anhalten.
            // Wir addieren 7 Tage zu lastDayOfTargetMonth, um sicherzustellen, dass wir die allerletzte Woche erfassen,
            // die möglicherweise im Zielmonat beginnt, aber imächsten endet.
            if (currentMonday.getTime() > lastDayOfTargetMonth.getTime() + (7 * 24 * 60 * 60 * 1000)) {
                break;
            }

            safetyBreak++;
        }

        // Sicherstellen, dass die Wochen chronologisch sortiert sind
        weeks.sort((a, b) => new Date(a.value).getTime() - new Date(b.value).getTime());

        return weeks;
    }, [getMonday, getWeekRange]);


    // Zustand für die aktuell ausgewählte Registerkarte
    const [activeTab, setActiveTab] = useState('Startseite');
    // Zustand für die geladenen CSV-Daten (ein Array von Arrays)
    const [csvData, setCsvData] = useState(() => {
        const savedCsvData = localStorage.getItem('csvData');
        return savedCsvData ? JSON.parse(savedCsvData) : [];
    });
    // Zustand für die Einstellungen
    const [settings, setSettings] = useState(() => {
        // Einstellungen aus localStorage laden oder Standardwerte verwenden
        const savedSettings = localStorage.getItem('kindergartenSettings');
        const defaultSettings = {
            pricePerMeal: 3.95, // Standardpreis auf 3.95 geändert
            groupColors: {}, // { 'Gruppe A': '#FF0000', 'Gruppe B': '#0000FF' }
            menuColors: {}, // NEU: Farben für Menüs { 'Menü Vegetarisch': '#AAFFCC' }
            groupColorMixPercentage: 0, // NEU: Standard-Mischverhältnis für Gruppen (0% Weiß, 100% Originalfarbe)
            menuColorMixPercentage: 90, // NEU: Standard-Mischverhältnis für Menüs (90% Weiß, 10% Originalfarbe)
            columnMappings: { // Mapping von logischen Namen zu CSV-Headern
                childName: '',
                groupName: '',
                parentLastName: '', // NEU: Spalte für Nachname Eltern
                // Datum-Spalte entfernt, da sie nicht mehr aus CSV gelesen wird
                mealQuestionPrefix: 'FRAGE', // Standardpräfix für Essensfrage-Spalten
                mealAnswerPrefix: 'ANTWORT', // Standardpräfix für Essensantwort-Spalten
                menuCount: 2, // Standardanzahl der Menüs
                mealQuestionColumns: [], // Header für FRAGE X Spalten (z.B. "FRAGE 1")
                mealAnswerColumns: [],   // Header für ANTWORT X Spalten (z.B. "ANTWORT 1")
            },
        };
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    });
    // Zustand für anzuzeigende Nachrichten (Toast-Benachrichtigung)
    const [toastMessage, setToastMessage] = useState({ text: '', type: '' });
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
   const [weekToDeleteIso, setWeekToDeleteIso] = useState(null);

    // NEU: Zustand für das Hilfe-Modal
    const [showHelpModal, setShowHelpModal] = useState(false); // <--- DIESE ZEILE IST NEU

    // NEU: Zustände für den Druckmodus
    const [isPrinting, setIsPrinting] = useState(false);
    const [printOptions, setPrintOptions] = useState(null); // Speichert die Optionen aus dem Modal

    // NEU: Zustände für die Sortierung der Tabellen (jetzt im App-Level verwaltet)
    const [groupSortConfig, setGroupSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [monthlyChildSortConfig, setMonthlyChildSortConfig] = useState({ key: 'parentLastName', direction: 'ascending' });

    // Zustand für alle verarbeiteten Wochen-Essensdaten
    const [allWeeklyMealsData, setAllWeeklyMealsData] = useState(() => {
        const savedData = localStorage.getItem('allWeeklyMealsData');
        // Initialisierung: jede Woche sollte 'meals' und 'corrections' Objekte haben
        const parsedData = savedData ? JSON.parse(savedData) : {};
        // Sicherstellen, dass jede geladene Woche eine 'corrections'-Eigenschaft hat
        for (const weekIso in parsedData) {
            if (!parsedData[weekIso].corrections) {
                parsedData[weekIso].corrections = {};
            }
        }
        return parsedData;
    });

    // NEU: Zustand für das FileSystemFileHandle und Auto-Save
    const [fileHandle, setFileHandle] = useState(null);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(() => {
        const savedPreference = localStorage.getItem(AUTO_SAVE_PREFERENCE_KEY);
        // Standardmäßig aktiviert, wenn noch keine Präferenz gespeichert ist
        return savedPreference !== null ? JSON.parse(savedPreference) : true;
    });
    // NEU: Flag, um zu verfolgen, ob der Persistenz-Check bereits durchgeführt wurde
    const [hasCheckedForPersistedHandle, setHasCheckedForPersistedHandle] = useState(false);

    // NEU: Zustand für das First-Time-Popup und den Tour-Schritt
    const [showWelcomeModal, setShowWelcomeModal] = useState(() => !localStorage.getItem('hasSeenWelcomeModal'));
    const [welcomeModalCurrentStep, setWelcomeModalCurrentStep] = useState(1); // NEU: Tour-Schritt in App


    // Zustände für Jahr, Monat und die aktuell ausgewählte Woche im Wochenplan
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth(); // 0-11

    const [selectedKindergartenYear, setSelectedKindergartenYear] = useState(() => {
        const today = new Date();
        // Kindergartenjahr: August des Vorjahres bis Juli des aktuellen Jahres
        if (today.getMonth() >= 7) { // August (7) bis Dezember (11)
            return `${currentYear.toString().slice(-2)}/${(currentYear + 1).toString().slice(-2)}`;
        } else { // Januar (0) bis Juli (6)
            return `${(currentYear - 1).toString().slice(-2)}/${currentYear.toString().slice(-2)}`;
        }
    });
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex); // Aktueller Monat

    // Berechne das effektive Zieljahr basierend auf dem Kindergartenjahr und dem ausgewählten Monat
    const currentCalculatedTargetYear = useMemo(() => {
        const startYearTwoDigits = parseInt(selectedKindergartenYear.split('/')[0], 10);
        // Vollständiges Jahr korrekt bestimmen, unter der Annahme, dass Jahre wie "24" 2024 sind.
        // Dies behandelt Fälle wie 99/00 für das Jahr 1999/2000 und 00/01 für 2000/2001
        let fullStartYear = 2000 + startYearTwoDigits;
        if (startYearTwoDigits > (currentYear % 100) + 1) { // Wenn die zweistellige Jahreszahl deutlich in der Zukunft liegt, 1900er annehmen
             fullStartYear = 1900 + startYearTwoDigits;
        }

        let targetYear = fullStartYear;
        if (selectedMonthIndex < 7) { // Monate Jan-Jul gehören zum nächsten Kalenderjahr im Kindergartenjahr-Zyklus
            targetYear = fullStartYear + 1;
        }
        return targetYear;
    }, [selectedKindergartenYear, selectedMonthIndex, currentYear]);


    // Bestimme die aktuell im Wochenplan angezeigte Woche
    const [displayedWeekIso, setDisplayedWeekIso] = useState(() => {
        const today = new Date();
        const mondayOfCurrentWeek = getMonday(today);
        return mondayOfCurrentWeek.toISOString();
    });


    // Standard-Zeichenkodierung für den CSV-Import
    const DEFAULT_ENCODING = 'windows-1252';
    // Trennzeichen für die CSV-Datei
    const CSV_DELIMITER = ';';


    // Funktion zur Verarbeitung der CSV-Daten in eine strukturierte Wochenansicht
    const processCsvForWeeklyMeals = useCallback((data, currentSettings) => { // selectedWeekIso entfernt
        if (!data || data.length < 2 || !currentSettings.columnMappings.childName || !currentSettings.columnMappings.groupName) {
            return {};
        }

        const headers = data[0];
        const childNameColIndex = headers.indexOf(currentSettings.columnMappings.childName);
        const groupNameColIndex = headers.indexOf(currentSettings.columnMappings.groupName);
        const parentLastNameColIndex = headers.indexOf(currentSettings.columnMappings.parentLastName); // NEU: Nachname Eltern Index

        // Finde die Spaltenindizes für alle Menüfragen und -antworten
        const mealQuestionColIndices = currentSettings.columnMappings.mealQuestionColumns
            .map(colName => headers.indexOf(colName))
            .filter(index => index !== -1);
        const mealAnswerColIndices = currentSettings.columnMappings.mealAnswerColumns
            .map(colName => headers.indexOf(colName))
            .filter(index => index !== -1);

        if (childNameColIndex === -1 || groupNameColIndex === -1 || mealQuestionColIndices.length === 0 || mealAnswerColIndices.length === 0 || mealQuestionColIndices.length !== mealAnswerColIndices.length) {
            return {};
        }

        // Struktur: { 'groupName': { 'childName': { 'dayName': { originalMenu: 'Menü 1', ordered: true, originalMenuNumber: '1' }, ... }, ... } }
        const mealsForSelectedWeek = {}; // Dies wird Daten für die aktuell ausgewählte Woche enthalten

        data.slice(1).forEach(row => {
            const rawChildNames = row[childNameColIndex]; // Kann "Achim Mustermann, Sarah Mustermann" sein
            const groupName = row[groupNameColIndex];
            const parentLastName = parentLastNameColIndex !== -1 ? row[parentLastNameColIndex] : ''; // NEU: Nachname Eltern aus CSV

            if (!rawChildNames || !groupName) {
                return; // Zeilen ohne Kindnamen oder Gruppe überspringen
            }

            // NEU: Namen am Komma trennen und trimmen
            const childNames = rawChildNames.split(',').map(name => name.trim()).filter(name => name !== '');

            if (!mealsForSelectedWeek[groupName]) {
                mealsForSelectedWeek[groupName] = {};
            }

            // Für jeden Kindnamen im Eintrag die Mahlzeiteninformationen erstellen
            childNames.forEach(childName => {
                if (!mealsForSelectedWeek[groupName][childName]) {
                    mealsForSelectedWeek[groupName][childName] = {
                        name: childName,
                        group: groupName,
                        parentLastName: parentLastName, // NEU: Nachname Eltern hier speichern
                        dailyMeals: {} // { 'Montag': { originalMenu: 'Menü Vegetarisch', ordered: true }, ... }
                    };
                }

                mealQuestionColIndices.forEach((questionColIdx, menuIndex) => {
                    const questionContent = row[questionColIdx]; // z.B. "Montag Menü Vegetarisch"
                    const answerColIdx = mealAnswerColIndices[menuIndex];
                    const answerContent = row[answerColIdx]; // z.B. "Ja" oder "Nein"

                    if (questionContent && answerContent) {
                        const ordered = answerContent.trim().toLowerCase() === 'ja';
                        let day = null;
                        let menuDescription = questionContent.trim(); // Mit dem vollständigen Frageinhalt beginnen

                        for(const d of daysOfWeek) {
                            if (menuDescription.includes(d)) {
                                day = d;
                                // Den Wochentag entfernen und Leerzeichen trimmen
                                menuDescription = menuDescription.replace(d, '').trim();
                                break;
                            }
                        }

                        if (day) { // Nur fortfahren, wenn ein Wochentag gefunden wurde
                            // Die extrahierte Menübeschreibung direkt als originalMenu verwenden
                            const originalMenuText = menuDescription; // Enthält jetzt "Menü Vegetarisch" usw.

                            if (ordered) {
                                mealsForSelectedWeek[groupName][childName].dailyMeals[day] = {
                                    originalMenu: originalMenuText, // Die exakte Menübezeichnung speichern
                                    ordered: ordered,
                                };
                            } else {
                                // Wenn nicht bestellt ("Nein"), den Eintrag erstellen, aber mit 'ordered: false'
                                if (!mealsForSelectedWeek[groupName][childName].dailyMeals[day]) {
                                    mealsForSelectedWeek[groupName][childName].dailyMeals[day] = {
                                        originalMenu: '', // Kein Menü bestellt
                                        ordered: false,
                                    };
                                }
                            }
                        }
                    }
                });
            });
        });
        return mealsForSelectedWeek; // Gibt nur die verarbeiteten Essensdaten zurück
    }, []);

    // Modals
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    // showPrintOptionsModal entfernt

    // Zustand für die im Import-Modal ausgewählte Woche
    const [selectedImportWeekIso, setSelectedImportWeekIso] = useState('');

    // useEffect, um Einstellungen bei Änderungen im State in localStorage zu speichern
    useEffect(() => {
        localStorage.setItem('kindergartenSettings', JSON.stringify(settings));
    }, [settings]);

    // useEffect, um allWeeklyMealsData bei Änderungen im State in localStorage zu speichern
    useEffect(() => {
        localStorage.setItem('allWeeklyMealsData', JSON.stringify(allWeeklyMealsData));
    }, [allWeeklyMealsData]);

    // NEU: useEffect, um autoSaveEnabled Präferenz in localStorage zu speichern
    useEffect(() => {
        localStorage.setItem(AUTO_SAVE_PREFERENCE_KEY, JSON.stringify(autoSaveEnabled));
    }, [autoSaveEnabled]);


    // Gruppenfarben direkt in der App-Komponente aktualisieren, wenn CSV-Daten geladen werden
    useEffect(() => {
        if (csvData.length > 0 && settings.columnMappings.groupName) {
            const groupColIndex = csvData[0].indexOf(settings.columnMappings.groupName);
            if (groupColIndex !== -1) {
                const uniqueGroups = new Set();
                csvData.slice(1).forEach(row => {
                    if (row[groupColIndex]) {
                        uniqueGroups.add(row[groupColIndex].trim());
                    }
                });

                setSettings(prev => {
                    const newGroupColors = { ...prev.groupColors };
                    let colorIndex = 0; // Mit der ersten Farbe für neue Gruppen beginnen
                    const sortedUniqueGroups = Array.from(uniqueGroups).sort(); // Für konsistente Farbzuteilung sortieren

                    let colorsChanged = false;
                    sortedUniqueGroups.forEach(group => {
                        if (!newGroupColors[group]) {
                            // Neuen Gruppen eine eindeutige Farbe aus der vordefinierten Liste zuweisen
                            newGroupColors[group] = predefinedColors[colorIndex % predefinedColors.length];
                            colorsChanged = true;
                        }
                        colorIndex++; // Zurächsten Farbe gehen
                    });

                    // Nur den Status aktualisieren, wenn sich die Farben tatsächlich geändert haben
                    if (colorsChanged || Object.keys(newGroupColors).length !== Object.keys(prev.groupColors).length) {
                         return { ...prev, groupColors: newGroupColors };
                    }
                    return prev; // Keine Änderung, vorherigen Status zurückgeben
                });
            }
        }
    }, [csvData, settings.columnMappings.groupName, settings.groupColors]);

    // Funktion zum automatischen Erkennen und Zuordnen von Essens-Spalten
    const autoDetectMealColumns = useCallback((headers) => {
        const mealQuestionColumns = [];
        const mealAnswerColumns = [];
        const mealQuestionPrefix = settings.columnMappings.mealQuestionPrefix;
        const mealAnswerPrefix = settings.columnMappings.mealAnswerPrefix;

        // Über eine potenzielle Anzahl von Menüs iterieren (bis zu 10, wie in Ihrer CSV)
        for (let i = 1; i <= 10; i++) { // Auf 10 erhöht
            const questionColName = `${mealQuestionPrefix} ${i}`;
            const answerColName = `${mealAnswerPrefix} ${i}`;

            if (headers.includes(questionColName) && headers.includes(answerColName)) {
                mealQuestionColumns.push(questionColName);
                mealAnswerColumns.push(answerColName);
            }
        }
        return { mealQuestionColumns, mealAnswerColumns };
    }, [settings.columnMappings.mealQuestionPrefix, settings.columnMappings.mealAnswerPrefix]);


    // selectedImportWeekIso initialisieren, wenn das Import-Modal geöffnet wird
    useEffect(() => {
        if (showImportModal) {
            const weeksForCurrentMonth = generateWeeksForYearAndMonth(currentCalculatedTargetYear, selectedMonthIndex);
            // Filter weeks that already have data
            const availableWeeksForImport = weeksForCurrentMonth.filter(week =>
                !(allWeeklyMealsData[week.value] && Object.keys(allWeeklyMealsData[week.value].meals).length > 0)
            );

            if (availableWeeksForImport.length > 0) {
                // If the currently displayed week is available for import, select it.
                // Otherwise, select the first available week for import.
                const isDisplayedWeekAvailable = availableWeeksForImport.some(week => week.value === displayedWeekIso);
                setSelectedImportWeekIso(isDisplayedWeekAvailable ? displayedWeekIso : availableWeeksForImport[0].value);
            } else {
                setSelectedImportWeekIso(''); // No weeks available for import
            }
        }
    }, [showImportModal, currentCalculatedTargetYear, selectedMonthIndex, generateWeeksForYearAndMonth, displayedWeekIso, allWeeklyMealsData]);


    /**
     * Shows a toast message in the UI.
     * @param {string} text - The message text.
     * @param {'success' | 'error' | 'info'} type - The type of the message.
     */
    const showToast = useCallback((text, type = 'info') => {
        setToastMessage({ text, type });
        setTimeout(() => {
            setToastMessage({ text: '', type: '' });
        }, 3000); // Hide message after 3 seconds
    }, []);

    /**
     * Saves the settings and triggers a toast.
     * @param {object} newSettings - The new settings.
     */
    const saveSettings = useCallback((newSettings) => {
        setSettings(newSettings);
        showToast('Einstellungen gespeichert!', 'success');
    }, [setSettings, showToast]);

    /**
     * Parses a CSV string into a 2D array.
     * @param {string} csvString - The CSV string.
     * @param {string} delimiter - The delimiter (e.g., ',' or ';').
     * @returns {Array<Array<string>>} A 2D array of the CSV data.
     */
    const parseCSV = useCallback((csvString, delimiter) => {
        const lines = csvString.split(/\r?\n/);
        const data = [];
        const regex = new RegExp(`${delimiter}(?=(?:(?:[^"]*"){2})*[^"]*$)`);

        for (const line of lines) {
            if (line.trim() === '') continue;

            let cleanedLine = line;

            // 1. Unicode normalization (NFC)
            cleanedLine = cleanedLine.normalize('NFC');

            // 2. Explicit removal of U+FFFD (Replacement Character - the '' character)
            cleanedLine = cleanedLine.replace(/\uFFFD/g, '');

            // 3. Comprehensive removal of all invisible control characters and zero-width characters
            const invisibleCharRegex = /[\x00-\x1F\x7F\u0080-\u009F\u00AD\u034F\u061C\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF\uFFF9-\uFFFB\uFFFC\uFFFE-\uFFFF]/g;
            cleanedLine = cleanedLine.replace(invisibleCharRegex, '');

            // 4. Whitespace normalization: Reduce all whitespace to a single space
            // Important: this comes after removing specific invisible characters,
            // so that e.g. a zero-width space does not become a visible space.
            cleanedLine = cleanedLine.replace(/\s+/g, ' ');

            const row = cleanedLine.split(regex).map(cell => {
                let cleanedCell = cell.trim();

                // Remove quotation marks and their escapings
                if (cleanedCell.startsWith('"') && cleanedCell.endsWith('"')) {
                    cleanedCell = cleanedCell.slice(1, -1);
                }
                cleanedCell = cleanedCell.replace(/""/g, '"');

                // IMPORTANT: The aggressive removal of spaces within word characters
                // has been removed so that normal spaces between words (like "Kindvorname Kindnachmame")
                // are preserved. If the source file provides "g m a i l", it will be normalized to "g m a i l".
                // Automatic conversion to "gmail" would require more complex word recognition.

                return cleanedCell.trim(); // Final trimming
            });
            data.push(row);
        }
        if (data.length === 0) {
             throw new Error("Die CSV-Datei ist leer oder konnte nicht geparst werden.");
        }
        return data;
    }, []);

    /**
     * Handles file selection and loading of the CSV file.
     * @param {Event} event - The change event of the file input element.
     * @param {string} targetWeekIso - The ISO string of the week for which the data is to be imported.
     */
    const handleFileSelectAndImport = useCallback(async (event, targetWeekIso) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const decoder = new TextDecoder(DEFAULT_ENCODING);
                    const content = decoder.decode(e.target.result);

                    const parsedData = parseCSV(content, CSV_DELIMITER);
                    const headers = parsedData[0];

                    // --- Automatic detection of general column mappings (child name, group name, parent last name) ---
                    let autoDetectedChildNameCol = '';
                    if (headers.includes('NAME DES KINDES')) autoDetectedChildNameCol = 'NAME DES KINDES';
                    else if (headers.includes('Kind')) autoDetectedChildNameCol = 'Kind';

                    let autoDetectedGroupNameCol = '';
                    if (headers.includes('GRUPPE')) autoDetectedGroupNameCol = 'GRUPPE';
                    else if (headers.includes('Gruppe')) autoDetectedGroupNameCol = 'Gruppe';

                    let autoDetectedParentLastNameCol = ''; // NEW: Auto-detection for parent last name
                    if (headers.includes('NACHNAME')) autoDetectedParentLastNameCol = 'NACHNAME';
                    else if (headers.includes('Nachname Eltern')) autoDetectedParentLastNameCol = 'Nachname Eltern';


                    // --- Automatic detection of meal question/answer columns ---
                    const { mealQuestionColumns, mealAnswerColumns } = autoDetectMealColumns(headers);

                    // Create the full updated column mappings for this import process
                    const currentColumnMappings = {
                        childName: autoDetectedChildNameCol,
                        groupName: autoDetectedGroupNameCol,
                        parentLastName: autoDetectedParentLastNameCol, // NEW: Add parent last name to mappings
                        mealQuestionPrefix: settings.columnMappings.mealQuestionPrefix, // Retain current prefix setting
                        mealAnswerPrefix: settings.columnMappings.mealAnswerPrefix, // Retain current prefix setting
                        mealQuestionColumns: mealQuestionColumns,
                        mealAnswerColumns: mealAnswerColumns,
                    };

                    // Update the state (this is asynchronous, but the subsequent processing will use the direct object)
                    setSettings(prev => ({
                        ...prev,
                        columnMappings: currentColumnMappings,
                    }));

                    // Update csvData status, important so that SettingsPage reflects the header options
                    setCsvData(parsedData);

                    // Process the data for the specific week with the *newly determined and combined* mappings
                    const newProcessedMealsData = processCsvForWeeklyMeals(parsedData, {
                        ...settings, // Distribute existing settings (pricePerMeal, groupColors etc.)
                        columnMappings: currentColumnMappings // Crucial: use the just calculated updated mappings
                    });

                    setAllWeeklyMealsData(prevData => {
                        const newAllWeeklyMealsData = {
                            ...prevData,
                            [targetWeekIso]: { // Save under the ISO week
                                rawCsvData: parsedData, // NEU: Speichere die rohen CSV-Daten
                                meals: newProcessedMealsData, // Hier sind die verarbeiteten Mahlzeiten
                                corrections: {} // Neue Woche beginnt mit leeren Korrekturen
                            }
                        };

                        // NEW: Automatically assign menu colors after import
                        // Access imported meals via newAllWeeklyMealsData[targetWeekIso].meals
                        const allChildrenForNewData = Object.values(newAllWeeklyMealsData[targetWeekIso].meals).flatMap(groupData => Object.values(groupData));
                        const uniqueMenusInNewData = new Set();
                        allChildrenForNewData.forEach(childEntry => {
                            daysOfWeek.forEach(day => {
                                if (childEntry.dailyMeals && childEntry.dailyMeals[day]?.originalMenu) {
                                    uniqueMenusInNewData.add(childEntry.dailyMeals[day].originalMenu);
                                }
                            });
                        });
                        const sortedUniqueMenusInNewData = Array.from(uniqueMenusInNewData).sort();

                        setSettings(prevSettings => {
                            const newMenuColors = { ...prevSettings.menuColors };
                            let colorIndex = Object.keys(newMenuColors).length; // Start index for new colors
                            sortedUniqueMenusInNewData.forEach(menu => {
                                if (!newMenuColors[menu]) {
                                    newMenuColors[menu] = predefinedColors[colorIndex % predefinedColors.length];
                                    colorIndex++;
                                }
                            });
                            return { ...prevSettings, menuColors: newMenuColors };
                        });

                        return newAllWeeklyMealsData;
                    });

                    showToast(`CSV-Daten für Woche ${getWeekRange(new Date(targetWeekIso))} erfolgreich importiert!`, 'success');
                    setShowImportModal(false); // Close modal after import
                    setDisplayedWeekIso(targetWeekIso); // Switch to the imported week
                    setActiveTab('Woche'); // Switch to the week tab
                } catch (error) {
                    showToast('Fehler beim Laden oder Importieren der CSV-Datei: ' + error.message, 'error');
                }
            };
            reader.onerror = () => {
                showToast('Fehler beim Lesen der Datei.', 'error');
            };
            reader.readAsArrayBuffer(file);
        } else {
            showToast('Keine Datei ausgewählt.', 'error');
        }
    }, [parseCSV, processCsvForWeeklyMeals, settings, showToast, getWeekRange, autoDetectMealColumns, allWeeklyMealsData, setSettings]);

    /**
     * Converts the 2D array of CSV data back into a CSV string.
     * @param {Array<Array<string>>} data - The 2D array of CSV data.
     * @returns {string} The CSV string.
     */
    const convertToCSV = useCallback((data) => {
        return data.map(row => {
            return row.map(cell => {
                let cellString = String(cell);
                let escapedCell = cellString.replace(/"/g, '""');

                if (escapedCell.includes(CSV_DELIMITER) || escapedCell.includes('\n') || escapedCell.includes('"')) {
                    return `"${escapedCell}"`;
                }
                return escapedCell;
            }).join(CSV_DELIMITER);
        }).join('\n');
    }, []);

    /**
     * Saves the current table as a CSV file.
     */
    const saveCsvFile = useCallback(() => {
        // Collect all data from allWeeklyMealsData and convert it back to a flat CSV format
        // This is a complex step, as the original CSV structure must be restored
        // For this version, only a placeholder is shown.
        showToast('Speichern von Wochenplänen als CSV ist in Entwicklung.', 'info');
    }, [showToast]);

    /**
     * Updates the value of a cell in the csvData array.
     * @param {number} rowIndex - The index of the row.
     * @param {number} colIndex - The index of the column.
     */
    const updateCellValue = useCallback((rowIndex, colIndex, value) => {
        // This function is no longer used directly with csvData, as allWeeklyMealsData is the main data source.
        // Updates should be done via `setAllWeeklyMealsData`.
    }, []);

    // NavLink Component (for tabs in the header)
    const NavLink = ({ tab, activeTab, setActiveTab, children }) => (
        <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === tab ? 'bg-blue-700' : 'hover:bg-blue-500'
            }`}
            onClick={() => setActiveTab(tab)}
        >
            {children}
        </button>
    );

    // Toast Component for messages
    const Toast = ({ message, type }) => {
        if (!message) return null;

        let bgColorClass = 'bg-blue-500'; // Info
        if (type === 'success') bgColorClass = 'bg-green-500';
        else if (type === 'error') bgColorClass = 'bg-red-500';

        return (
            // z-[1000] to ensure it is always on top
            <div className={`toast-message-container fixed bottom-4 left-1/2 -translate-x-1/2 ${bgColorClass} text-white px-4 py-2 rounded-md shadow-lg z-[1000] transition-opacity duration-300`}>
                {message}
            </div>
        );
    };

    // WelcomeModal Component
    const WelcomeModal = ({ onClose, handleJsonImportAppLevel, showToast, setAllWeeklyMealsData, saveSettings, currentStep, handleNext, handleBack }) => {
        const fallbackImportInputRef = useRef(null); // Ref for fallback input in WelcomeModal

        // This useEffect is for debugging purposes.
        useEffect(() => {
            console.log('WelcomeModal useEffect: currentStep changed to', currentStep);
            return () => {
                console.log('WelcomeModal UNMOUNTS.');
            };
        }, [currentStep]); // This useEffect correctly logs changes to currentStep

        // This console.log is for debugging purposes to see immediate render state.
        console.log('--- WelcomeModal RENDERS --- currentStep:', currentStep);


        const handleSkipTour = () => {
            onClose(); // This sets hasSeenWelcomeModal to true in localStorage in the parent App component
        };

        // NEW: Function to start new app and then move to next tour step
        const handleStartNewAppThenNext = useCallback(() => {
            console.log('handleStartNewAppThenNext called.');
            // Clear all existing data and settings
            setAllWeeklyMealsData({});
            saveSettings({ // Reset settings to default
                pricePerMeal: 3.95,
                groupColors: {},
                menuColors: {},
                groupColorMixPercentage: 0,
                menuColorMixPercentage: 90,
                columnMappings: {
                    childName: '',
                    groupName: '',
                    parentLastName: '',
                    mealQuestionPrefix: 'FRAGE',
                    mealAnswerPrefix: 'ANTWORT',
                    menuCount: 2,
                    mealQuestionColumns: [],
                    mealAnswerColumns: [],
                },
            });
            showToast('App mit leeren Daten gestartet.', 'info');
            handleNext(); // Move to the next step of the tour
        }, [setAllWeeklyMealsData, saveSettings, showToast, handleNext]);

        // NEW: Function to handle import specifically within WelcomeModal and then move to next tour step
        const handleWelcomeModalImportThenNext = useCallback(async (event) => {
            console.log('handleWelcomeModalImportThenNext called.');
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const jsonString = e.target.result;
                        const importedData = JSON.parse(jsonString);
                        if (importedData.settings && importedData.allWeeklyMealsData) {
                            saveSettings(importedData.settings);
                            setAllWeeklyMealsData(importedData.allWeeklyMealsData);
                            showToast('Daten erfolgreich aus ESSEN-Datei importiert!', 'success');
                            handleNext(); // Move to the next step on success
                        } else {
                            showToast('Ungültiges Dateiformat.', 'error');
                            // If format is invalid, do NOT close the modal, allow user to try again
                        }
                    } catch (error) {
                        showToast('Fehler beim Verarbeiten der Datei: ' + error.message, 'error');
                        // If processing error, do NOT close the modal, allow user to try again
                    } finally {
                        if (event.target) {
                            event.target.value = ''; // Clear the input for re-selection
                        }
                    }
                };
                reader.onerror = () => {
                    showToast('Fehler beim Lesen der Datei.', 'error');
                    // If file reading fails, do NOT close the modal
                };
                reader.readAsText(file);
            } else {
                showToast('Keine Datei ausgewählt.', 'info');
                // If no file selected, do NOT close the modal
            }
        }, [saveSettings, setAllWeeklyMealsData, showToast, handleNext]);


        const triggerImportClick = useCallback(async () => {
            console.log('triggerImportClick called.');
            if (!('showOpenFilePicker' in window)) {
                // Fallback: Trigger the hidden file input
                fallbackImportInputRef.current.click();
                // handleWelcomeModalImportThenNext will be called by the onChange event of the hidden input
            } else {
                // Use the main App's import logic which uses showOpenFilePicker
                try {
                    // Pass handleNext directly as the callback to handleJsonImportAppLevel
                    // This ensures handleNext is called only after the async file operation completes (or aborts/errors)
                    await handleJsonImportAppLevel(handleNext); // Pass handleNext to be called by handleJsonImport
                } catch (error) {
                    console.error("Error during handleJsonImportAppLevel initiation:", error);
                    // If immediate synchronous error, still attempt to move to next step
                    handleNext();
                }
            }
        }, [handleJsonImportAppLevel, handleNext]);


        return (
            <Modal show={true} onClose={handleSkipTour} title="Willkommen beim Essensplaner!">
                <div className="p-4">
                    {currentStep === 1 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Schritt 1: Starte die Essensplanung</h3>
                            <p className="mb-6 text-gray-700">
                                Willkommen beim Kindergarten Essensplaner! Bevor du startest, kannst du vorhandene App-Daten importieren (z.B. aus einem Backup) oder mit einer frischen, leeren Anwendung beginnen.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-around space-y-4 sm:space-y-0 sm:space-x-4">
                                <button
                                    onClick={triggerImportClick}
                                    className={`px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition duration-200 shadow-md flex-1 text-center ${!('showOpenFilePicker' in window) ? 'opacity-50' : ''}`}
                                    title={!('showOpenFilePicker' in window) ? "Dein Browser unterstützt die erweiterte Dateiintegration nicht." : "App-Daten importieren"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" viewBox="0 0 15 15" fill="currentColor">
                                        <path d="M11.78 7.159a.75.75 0 0 0-1.06 0l-1.97 1.97V1.75a.75.75 0 0 0-1.5 0v7.379l-1.97-1.97a.75.75 0 0 0-1.06 1.06l3.25 3.25L8 12l.53-.53l3.25-3.25a.75.75 0 0 0 0-1.061ZM2.5 9.75a.75.75 0 1 0-1.5 0V13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.75a.75.75 0 0 0-1.5 0V13a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V9.75Z"/>
                                    </svg>
                                    App-Daten importieren (.essen Datei)
                                </button>
                                {/* Hidden input for fallback in WelcomeModal */}
                                <input
                                    type="file"
                                    id="welcomeJsonImportFileFallback" // Unique ID
                                    accept=".essen"
                                    className="hidden"
                                    onChange={handleWelcomeModalImportThenNext} // Handle change locally
                                    ref={fallbackImportInputRef}
                                />
                                <button
                                    onClick={handleStartNewAppThenNext}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition duration-200 shadow-md flex-1 text-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                                    </svg>
                                    Mit leerer App starten
                                </button>
                            </div>
                            {/* "Weiter zur Tour" button removed here */}
                        </div>
                    )}
                    {currentStep === 2 && (
                        <div>
                            {/* Inhalt von Schritt 2 aus der Konstante */}
                            <div dangerouslySetInnerHTML={{ __html: HELP_STEP_2_CONTENT }} />
                            <div className="flex justify-between mt-6">
                                <button onClick={handleBack} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition duration-200">
                                    Zurück
                                </button>
                                <button onClick={handleNext} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition duration-200">
                                    Weiter
                                </button>
                            </div>
                        </div>
                    )}
                    {currentStep === 3 && (
                        <div>
                            {/* Inhalt von Schritt 3 aus der Konstante */}
                            <div dangerouslySetInnerHTML={{ __html: HELP_STEP_3_CONTENT }} />
                            <div className="flex justify-between mt-6">
                                <button onClick={handleBack} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition duration-200">
                                    Zurück
                                </button>
                                <button onClick={handleSkipTour} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition duration-200">
                                    App starten!
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {/* Close button that also skips the tour */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                    onClick={handleSkipTour}
                >
                    &times;
                </button>
            </Modal>
        );
    };


    // Define kindergarten year options (e.g., "2023/2024", "2024/2025")
    const kindergartenYears = [];
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
        kindergartenYears.push(`${i.toString().slice(-2)}/${(i + 1).toString().slice(-2)}`); // Corrected line
    }

    // Months for the kindergarten year, starting in August (Index 7)
    const kindergartenMonths = [
        { name: 'Aug.', index: 7 },
        { name: 'Sept.', index: 8 },
        { name: 'Okt.', index: 9 },
        { name: 'Nov.', index: 10 },
        { name: 'Dez.', index: 11 },
        { name: 'Jan.', index: 0 },
        { name: 'Feb.', index: 1 },
        { name: 'März', index: 2 },
        { name: 'April', index: 3 },
        { name: 'Mai', index: 4 },
        { name: 'Juni', index: 5 },
        { name: 'Juli', index: 6 },
    ].sort((a, b) => { // Sort months to ensure correct chronological order for display
        // Create dummy dates in the same year to compare month order correctly
        const dateA = new Date(2000, a.index, 1);
        const dateB = new Date(2000, b.index, 1);
        return dateA.getTime() - dateB.getTime();
    });


    // Function to initiate printing (now directly calls window.print and sets options based on activeTab)
    const handleInitiatePrint = useCallback(() => {
        const printType = activeTab === 'Monat' ? 'monthly' : 'weeklyGrouped';
        setPrintOptions({ selectedPrintType: printType });
        setIsPrinting(true); // Trigger React to render the print-specific UI

        // Use setTimeout(0) to ensure React has completed its rendering cycle
        // before the browser's native print dialog is triggered.
        setTimeout(() => {
            console.log('Calling window.print()');
            window.print();

            // Reset print mode and options after the print dialog is closed (or attempted)
            // This needs another setTimeout because window.print() is blocking.
            setTimeout(() => {
                console.log('Resetting print mode after print dialog attempt.');
                setIsPrinting(false);
                setPrintOptions(null);
            }, 500); // Small delay to allow the print dialog to fully appear/close
        }, 0); // Execute after current call stack, allowing React to render
    }, [activeTab]); // Dependency on activeTab to determine printType


    // useEffect to handle initial load or external changes to year/month
    useEffect(() => {
        // Only run if the welcome modal is not shown or has been dismissed
        if (showWelcomeModal) {
            return;
        }

        // Calculate target year directly in useEffect with current status values
        const startYearTwoDigits = parseInt(selectedKindergartenYear.split('/')[0], 10);
        let fullStartYear = 2000 + startYearTwoDigits;
        if (startYearTwoDigits > (currentYear % 100) + 1) { // Heuristic for 1900s vs. 2000s
             fullStartYear = 1900 + startYearTwoDigits;
        }
        let effectiveTargetYear = fullStartYear;
        if (selectedMonthIndex < 7) {
            effectiveTargetYear = fullStartYear + 1;
        }

        const weeksForNewMonth = generateWeeksForYearAndMonth(effectiveTargetYear, selectedMonthIndex);

        let newDisplayedWeek = displayedWeekIso; // Start with the current displayed week
        let newActiveTab = activeTab;

        // Condition 1: Check if the currently displayed week is valid and has data
        const isCurrentWeekValidAndHasData =
            weeksForNewMonth.some(week => week.value === displayedWeekIso) &&
            allWeeklyMealsData[displayedWeekIso] &&
            Object.keys(allWeeklyMealsData[displayedWeekIso].meals).length > 0;

        if (isCurrentWeekValidAndHasData) {
            // If the current week is valid and has data, stay on it.
            // Also ensure we are on 'Woche' tab if we were on Startseite or Jahr.
            if (activeTab === 'Startseite' || activeTab === 'Jahr') {
                newActiveTab = 'Woche';
            }
        } else {
            // Condition 2: Current week is no longer valid or has no data, find the first available week with data
            let firstWeekWithDataIso = null;
            if (weeksForNewMonth.length > 0) {
                for (const week of weeksForNewMonth) {
                    if (allWeeklyMealsData[week.value] && Object.keys(allWeeklyMealsData[week.value].meals).length > 0) {
                        firstWeekWithDataIso = week.value;
                        break;
                    }
                }
            }

            if (firstWeekWithDataIso) {
                newDisplayedWeek = firstWeekWithDataIso;
                newActiveTab = 'Woche';
            } else {
                // If no more weeks with data in the month, go to Startseite or stay on current tab if it was already planner
                newActiveTab = ''; // Clear displayed week if no data available
                if (activeTab === 'Woche' || activeTab === 'Monat') { // If currently in a planner tab without data
                    newActiveTab = 'Startseite';
                } else {
                    newActiveTab = activeTab; // Stay on the current non-planner tab
                }
            }
        }

        // Only perform updates if the status would actually change
        if (newDisplayedWeek !== displayedWeekIso) {
            setDisplayedWeekIso(newDisplayedWeek);
        }
        if (newActiveTab !== activeTab) {
            setActiveTab(newActiveTab);
        }
    }, [selectedKindergartenYear, selectedMonthIndex, generateWeeksForYearAndMonth, allWeeklyMealsData, currentYear, setDisplayedWeekIso, setActiveTab, displayedWeekIso, activeTab, showWelcomeModal]);


    const hasDataForSelectedMonth = useMemo(() => {
        const weeksInCurrentMonth = generateWeeksForYearAndMonth(currentCalculatedTargetYear, selectedMonthIndex);
        return weeksInCurrentMonth.some(week =>
            allWeeklyMealsData[week.value] && Object.keys(allWeeklyMealsData[week.value].meals).length > 0
        );
    }, [currentCalculatedTargetYear, selectedMonthIndex, generateWeeksForYearAndMonth, allWeeklyMealsData]);

    const handleDeleteWeek = useCallback((iso) => {
        setWeekToDeleteIso(iso);
        setShowDeleteConfirmation(true);
    }, []);

    const confirmDeleteWeek = useCallback(() => {
        if (!weekToDeleteIso) return;

        setAllWeeklyMealsData(prevAllWeeklyMealsData => {
            const newAllWeeklyMealsData = { ...prevAllWeeklyMealsData };
            delete newAllWeeklyMealsData[weekToDeleteIso];

            // After deleting the week, we may need to update the displayed week
            const remainingWeeksInMonth = generateWeeksForYearAndMonth(currentCalculatedTargetYear, selectedMonthIndex)
                .filter(week => newAllWeeklyMealsData[week.value] && Object.keys(newAllWeeklyMealsData[week.value].meals).length > 0); // Only weeks with data

            let newDisplayedWeek = '';
            let newActiveTab = activeTab;

            if (remainingWeeksInMonth.length > 0) {
                newDisplayedWeek = remainingWeeksInMonth[0].value; // First remaining week with data
                newActiveTab = 'Woche'; // Ensure we are on the week tab
            } else {
                // If no more weeks with data in the month, switch to the home page
                newActiveTab = 'Startseite';
            }

            setDisplayedWeekIso(newDisplayedWeek);
            setActiveTab(newActiveTab);

            showToast(`Daten für Woche ${getWeekRange(new Date(weekToDeleteIso))} erfolgreich gelöscht!`, 'success');
            return newAllWeeklyMealsData;
        });

        setShowDeleteConfirmation(false);
        setWeekToDeleteIso(null);
    }, [weekToDeleteIso, setAllWeeklyMealsData, generateWeeksForYearAndMonth, currentCalculatedTargetYear, selectedMonthIndex, showToast, getWeekRange, activeTab]);

    // NEW: Collect all registered menus across all weeks (for dropdowns)
    const allRegisteredMenus = useMemo(() => {
        const uniqueMenus = new Set();
        Object.values(allWeeklyMealsData).forEach(weeklyData => {
            Object.values(weeklyData.meals || {}).forEach(groupData => {
                Object.values(groupData).forEach(childEntry => {
                    daysOfWeek.forEach(day => {
                        if (childEntry.dailyMeals && childEntry.dailyMeals[day]?.originalMenu) {
                            uniqueMenus.add(childEntry.dailyMeals[day].originalMenu);
                        }
                    });
                });
            });
        });
        return Array.from(uniqueMenus).sort();
    }, [allWeeklyMealsData]);

    // Function to save data to the file handle
    const saveToHandle = useCallback(async () => {
        if (!fileHandle || !autoSaveEnabled) return;

        try {
            // Check for write permission before writing
            const permissionStatus = await fileHandle.queryPermission({ mode: 'readwrite' });
            if (permissionStatus !== 'granted') {
                showToast('Keine Schreibberechtigung für die automatische Speicherung. Bitte manuell speichern.', 'info');
                setAutoSaveEnabled(false); // Disable auto-save if permission is lost
                return;
            }

            const dataToSave = {
                settings: settings,
                allWeeklyMealsData: allWeeklyMealsData
            };
            const jsonString = JSON.stringify(dataToSave, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });

            const writableStream = await fileHandle.createWritable();
            await writableStream.write(blob);
            await writableStream.close();
            // showToast('Daten automatisch gespeichert!', 'info'); // Maybe too frequent, consider removing
        } catch (error) {
            console.error('Fehler bei der automatischen Speicherung:', error);
            showToast('Fehler bei der automatischen Speicherung: ' + error.message, 'error');
            setAutoSaveEnabled(false);
        }
    }, [fileHandle, autoSaveEnabled, settings, allWeeklyMealsData, showToast]);

    // Effect to trigger auto-save when data or settings change (debounced for performance)
    useEffect(() => {
        if (!fileHandle || !autoSaveEnabled) return;

        const handler = setTimeout(() => {
            saveToHandle();
        }, 1000); // Debounce by 1 second

        return () => {
            clearTimeout(handler);
        };
    }, [settings, allWeeklyMealsData, fileHandle, autoSaveEnabled, saveToHandle]);

    // **NEU**: Hauptimportfunktion für .essen Dateien (verwendet File System Access API)
    // Jetzt mit einem optionalen Callback für den Erfolg oder Abbruch des Imports
    const handleJsonImport = useCallback(async (onCompletionCallback = () => {}) => {
        let handle = null;
        try {
            [handle] = await window.showOpenFilePicker({
                types: [{
                    description: 'Essensplan-Dateien',
                    accept: {
                        'application/json': ['.essen'],
                    },
                }],
            });

            if (!handle) {
                showToast('Dateiauswahl abgebrochen.', 'info');
                onCompletionCallback(); // Call callback on abort
                return;
            }

            const permissionStatus = await handle.requestPermission({ mode: 'readwrite' });

            if (permissionStatus === 'granted') {
                const file = await handle.getFile();
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const jsonString = e.target.result;
                        const importedData = JSON.parse(jsonString);
                        if (importedData.settings && importedData.allWeeklyMealsData) {
                            saveSettings(importedData.settings);
                            setAllWeeklyMealsData(importedData.allWeeklyMealsData);
                            setFileHandle(handle);
                            setAutoSaveEnabled(true);
                            showToast(`Daten erfolgreich von "${handle.name}" geladen und automatische Speicherung aktiviert!`, 'success');
                        } else {
                            showToast('Ungültiges Dateiformat. Erwartete Struktur: { settings: ..., allWeeklyMealsData: ... }', 'error');
                        }
                    } catch (error) {
                        showToast('Fehler beim Verarbeiten der Datei: ' + error.message, 'error');
                    } finally {
                        onCompletionCallback(); // Always call callback after processing
                    }
                };
                reader.readAsText(file);
            } else {
                showToast('Lese- oder Schreibzugriff auf die Datei wurde verweigert. Automatische Speicherung nicht möglich.', 'error');
                setFileHandle(null);
                setAutoSaveEnabled(false);
                onCompletionCallback(); // Call callback even if permission denied
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                showToast('Dateiauswahl abgebrochen.', 'info');
            } else {
                showToast('Fehler beim Laden der Datei: ' + error.message, 'error');
                console.error('File load error:', error);
            }
            setFileHandle(null);
            setAutoSaveEnabled(false);
            onCompletionCallback(); // Ensure this is called regardless of the outer try-catch outcome
        }
    }, [saveSettings, setAllWeeklyMealsData, setFileHandle, setAutoSaveEnabled, showToast]);

    // NEU: Funktion zum Neuverarbeiten aller Wochenpläne mit den aktuellen Spaltenzuordnungen
    const reprocessAllMealsData = useCallback(() => {
        setAllWeeklyMealsData(prevAllWeeklyMealsData => {
            const updatedAllWeeklyMealsData = {};
            let reprocessedCount = 0;

            Object.entries(prevAllWeeklyMealsData).forEach(([weekIso, weekData]) => {
                if (weekData.rawCsvData) { // Nur Wochen neu verarbeiten, die Rohdaten gespeichert haben
                    try {
                        const newProcessedMealsData = processCsvForWeeklyMeals(weekData.rawCsvData, settings); // Nutze die aktuellen Einstellungen
                        updatedAllWeeklyMealsData[weekIso] = {
                            ...weekData, // Bestehende Korrekturen bleiben erhalten
                            meals: newProcessedMealsData
                        };
                        reprocessedCount++;
                    } catch (error) {
                        console.error(`Fehler beim Neuverarbeiten der Daten für Woche ${weekIso}:`, error);
                        // Im Fehlerfall die alten Daten beibehalten oder als leer markieren
                        updatedAllWeeklyMealsData[weekIso] = weekData;
                        showToast(`Fehler beim Neuverarbeiten der Daten für Woche ${getWeekRange(new Date(weekIso))}.`, 'error');
                    }
                } else {
                    // Wenn keine Rohdaten vorhanden sind, alte Daten beibehalten
                    updatedAllWeeklyMealsData[weekIso] = weekData;
                }
            });

            if (reprocessedCount > 0) {
                showToast(`Alle ${reprocessedCount} Wochenpläne mit neuen Einstellungen neu verarbeitet!`, 'success');
            } else {
                showToast('Keine Wochenpläne zur Neuverarbeitung gefunden oder keine Rohdaten vorhanden.', 'info');
            }

            return updatedAllWeeklyMealsData;
        });
    }, [processCsvForWeeklyMeals, settings, showToast, getWeekRange]); // Abhängigkeiten sicherstellen

    // Effect to load persisted file handle on app start
    useEffect(() => {
        const loadPersistedHandle = async () => {
            // Nur versuchen, den persistenten Handle zu laden, wenn das WelcomeModal NICHT angezeigt wird,
            // d.h. der Benutzer hat es bereits gesehen oder Daten wurden explizit geladen/gespeichert.
            if (showWelcomeModal) {
                console.log('loadPersistedHandle: WelcomeModal ist aktiv, Überspringe das Laden des persistenten Handles.');
                return; // Nicht den persistenten Handle laden, wenn das WelcomeModal sichtbar ist
            }

            if (!('showOpenFilePicker' in window)) {
                return; // Funktion wird nicht unterstützt
            }
            if (hasCheckedForPersistedHandle) { // Dieses Flag sollte ausreichen, wenn die App nicht neu gemountet wird
                return;
            }

            // Hole die Präferenz für die automatische Speicherung aus localStorage
            const savedAutoSavePreference = localStorage.getItem(AUTO_SAVE_PREFERENCE_KEY);
            const userPrefersAutoSave = savedAutoSavePreference !== null ? JSON.parse(savedAutoSavePreference) : true; // Standardwert ist true

            if (!userPrefersAutoSave) {
                console.log("Die automatische Speicherung ist durch Benutzereinstellung deaktiviert. Es wird kein Dateihandle geladen.");
                setHasCheckedForPersistedHandle(true); // Als geprüft markieren
                return; // Nicht mit dem Laden des Dateihandles fortfahren
            }

            try {
                const handle = await getFileHandleFromDb();
                if (handle) {
                    // Überprüfen, ob die Berechtigung noch erteilt ist
                    const permissionStatus = await handle.queryPermission({ mode: 'readwrite' });
                    if (permissionStatus === 'granted') {
                        setFileHandle(handle);
                        setAutoSaveEnabled(true);

                        // Daten aus dem persistenten Handle laden
                        const fileContent = await handle.getFile();
                        const text = await fileContent.text();
                        const parsedData = JSON.parse(text);
                        setSettings(parsedData.settings);
                        setAllWeeklyMealsData(parsedData.allWeeklyMealsData);

                        showToast(`Zuletzt verwendete Datei "${handle.name}" gefunden und geladen. Automatische Speicherung aktiviert.`, 'success');
                    } else {
                        // Berechtigung abgelaufen oder verweigert
                        showToast('Berechtigung für die zuletzt gespeicherte Datei abgelaufen. Bitte neu auswählen.', 'info');
                        setAutoSaveEnabled(false);
                    }
                } else {
                    showToast('Keine zuletzt verwendete Datei gefunden. Starte mit der lokalen Speicherung.', 'info');
                }
            } catch (error) {
                console.error('Fehler beim Laden des Dateiverweises oder der Daten:', error);
                showToast('Fehler beim Laden der Datei: ' + error.message, 'error');
                setAutoSaveEnabled(false);
            } finally {
                setHasCheckedForPersistedHandle(true); // Flag setzen, dass die Prüfung durchgeführt wurde
            }
        };

        loadPersistedHandle();
    }, [showToast, hasCheckedForPersistedHandle, setSettings, setAllWeeklyMealsData, setAutoSaveEnabled, showWelcomeModal]); // showWelcomeModal als Abhängigkeit hinzugefügt

    // Effect to save fileHandle to IndexedDB whenever it changes
    useEffect(() => {
        if (fileHandle) {
            saveFileHandleToDb(fileHandle).catch(error => {
                console.error('Error saving file handle to IndexedDB:', error);
                showToast('Fehler beim Speichern des Dateiverweises.', 'error');
            });
        }
    }, [fileHandle, showToast]);

    // Memoize the onClose callback for WelcomeModal
    const handleCloseWelcomeModal = useCallback(() => {
        console.log('handleCloseWelcomeModal called. Setting showWelcomeModal to false.');
        setShowWelcomeModal(false);
        localStorage.setItem('hasSeenWelcomeModal', 'true');
    }, []);

    // Memoized handleNext/handleBack functions for WelcomeModal
    const handleWelcomeModalNext = useCallback(() => {
        setWelcomeModalCurrentStep(prev => prev + 1);
    }, []);

    const handleWelcomeModalBack = useCallback(() => {
        setWelcomeModalCurrentStep(prev => prev - 1);
    }, []);


    return (
        <div id="app-container" className="min-h-screen bg-gray-100 font-inter">
            {/* Global styles for printing */}
            <style>
                {`
                /* Ensure Inter font is available */
                body {
                    font-family: 'Inter', sans-serif;
                    /* Basic font for the whole app */
                    -webkit-print-color-adjust: exact; /* Forcing Chrome/Safari to print background colors and images */
                    color-adjust: exact; /* Standard property */
                }

                @media print {
                    /* Add general body/html reset for print */
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: auto !important;
                        height: auto !important;
                        overflow: visible !important; /* Ensure content is not clipped */
                    }

                    /* Hide the normal app content when printing */
                    .normal-app-content {
                        display: none !important;
                        visibility: hidden !important;
                        height: 0 !important;
                        width: 0 !important;
                        overflow: hidden !important;
                    }

                    /* Ensure the print-mode-wrapper is visible and takes full space */
                    .print-mode-wrapper {
                        display: block !important;
                        /* Removed explicit width/height: Let the browser manage dimensions for proper pagination */
                        margin: 0 !important;
                        padding: 0 !important;
                        background-color: white !important;
                        box-shadow: none !important;
                        position: static !important; /* Changed from absolute to static for normal document flow */
                        z-index: 9999 !important;
                        overflow: visible !important; /* Important for page breaks */
                        font-family: 'Inter', sans-serif !important; /* Ensure font consistency */
                        font-size: 10pt !important; /* Global print font size */
                    }

                    /* Hide toast messages when printing */
                    .toast-message-container {
                        display: none !important;
                        visibility: hidden !important;
                    }
                    /* Hide modal backgrounds and modal content when printing */
                    .fixed.inset-0.bg-gray-600.bg-opacity-75 { /* Modal overlay */
                        display: none !important;
                        visibility: hidden !important;
                    }
                    .fixed.inset-0.bg-gray-600.bg-opacity-75 > div { /* Modal content */
                        display: none !important;
                        visibility: hidden !important;
                    }


                    /* Orientation for printing */
                    @page {
                        /* size: A4; <-- REMOVED THIS LINE COMPLETELY */
                        margin: 1cm !important; /* Standard margins for all pages */
                    }

                    .print-area {
                        width: 100% !important;
                        padding: 0 !important; /* Remove padding from this wrapper, margins handled by @page */
                        box-sizing: border-box !important;
                    }

                    /* Page breaks for weekly view per group */
                    .group-table-print {
                        page-break-inside: avoid !important; /* Prevent breaking inside a group table */
                        page-break-after: always !important; /* Force a page break after each group */
                        margin-bottom: 2cm !important; /* Space between tables, if they fit */
                        border-width: 1px !important;
                        border-style: solid !important;
                        border-radius: 0 !important; /* No rounded corners for print if it causes issues */
                        box-shadow: none !important; /* No shadows for print */
                    }
                    .group-table-print h3 {
                        font-size: 14pt !important; /* Larger font for group headings */
                        text-align: left !important;
                        margin-bottom: 0.5cm !important;
                    }

                    /* Caterer summary and monthly tables */
                    .caterer-summary-print,
                    .child-orders-table,
                    .caterer-monthly-summary-table {
                        page-break-before: auto !important; /* Allow page breaks before if needed, but not forced for every section */
                        page-break-inside: avoid !important; /* Keep tables on one page if possible */
                        border-width: 1px !important;
                        border-style: solid !important;
                        border-color: #e5e7eb !important; /* Matched app's light gray border */
                        border-radius: 0 !important;
                        box-shadow: none !important;
                        background-color: white !important; /* Force white background */
                        margin-bottom: 1cm !important; /* Consistent spacing */
                    }
                    .caterer-summary-print h2,
                    .child-orders-table h3,
                    .caterer-monthly-summary-table h3 {
                        color: #333 !important; /* Ensure dark color for headings */
                        font-size: 14pt !important;
                        text-align: left !important;
                        margin-bottom: 0.5cm !important;
                    }


                    /* Title on each printed page (for PlannerView) */
                    .print-title {
                        text-align: center !important;
                        font-size: 20pt !important;
                        font-weight: bold !important;
                        margin-bottom: 1cm !important;
                        margin-top: 0 !important;
                        page-break-after: avoid !important; /* Prevents title from breaking directly at page end */
                        /* REMOVED: color: #000 !important; to allow inline style to take precedence */
                    }
                    /* Specific margin adjustments for the weekly title when repeated */
                    .print-title-weekly {
                        margin-top: 0.5cm !important; /* Add some space above the repeated weekly title */
                        margin-bottom: 0.5cm !important; /* Space below the weekly title */
                        font-size: 16pt !important; /* Slightly smaller than overall print title */
                    }


                    /* General table styles for printing to maintain app appearance */
                    .print-table-wrapper table { /* Targets the inner tables */
                        width: 100% !important; /* Ensure tables take full width */
                        border-collapse: collapse !important;
                        border: none !important; /* No double borders from wrapper and table */
                        background-color: white !important; /* Force white background for the whole table */
                        table-layout: fixed !important; /* Added for better column control */
                    }
                    /* Override table-layout for the monthly child summary table */
                    .child-orders-table .print-table-wrapper table {
                        table-layout: auto !important; /* Allow columns to size based on content */
                    }
                    /* NEW: Override table-layout for weekly group tables */
                    .group-table-print .print-table-wrapper table {
                        table-layout: auto !important; /* Allow columns to size based on content */
                    }


                    .print-table-wrapper th,
                    .print-table-wrapper td {
                        border: 1px solid #e5e7eb !important; /* Matched app's light gray border */
                        padding: 8px !important; /* Increased padding */
                        font-size: 9pt !important; /* Slightly smaller font for table cells */
                        color: #333 !important; /* Force dark text for all cells */
                        vertical-align: middle !important; /* Center content vertically */
                    }
                    /* Specific padding and font size for the monthly child orders table */
                    .child-orders-table .print-table-wrapper th,
                    .child-orders-table .print-table-wrapper td {
                        padding: 2px 4px !important; /* Further reduced padding */
                        font-size: 8pt !important; /* Even smaller font for this table */
                        vertical-align: top !important; /* Align to top for compact rows */
                        white-space: normal !important; /* Allow text wrapping by default */
                    }

                    /* Specific column width adjustments for the monthly child orders table */
                    .child-orders-table .print-table-wrapper th:nth-child(1), /* Nachname Eltern */
                    .child-orders-table .print-table-wrapper td:nth-child(1) {
                        width: auto !important; /* Allow content to dictate width, but not expand unnecessarily */
                        max-width: 30% !important; /* Cap it if necessary */
                        text-align: left !important;
                    }
                    .child-orders-table .print-table-wrapper th:nth-child(2), /* Name */
                    .child-orders-table .print-table-wrapper td:nth-child(2) {
                        width: auto !important;
                        max-width: 30% !important; /* Cap it if necessary */
                        text-align: left !important;
                    }
                    .child-orders-table .print-table-wrapper th:nth-child(3), /* Gesamtessen */
                    .child-orders-table .print-table-wrapper td:nth-child(3),
                    .child-orders-table .print-table-wrapper th:nth-child(4), /* Gesamtkosten */
                    .child-orders-table .print-table-wrapper td:nth-child(4) {
                        width: 1% !important; /* Shrink to content */
                        white-space: nowrap !important; /* Keep content on one line */
                        text-align: center !important;
                    }
                    /* For summary row */
                    .child-orders-table .print-table-wrapper tbody tr.bg-blue-100 td:nth-last-child(2), /* Gesamtessen */
                    .child-orders-table .print-table-wrapper tbody tr.bg-blue-100 td:last-child { /* Gesamtkosten */
                        width: 1% !important; /* Apply to summary row as well */
                        white-space: nowrap !important;
                        text-align: center !important;
                    }


                    /* Specific alignment for headers */
                    .print-table-wrapper thead th {
                        text-align: center !important; /* Default for all headers to be centered */
                        background-color: #f0f0f0 !important; /* Light gray background for headers */
                        font-weight: bold !important;
                        color: #333 !important;
                        white-space: nowrap !important; /* Keep headers on single line */
                    }
                    /* Override for the descriptive text headers that should be left-aligned */
                    .child-orders-table .print-table-wrapper thead th:first-child, /* Parent Last Name */
                    .child-orders-table .print-table-wrapper thead th:nth-child(2), /* Child Name */
                    .group-table-print .print-table-wrapper thead th:first-child, /* Child Name in weekly group */
                    .caterer-monthly-summary-table .print-table-wrapper thead th:first-child /* Menu in monthly caterer */
                    {
                         text-align: left !important;
                    }


                    /* Alignment for data cells */
                    .print-table-wrapper tbody td {
                        text-align: center !important; /* All data cells centered by default */
                        background-color: white !important; /* Default white background for all data cells */
                        white-space: normal !important; /* Allow wrapping unless specified otherwise */
                    }
                    .print-table-wrapper tbody td:first-child { /* Child Name column or Parent Last Name column */
                        text-align: left !important;
                        white-space: normal !important; /* Allow names to wrap in weekly groups */
                    }
                    .print-table-wrapper tbody td:nth-child(2) { /* Child Name column in Monthly */
                        text-align: left !important;
                        white-space: normal !important; /* Allow names to wrap in monthly */
                    }
                    /* NEW: Align last column of group tables to center */
                    .group-table-print .print-table-wrapper tbody td:last-child {
                        text-align: center !important;
                    }

                    /* Striping for table rows (odd/even) */
                    .print-table-wrapper tr.odd\\:bg-gray-50:nth-child(odd) td {
                        background-color: #f9f9f9 !important; /* Very light gray for odd rows */
                    }
                    .print-table-wrapper tr.odd\\:bg-gray-50:nth-child(even) td {
                        background-color: white !important; /* White for even rows */
                    }

                    /* Ensure specific right alignment for summary rows where applicable */
                    .print-table-wrapper .bg-blue-50 td, /* Group total row (weekly) */
                    .print-table-wrapper .bg-blue-100 td { /* Overall total rows in monthly view */
                        background-color: #e6f7ff !important; /* Light blue background for summary rows */
                        font-weight: bold !important;
                        color: #2563eb !important; /* Specific color for summary row */
                    }
                    .print-table-wrapper .bg-blue-50 td:first-child,
                    .print-table-wrapper .bg-blue-100 td:first-child {
                        text-align: left !important;
                    }
                    /* NEW: Explicitly center the numeric totals in the monthly child summary row */
                    .child-orders-table .print-table-wrapper tbody tr.bg-blue-100 td:nth-last-child(2), /* Gesamtessen */
                    .child-orders-table .print-table-wrapper tbody tr.bg-blue-100 td:last-child { /* Gesamtkosten */
                        text-align: center !important;
                    }


                    /* Specific styles for the caterer tables (weekly and monthly) */
                    .caterer-summary-print .print-table-wrapper tbody td,
                    .caterer-monthly-summary-table .print-table-wrapper tbody td {
                        text-align: center !important; /* Ensure all data cells are centered */
                        white-space: nowrap !important; /* Numbers should not wrap */
                    }
                    /* Override for the first column (menu name) in caterer tables */
                    .caterer-summary-print .print-table-wrapper tbody td:first-child,
                    .caterer-monthly-summary-table .print-table-wrapper tbody td:first-child {
                        text-align: left !important; /* Menu name specifically left-aligned */
                        white-space: normal !important; /* Allow menu names to wrap if long */
                    }

                    /* Adjust font size and column layout for the monthly caterer summary table to fit more content */
                    .caterer-monthly-summary-table .print-table-wrapper table {
                        table-layout: auto !important; /* Changed to auto for menu column */
                    }
                    .caterer-monthly-summary-table .print-table-wrapper th,
                    .caterer-monthly-summary-table .print-table-wrapper td {
                        font-size: 7pt !important; /* Smaller font for monthly caterer table */
                        padding: 3px !important; /* Reduce padding for smaller cells */
                        white-space: nowrap !important; /* Keep dates on one line */
                    }
                    .caterer-monthly-summary-table .print-table-wrapper tbody td:first-child {
                        font-size: 8pt !important; /* Slightly larger for menu names */
                        white-space: normal !important; /* Allow wrapping for menu names */
                        width: auto !important; /* Allow width to be determined by content */
                    }
                    .caterer-monthly-summary-table .print-table-wrapper {
                        overflow-x: hidden !important; /* Hide scrollbar for print */
                    }


                    /* Ensure background and text colors are preserved for colored rows in caterer tables */
                    .caterer-summary-print .print-table-wrapper tbody tr[style*="background-color"] td,
                    .caterer-monthly-summary-table .print-table-wrapper tbody tr[style*="background-color"] td {
                        background-color: inherit !important; /* Inherit from the parent tr */
                        color: inherit !important; /* Also inherit text color */
                    }


                    /* Target the inner div within the td for meal entries to remove its background and center content */
                    .print-table-wrapper td > div {
                        /* Background color is now explicitly set via inline styles in React,
                           so we ensure no CSS overrides it to transparent unless 'Abbestellt' */
                        border: none !important; /* Remove its border, let the td handle it */
                        box-shadow: none !important; /* Remove any box-shadow if present */
                        display: flex !important; /* Ensure flexbox behavior for centering */
                        align-items: center !important; /* Center vertically */
                        justify-content: center !important; /* Center horizontally */
                        width: 100% !important; /* Ensure it takes full width of the cell */
                        height: 100% !important; /* Ensure it takes full height of the cell */
                        padding: 0 !important; /* Remove any padding from the inner div */
                        margin: 0 !important; /* Remove any margin from the inner div */
                        color: #333 !important; /* Ensure text is dark */
                        text-decoration: none !important; /* Remove strikethrough for "Abbestellt" */
                    }

                    /* Ensure "Abbestellt" is still visually distinct but without strikethrough */
                    .print-table-wrapper td > div.is-abbestellt {
                        color: #999 !important; /* Lighter gray for cancelled items */
                        text-decoration: none !important; /* Explicitly remove strikethrough for print */
                        font-style: italic !important; /* Make it italic instead */
                    }

                    /* Remove any hover effects in print */
                    .print-table-wrapper tr:hover {
                        background-color: inherit !important;
                    }

                    /* Hide any interactive elements or buttons in print */
                    .print-area button,
                    .print-area select,
                    .print-area input,
                    .print-area label[for*="file"],
                    .print-area .flex-justify-end { /* Targeting button groups */
                        display: none !important;
                    }
                }
                `}
            </style>

            {/* Conditional rendering: Render only printable content or the full app or the welcome modal */}
            {isPrinting ? (
                // Render print-specific UI only if PRINTING
                <div className="print-mode-wrapper">
                    <PlannerView
                        activeTab={printOptions?.selectedPrintType === 'monthly' ? 'Monat' : 'Woche'}
                        settings={settings}
                        showToast={showToast}
                        displayedWeekIso={displayedWeekIso}
                        setDisplayedWeekIso={setDisplayedWeekIso}
                        allWeeklyMealsData={allWeeklyMealsData}
                        setAllWeeklyMealsData={setAllWeeklyMealsData}
                        selectedKindergartenYear={selectedKindergartenYear}
                        selectedMonthIndex={selectedMonthIndex}
                        generateWeeksForYearAndMonth={generateWeeksForYearAndMonth}
                        handlePrint={handleInitiatePrint}
                        formatDate={formatDate}
                        getWeekRange={getWeekRange}
                        targetYear={currentCalculatedTargetYear}
                        setShowImportModal={setShowImportModal}
                        handleDeleteWeek={handleDeleteWeek}
                        isPrinting={true} // Indicate that it's in print mode
                        printOptions={printOptions} // Pass print options to control rendering within PlannerView
                        allRegisteredMenus={allRegisteredMenus} // Pass to PlannerView
                        // NEU: Sortierkonfigurationen weitergeben
                        groupSortConfig={groupSortConfig}
                        setGroupSortConfig={setGroupSortConfig}
                        monthlyChildSortConfig={monthlyChildSortConfig}
                        setMonthlyChildSortConfig={setMonthlyChildSortConfig}
                    />
                </div>
            ) : (
                // Render the full interactive app when not in printing mode
                <div className="normal-app-content">
                    <header className="bg-blue-600 text-white p-4 shadow-md rounded-b-lg">
                        <div className="container mx-auto flex justify-between items-center">
                            <h1 className="text-2xl font-bold">Kindergarten Essensplaner</h1>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <select
                                        value={selectedKindergartenYear}
                                        onChange={(e) => setSelectedKindergartenYear(e.target.value)}
                                        className="bg-blue-700 text-white px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none pr-8"
                                    >
                                        {kindergartenYears.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>

                                <nav className="hidden md:flex space-x-2">
                                    {kindergartenMonths.map(month => (
                                        <button
                                            key={month.index}
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                selectedMonthIndex === month.index ? 'bg-blue-700' : 'hover:bg-blue-500'
                                            }`}
                                            onClick={() => {
                                                const newMonthIndex = month.index;
                                                // Calculate target year for the new month directly here
                                                const startYearTwoDigits = parseInt(selectedKindergartenYear.split('/')[0], 10);
                                                let fullStartYear = 2000 + startYearTwoDigits;
                                                if (startYearTwoDigits > (currentYear % 100) + 1) { // Heuristic for 1900s vs. 2000s
                                                     fullStartYear = 1900 + startYearTwoDigits;
                                                }
                                                let targetYearForNewMonth = fullStartYear;
                                                if (newMonthIndex < 7) { // January-July (0-6) belong to the next calendar year of the kindergarten cycle
                                                    targetYearForNewMonth = fullStartYear + 1;
                                                }

                                                const weeksForClickedMonth = generateWeeksForYearAndMonth(targetYearForNewMonth, newMonthIndex);

                                                let newDisplayedWeekIso = '';
                                                if (weeksForClickedMonth.length > 0) {
                                                    // Find the first week in the new month that contains actual imported data
                                                    let firstWeekWithData = weeksForClickedMonth.find(week =>
                                                        allWeeklyMealsData[week.value] && Object.keys(allWeeklyMealsData[week.value].meals).length > 0
                                                    );
                                                    if (firstWeekWithData) {
                                                        newDisplayedWeekIso = firstWeekWithData.value;
                                                    } else {
                                                        // If no data found, default to the first week of the month
                                                        newDisplayedWeekIso = weeksForClickedMonth[0].value;
                                                    }
                                                }

                                                // Update all associated states at once for better batching and smoother UX
                                                setSelectedMonthIndex(newMonthIndex);
                                                setDisplayedWeekIso(newDisplayedWeekIso);
                                                setActiveTab('Woche');
                                            }}
                                        >
                                            {month.name}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </header>

                    <main className="container mx-auto p-4 flex-grow">
                        <div className="flex justify-between items-center mb-4">
                            {/* The title that changes dynamically */}
                            {activeTab === 'Startseite' && (
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Willkommen
                                </h2>
                            )}
                            {activeTab === 'Woche' && (
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Wochenplan {getWeekRange(new Date(displayedWeekIso))}
                                </h2>
                            )}
                            {activeTab === 'Monat' && (
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Monatsübersicht für {new Date(currentCalculatedTargetYear, selectedMonthIndex).toLocaleString('de-DE', { month: 'long' })} {currentCalculatedTargetYear}
                                </h2>
                            )}
                            {activeTab === 'Jahr' && (
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Jahresübersicht
                                </h2>
                            )}
                            {activeTab === 'Einstellungen' && (
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Einstellungen
                                </h2>
                            )}

                            <div className="flex space-x-2">
                                {/* Week buttons */}
                                {generateWeeksForYearAndMonth(
                                    currentCalculatedTargetYear, // Use the consistently calculated target year
                                    selectedMonthIndex
                                ).map((week, idx) => {
                                    const isWeekImported = !!allWeeklyMealsData[week.value] && Object.keys(allWeeklyMealsData[week.value].meals).length > 0;
                                    const buttonClasses = `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        displayedWeekIso === week.value && activeTab === 'Woche'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : isWeekImported
                                                ? 'bg-white text-gray-700 hover:bg-blue-100 border border-gray-300'
                                                : 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed' // Add cursor-not-allowed
                                    }`;
                                    return (
                                        <button
                                            key={week.value}
                                            className={buttonClasses}
                                            onClick={() => {
                                                if (isWeekImported) { // Re-add this check
                                                    setDisplayedWeekIso(week.value);
                                                    setActiveTab('Woche');
                                                }
                                            }}
                                            disabled={!isWeekImported} // Re-add this attribute
                                        >
                                            Woche {idx + 1}
                                        </button>
                                    );
                                })}

                                {/* Monthly list button */}
                                <button
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === 'Monat' && hasDataForSelectedMonth
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : hasDataForSelectedMonth
                                                ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                    onClick={() => setActiveTab('Monat')} // Explicitly set to 'Monat'
                                    disabled={!hasDataForSelectedMonth}
                                >
                                    Monatsliste
                                </button>

                                {/* Print button */}
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition duration-300 ease-in-out shadow-md flex items-center justify-center w-10 h-10"
                                    onClick={handleInitiatePrint} // Direct call to handleInitiatePrint
                                    title="Drucken"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6V2h12v7z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="w-full">
                            {activeTab === 'Startseite' && <HomePage />}
                            {(activeTab === 'Woche' || activeTab === 'Monat') && <PlannerView
                                                        activeTab={activeTab}
                                                        settings={settings}
                                                        showToast={showToast}
                                                        displayedWeekIso={displayedWeekIso}
                                                        setDisplayedWeekIso={setDisplayedWeekIso}
                                                        allWeeklyMealsData={allWeeklyMealsData}
                                                        setAllWeeklyMealsData={setAllWeeklyMealsData}
                                                        selectedKindergartenYear={selectedKindergartenYear}
                                                        selectedMonthIndex={selectedMonthIndex}
                                                        generateWeeksForYearAndMonth={generateWeeksForYearAndMonth}
                                                        handlePrint={handleInitiatePrint} // Change call to handleInitiatePrint
                                                        formatDate={formatDate}
                                                        getWeekRange={getWeekRange} // Pass getWeekRange here
                                                        targetYear={currentCalculatedTargetYear} // Pass calculated target year
                                                        setShowImportModal={setShowImportModal} // Pass setter to PlannerView
                                                        handleDeleteWeek={handleDeleteWeek} // Pass delete function
                                                        isPrinting={false} // Important: In normal mode, isPrinting is false
                                                        allRegisteredMenus={allRegisteredMenus} // Pass to PlannerView
                                                        // NEU: Sortierkonfigurationen weitergeben
                                                        groupSortConfig={groupSortConfig}
                                                        setGroupSortConfig={setGroupSortConfig}
                                                        monthlyChildSortConfig={monthlyChildSortConfig}
                                                        setMonthlyChildSortConfig={setMonthlyChildSortConfig}
                                                    />}
                            {/* SettingsPage is now rendered in the modal */}
                        </div>
                    </main>

                    <button
                        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity75"
                        onClick={() => setShowSettingsModal(true)} // Changed to show modal
                        title="Einstellungen"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.09-.73-1.72-.98l-.37-2.65c-.06-.24-.27-.42-.52-.42h-4c-.25 0-.46.18-.52.42l-.37 2.65c-.63.25-1.2.58-1.72.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.09.73 1.72.98l.37 2.65c.06.24.27.42.52.42h4c.25 0 .46-.18.52-.42l.37-2.65c.63-.25 1.2-.58 1.72-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                        </svg>
                    </button>

                    {/* Floating Action Button for CSV Import */}
                    <button
                        className="fixed bottom-20 right-4 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-transform duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-75"
                        onClick={() => setShowImportModal(true)}
                        title="CSV Importieren"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13 4v7h7v2h-7v7h-2v-7H4v-2h7V4h2Z"/>
                        </svg>
                    </button>

                    {/* NEU: Floating Action Button für Hilfe */}
                    <button
                        className="fixed bottom-36 right-4 bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-full shadow-lg transition-transform duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75"
                        onClick={() => setShowHelpModal(true)} // Öffnet das Hilfe-Modal
                        title="Hilfe & Anleitung"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.43 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                        </svg>
                    </button>
                </div>
            )}

            {/* Modals and Toast are rendered unconditionally, as they float over everything */}
            {/* Settings Modal */}
            <Modal show={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Einstellungen">
                <SettingsPage
                    settings={settings}
                    saveSettings={saveSettings}
                    csvData={csvData}
                    showToast={showToast}
                    allWeeklyMealsData={allWeeklyMealsData}
                    setAllWeeklyMealsData={setAllWeeklyMealsData}
                    fileHandle={fileHandle}
                    setFileHandle={setFileHandle}
                    autoSaveEnabled={autoSaveEnabled}
                    setAutoSaveEnabled={setAutoSaveEnabled}
                    handleJsonImportAppLevel={handleJsonImport}
                    reprocessAllMealsData={reprocessAllMealsData}
                />
            </Modal>

            {/* CSV Import Modal */}
            <Modal show={showImportModal} onClose={() => setShowImportModal(false)} title="CSV Importieren">
                <p className="mb-4 text-gray-700">Wähle die Woche aus, für die du die CSV-Daten importieren möchtest, und lade dann die Datei hoch.</p>
                <div className="flex flex-col space-y-4">
                    <label htmlFor="import-week-select" className="text-gray-700 font-medium">Woche für Import:</label>
                    <select
                        id="import-week-select"
                        value={selectedImportWeekIso}
                        onChange={(e) => setSelectedImportWeekIso(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        disabled={
                            (() => {
                                // Dynamic `disabled` attribute
                                const weeksForImportMonth = generateWeeksForYearAndMonth(currentCalculatedTargetYear, selectedMonthIndex);
                                const availableWeeksForImport = weeksForImportMonth.filter(week =>
                                    !(allWeeklyMealsData[week.value] && Object.keys(allWeeklyMealsData[week.value].meals).length > 0)
                                );
                                return availableWeeksForImport.length === 0;
                            })()
                        }
                    >
                        {
                            (() => {
                                const weeksForImportMonth = generateWeeksForYearAndMonth(currentCalculatedTargetYear, selectedMonthIndex);
                                const availableWeeksForImport = weeksForImportMonth.filter(week =>
                                    !(allWeeklyMealsData[week.value] && Object.keys(allWeeklyMealsData[week.value].meals).length > 0)
                                );
                                return availableWeeksForImport.length > 0 ? (
                                    availableWeeksForImport.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))
                                ) : (
                                    <option value="">Alle Wochen in diesem Monat enthalten Daten</option>
                                );
                            })()
                        }
                    </select>

                    <input
                        type="file"
                        id="csvImportFile"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => handleFileSelectAndImport(e, selectedImportWeekIso)}
                        disabled={
                            (() => {
                                const weeksForImportMonth = generateWeeksForYearAndMonth(currentCalculatedTargetYear, selectedMonthIndex);
                                const availableWeeksForImport = weeksForImportMonth.filter(week =>
                                    !(allWeeklyMealsData[week.value] && Object.keys(allWeeklyMealsData[week.value].meals).length > 0)
                                );
                                return availableWeeksForImport.length === 0;
                            })()
                        }
                    />
                    <label
                        htmlFor="csvImportFile"
                        className={`cursor-pointer font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center justify-center ${
                            (() => {
                                const weeksForImportMonth = generateWeeksForYearAndMonth(currentCalculatedTargetYear, selectedMonthIndex);
                                const availableWeeksForImport = weeksForImportMonth.filter(week =>
                                    !(allWeeklyMealsData[week.value] && Object.keys(allWeeklyMealsData[week.value].meals).length > 0)
                                );
                                return availableWeeksForImport.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white';
                            })()
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13 4v7h7v2h-7v7h-2v-7H4v-2h7V4h2Z"/>
                        </svg>
                        CSV-Datei auswählen und importieren
                    </label>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)} title="Woche löschen bestätigen">
                <p className="mb-4 text-gray-700">
                    Möchtest du die Daten für Woche <span className="font-semibold">{weekToDeleteIso ? getWeekRange(new Date(weekToDeleteIso)) : ''}</span> wirklich dauerhaft löschen?
                    Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => setShowDeleteConfirmation(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition duration-200"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={confirmDeleteWeek}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition duration-200"
                    >
                        Löschen
                    </button>
                </div>
            </Modal>

            {/* First Time Welcome Modal */}
            {showWelcomeModal && (
                <WelcomeModal
                    key="welcome-modal" // Hinzugefügter stabiler Schlüssel
                    onClose={handleCloseWelcomeModal} // Use the memoized callback here
                    handleJsonImportAppLevel={handleJsonImport}
                    showToast={showToast}
                    setAllWeeklyMealsData={setAllWeeklyMealsData}
                    saveSettings={saveSettings}
                    currentStep={welcomeModalCurrentStep} // Pass current step as prop
                    handleNext={handleWelcomeModalNext}     // Pass next step handler
                    handleBack={handleWelcomeModalBack}     // Pass back step handler
                />
            )}

            {/* NEU: Rendering des Hilfe-Modals */}
            {showHelpModal && <HelpModal show={showHelpModal} onClose={() => setShowHelpModal(false)} />}


            <Toast message={toastMessage.text} type={toastMessage.type} />
        </div>
    );
};

export default App;
