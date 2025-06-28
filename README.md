# Kindergarten Essensplaner
## Beschreibung
Der Kindergarten Essensplaner ist eine praktische Webanwendung, die als Companion App zur Stayinformed App dient. Sie wurde entwickelt, um die Verwaltung von Essensbestellungen für Kindergärten und ähnliche Einrichtungen erheblich zu vereinfachen. Durch den Import von Bestelldaten aus CSV-Exporten der Stayinformed App ermöglicht die Anwendung eine übersichtliche Visualisierung, einfache Korrektur und präzise Abrechnung der Mahlzeiten. Die App hilft dabei, manuelle Listen zu ersetzen und den gesamten Prozess der Essensplanung effizienter zu gestalten.

## Funktionen
- CSV-Import aus Stayinformed: Importiere Essensbestellungen direkt aus den CSV-Exporten der Stayinformed App. Die App erkennt automatisch wichtige Spalten wie Name des Kindes, Gruppe, Nachname der Eltern und die einzelnen Menüfragen/-antworten.
- Wochenansicht & Korrekturen: Eine intuitive Wochenansicht zeigt alle bestellten Mahlzeiten pro Kind und Gruppe. Manuelle Anpassungen sind einfach möglich: Du kannst Menüs ändern oder Mahlzeiten bei Bedarf abbestellen. Änderungen sind visuell hervorgehoben.
- Monatsübersicht (Kinder): Erhalte eine detaillierte Zusammenfassung der Gesamtbestellungen und -kosten pro Kind für den gesamten Monat. Ideal für die transparente Abrechnung mit den Eltern.
- Monatsübersicht (Caterer): Generiere eine übersichtliche Auflistung der täglich bestellten Menüanzahl für den Caterer. Diese Ansicht kann einfach kopiert und für die direkte Bestellung genutzt werden.
- Anpassbare Farben: Weise Gruppen und Menüs individuelle Farben zu, um die visuelle Unterscheidung und Übersichtlichkeit zu verbessern. Die Intensität der Farben ist einstellbar.
- Automatische Datenspeicherung: Deine Daten und Einstellungen werden automatisch und sicher in einer verknüpften .essen-Datei auf deinem lokalen System gespeichert. Du musst dich nicht um manuelles Speichern kümmern.
- Daten-Import/Export: Importiere oder exportiere jederzeit deine gesamten App-Daten (Einstellungen und alle Essenspläne) als .essen-Datei für Backups oder zur Übertragung auf andere Geräte.
- Druckfunktion: Erstelle druckfertige Berichte für den Wochenplan (gruppiert), die monatliche Kinder-Übersicht oder die monatliche Caterer-Übersicht.
- Flexible Spaltenzuordnung: Überprüfe und passe die automatische Spaltenzuordnung für deine CSV-Dateien bei Bedarf manuell in den Einstellungen an.
- Interaktive Sortierung: Sortiere die Tabellen in Wochen- und Monatsansichten nach verschiedenen Kriterien (z.B. Name, Gesamtessen, Kosten), um die Daten nach deinen Bedürfnissen zu organisieren.

## So öffnest du die App
Du kannst die App direkt in deinem Browser verwenden. Klicke einfach auf den folgenden Link:
https://dPandl.github.io/kindergarten-essensplaner/
Es ist keine Installation erforderlich.

## Nutzung
### App starten: 
Wenn du die App zum ersten Mal öffnest, kannst du wählen, ob du mit einer leeren Anwendung beginnen oder bestehende Daten aus einer .essen-Backup-Datei importieren möchtest.
### CSV-Datei importieren:
In der Stayinformed App: Erstelle eine "Nachricht mit Rückmeldung" mit den Essensoptionen (z.B. "Montag Menü 1") und exportiere die Rückmeldungen als CSV-Datei ("Alle Rückmeldungen exportieren" > "Exportieren als CSV-Datei..." > "Alle auswählen").
### Essensplaner: 
Klicke in der App auf den + (Plus)-Button unten rechts. Wähle die entsprechende Woche aus und lade die exportierte CSV-Datei hoch. Die App versucht, die Spalten automatisch zuzuordnen.
### Einstellungen anpassen:
Klicke auf das Zahnrad-Symbol unten rechts.
Hier kannst du den Preis pro Essen festlegen, die Spaltenzuordnung überprüfen und gegebenenfalls manuell anpassen.
Konfiguriere Farben für Gruppen und Menüs, um die Tabellenübersicht zu verbessern.
Wenn du die Spaltenzuordnung geändert hast, klicke auf "Daten neu verarbeiten", um die importierten Essenspläne mit den neuen Einstellungen zu aktualisieren.
Verwalte hier auch die automatische Speicherung deiner Daten in einer verknüpften .essen-Datei.
Essenspläne anzeigen und bearbeiten:
Navigieren zwischen Wochen und Monaten über die Buttons in der oberen Leiste.
In der Wochenansicht kannst du direkt auf die Menüfelder klicken, um Korrekturen vorzunehmen (z.B. Menü ändern oder eine Mahlzeit abbestellen).
Die Monatsansichten bieten automatische Summen für Kinder und Caterer.
Daten sichern & wiederherstellen: Nutze die Import- und Exportoptionen in den Einstellungen, um Backups deiner gesamten App-Daten (.essen-Dateien) zu erstellen oder wiederherzustellen.
Drucken: Klicke auf das Drucker-Symbol in der oberen rechten Ecke, um eine übersichtliche, druckoptimierte Version des aktuellen Plans zu erhalten.

## Über die Entwicklung
Diese Anwendung wurde zu 100% mit der Unterstützung von Gemini Canvas und meinen Inputs entwickelt (Gemini hat jedoch 99% der Arbeit geleistet).

## Lizenz
Diese App ist vollständig kostenlos und quelloffen. Es steht dir frei, sie zu nutzen, zu teilen und anzupassen, wie du möchtest.

## Verwendete Technologien
React (Frontend-Bibliothek)
Vite (Build-Tool)
Tailwind CSS (Styling-Framework)
File System Access API (für direkte Dateiinteraktion im Browser)
IndexedDB (für persistente Speicherung von Dateiverweisen)

## Viel Spaß beim Organisieren deiner Essenspläne!
