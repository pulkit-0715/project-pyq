const fs = require('fs');
const path = require('path');

const pyqsDir = path.join(__dirname, 'pyqs');
const outputFile = path.join(__dirname, 'papers.json');

function generatePapersJson() {
    const database = {};

    if (!fs.existsSync(pyqsDir)) {
        console.error(`❌ Error: 'pyqs' directory not found at ${pyqsDir}`);
        return;
    }

    // Step 1: Read Semesters exactly as named (e.g., "semester1", "semester2")
    const semesters = fs.readdirSync(pyqsDir);
    semesters.forEach(semFolder => {
        const semPath = path.join(pyqsDir, semFolder);
        if (!fs.statSync(semPath).isDirectory()) return;

        database[semFolder] = {};

        // Step 2: Read Subjects exactly as named (e.g., "dsa", "physics", "aem")
        const subjects = fs.readdirSync(semPath);
        subjects.forEach(subFolder => {
            const subPath = path.join(semPath, subFolder);
            if (!fs.statSync(subPath).isDirectory()) return;

            database[semFolder][subFolder] = {};

            // Step 3: Read Exam Types exactly as named (e.g., "midsem", "endsem", "quiz")
            const examTypes = fs.readdirSync(subPath);
            examTypes.forEach(examFolder => {
                const examPath = path.join(subPath, examFolder);
                if (!fs.statSync(examPath).isDirectory()) return;

                database[semFolder][subFolder][examFolder] = [];

                // Step 4: Scan PDF files
                const files = fs.readdirSync(examPath);
                files.forEach(file => {
                    if (path.extname(file).toLowerCase() === '.pdf') {
                        const cleanTitle = path.basename(file, '.pdf');
                        const relativeWebPath = `pyqs/${semFolder}/${subFolder}/${examFolder}/${file}`;

                        database[semFolder][subFolder][examFolder].push({
                            title: cleanTitle,
                            file: relativeWebPath
                        });
                    }
                });
            });
        });
    });

    fs.writeFileSync(outputFile, JSON.stringify(database, null, 4), 'utf-8');
    console.log(`\n============== ARCHIVE BUILDER ==============`);
    console.log(`🚀 Success! 'papers.json' generated seamlessly.`);
    console.log(`=============================================\n`);
}

generatePapersJson();