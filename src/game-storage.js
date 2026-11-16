function updateStorageWarning(message) {
    storageWarning = message;
    const warning = document.querySelector('#saveWarning');
    if (warning) {
        warning.textContent = message;
        warning.hidden = !message;
    }
}

function persistSession() {
    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(makeProgressBackup(save, pieces, recentlyUsed, trailFocusId)));
        updateStorageWarning('');
        return true;
    } catch {
        updateStorageWarning('O navegador não conseguiu salvar a partida. Exporte seu progresso em Ajuda.');
        return false;
    }
}

function applySession({ progress, board, recent, trailFocusId: focus = null }) {
    save = progress;
    pieces = board;
    recentlyUsed = recent;
    trailFocusId = focus;
    nextInstance = Math.max(1, ...pieces.map(p => p.instanceId + 1));
}

function loadSession() {
    const initial = makeInitialSave(engine.cards);
    save = initial;
    const read = (key, fallback) => {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        try { return JSON.parse(raw); } catch { return fallback; }
    };
    try {
        const current = read(SESSION_KEY, null);
        if (current?.format === PROGRESS_FORMAT && isProgress(current.progress) &&
            Array.isArray(current.board) && Array.isArray(current.recent)) {
            applySession(readProgressBackup(current, engine));
            return;
        }
        const board = read(BOARD_KEY, []);
        const recent = read(RECENT_KEY, []);
        const legacy = makeProgressBackup(restoreSave(read(SAVE_KEY, initial), engine),
            Array.isArray(board) ? board : [], Array.isArray(recent) ? recent : []);
        applySession(readProgressBackup(legacy, engine));
        if (localStorage.getItem(SESSION_KEY)) {
            updateStorageWarning('O progresso recente não pôde ser lido. Confira a partida e restaure um arquivo em Ajuda.');
        }
    } catch {
        updateStorageWarning('O progresso salvo está indisponível. Você pode exportar a partida em Ajuda.');
    }
}

function exportProgress() {
    const blob = new Blob([JSON.stringify(makeProgressBackup(save, pieces, recentlyUsed, trailFocusId), null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'mineralchemy-progresso.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function previewProgress(file) {
    pendingImport = null;
    importNotice = '';
    pendingProgressFile = file;
    if (!file || modal !== 'help') return;
    try {
        if (file.size > 8 * 1024 * 1024) throw new Error('Selecione um arquivo de progresso de até 8 MB.');
        const backup = readProgressBackup(JSON.parse(await file.text()), engine);
        if (pendingProgressFile !== file || modal !== 'help') return;
        pendingImport = backup;
        importNotice = `O arquivo contém ${backup.progress.discovered.length} materiais e ${backup.progress.recorded.length} registros de reação. Confirme para substituir a partida atual.`;
    } catch (error) {
        if (pendingProgressFile !== file || modal !== 'help') return;
        importNotice = error instanceof SyntaxError ? 'O arquivo não contém JSON válido.' : error.message;
    }
    updateModal(pendingImport ? '[data-action="confirm-import"]' : '#importProgress');
}
