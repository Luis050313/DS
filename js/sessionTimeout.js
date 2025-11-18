// Temporizador de inactividad de sesión
class SessionTimeoutManager {
    constructor() {
        this.timeoutDuration = 2 * 60 * 1000; // 2 minutos en milisegundos
        this.warningDuration = 10 * 1000; // 10 segundos para el modal
        this.timer = null;
        this.warningTimer = null;
        this.isPaused = false;
        this.pausedTime = 0;
        this.lastActivity = Date.now();
        this.hiddenStartTime = null;

        this.init();
    }

    init() {
        // Iniciar temporizador al cargar
        this.startTimer();

        // Eventos de actividad
        const events = ['mousemove', 'keydown', 'mousedown', 'scroll'];
        events.forEach(event => {
            document.addEventListener(event, () => this.resetTimer(), true);
        });

        // Page Visibility API
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());

        // Crear modal de advertencia
        this.createWarningModal();
    }

    startTimer() {
        this.clearTimers();
        this.timer = setTimeout(() => this.showWarning(), this.timeoutDuration);
    }

    resetTimer() {
        if (!this.isPaused) {
            this.lastActivity = Date.now();
            this.startTimer();
        }
    }

    clearTimers() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
            this.warningTimer = null;
        }
    }

    showWarning() {
        const modal = document.getElementById('session-warning-modal');
        modal.style.display = 'flex';

        // Temporizador para cerrar sesión automáticamente
        this.warningTimer = setTimeout(() => {
            this.logout();
        }, this.warningDuration);
    }

    hideWarning() {
        const modal = document.getElementById('session-warning-modal');
        modal.style.display = 'none';
        this.clearTimers();
        this.startTimer();
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Pestaña oculta: pausar temporizador
            this.isPaused = true;
            this.hiddenStartTime = Date.now();
            this.clearTimers();
        } else {
            // Pestaña visible: verificar tiempo fuera
            if (this.hiddenStartTime) {
                const timeAway = Date.now() - this.hiddenStartTime;
                if (timeAway >= this.timeoutDuration) {
                    // Tiempo fuera supera el límite: cerrar sesión
                    this.logout();
                } else {
                    // Reanudar temporizador
                    this.isPaused = false;
                    this.startTimer();
                }
            }
        }
    }

    logout() {
        // Limpiar token y redirigir
        localStorage.removeItem('token');
        window.location.href = '../index.html';
    }

    createWarningModal() {
        const modal = document.createElement('div');
        modal.id = 'session-warning-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>¿Quieres continuar?</h2>
                <div class="buttons">
                    <button id="continue-session-btn">Sí</button>
                    <button id="logout-session-btn">No</button>
                </div>
            </div>
        `;
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        modal.querySelector('.modal-content').style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            max-width: 400px;
        `;
        modal.querySelector('h2').style.cssText = 'color: #d9534f; margin-bottom: 20px;';
        modal.querySelector('.buttons').style.cssText = 'display: flex; justify-content: space-around;';
        modal.querySelectorAll('button').forEach(btn => {
            btn.style.cssText = `
                background: #5cb85c;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
            `;
        });

        document.body.appendChild(modal);

        // Evento para continuar sesión
        document.getElementById('continue-session-btn').addEventListener('click', () => this.hideWarning());
        // Evento para cerrar sesión
        document.getElementById('logout-session-btn').addEventListener('click', () => this.logout());
    }
}

// Iniciar el manager cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new SessionTimeoutManager();
});
