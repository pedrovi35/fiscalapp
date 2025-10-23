// Sistema Fiscal - JavaScript Principal
// Padrão: Module Pattern + Observer Pattern

class SistemaFiscal {
    constructor() {
        this.calendar = null;
        this.websocket = null;
        this.obrigacoes = [];
        this.clientes = [];
        this.responsaveis = [];
        this.filtrosAtivos = {};
        this.notificacoes = [];
        
        this.init();
    }

    init() {
        this.configurarWebSocket();
        this.carregarDadosIniciais();
        this.configurarEventos();
        this.configurarCalendario();
        this.configurarAcessibilidade();
    }

    // WebSocket para colaboração em tempo real
    configurarWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/ws`;
        
        this.websocket = new WebSocket(wsUrl);
        
        this.websocket.onopen = () => {
            console.log('WebSocket conectado');
            this.mostrarNotificacao('Conectado ao sistema', 'success');
        };
        
        this.websocket.onmessage = (event) => {
            const notificacao = JSON.parse(event.data);
            this.processarNotificacao(notificacao);
        };
        
        this.websocket.onclose = () => {
            console.log('WebSocket desconectado');
            this.mostrarNotificacao('Conexão perdida. Tentando reconectar...', 'warning');
            // Tentar reconectar após 5 segundos
            setTimeout(() => this.configurarWebSocket(), 5000);
        };
        
        this.websocket.onerror = (error) => {
            console.error('Erro WebSocket:', error);
            this.mostrarNotificacao('Erro de conexão', 'danger');
        };
    }

    // Carregar dados iniciais
    async carregarDadosIniciais() {
        try {
            await Promise.all([
                this.carregarObrigacoes(),
                this.carregarClientes(),
                this.carregarResponsaveis()
            ]);
            
            this.atualizarDashboard();
            this.atualizarCalendario();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.mostrarNotificacao('Erro ao carregar dados', 'danger');
        }
    }

    // Carregar obrigações
    async carregarObrigacoes() {
        try {
            const response = await fetch('/api/obrigacoes');
            if (response.ok) {
                this.obrigacoes = await response.json();
            }
        } catch (error) {
            console.error('Erro ao carregar obrigações:', error);
        }
    }

    // Carregar clientes
    async carregarClientes() {
        try {
            const response = await fetch('/api/clientes');
            if (response.ok) {
                this.clientes = await response.json();
                this.atualizarSelectClientes();
            }
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        }
    }

    // Carregar responsáveis
    async carregarResponsaveis() {
        try {
            const response = await fetch('/api/responsaveis');
            if (response.ok) {
                this.responsaveis = await response.json();
                this.atualizarSelectResponsaveis();
            }
        } catch (error) {
            console.error('Erro ao carregar responsáveis:', error);
        }
    }

    // Configurar eventos
    configurarEventos() {
        // Eventos de navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navegarPara(link.getAttribute('onclick'));
            });
        });

        // Eventos de formulário
        document.getElementById('formNovaObrigacao').addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarObrigacao();
        });

        // Eventos de filtros
        document.querySelectorAll('.form-select').forEach(select => {
            select.addEventListener('change', () => {
                this.aplicarFiltros();
            });
        });

        // Eventos de teclado para acessibilidade
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch(e.key) {
                    case '1': this.showDashboard(); break;
                    case '2': this.showCalendar(); break;
                    case '3': this.showObrigacoes(); break;
                    case '4': this.showClientes(); break;
                    case '5': this.showResponsaveis(); break;
                    case '6': this.showHistorico(); break;
                }
            }
        });
    }

    // Configurar calendário FullCalendar
    configurarCalendario() {
        const calendarEl = document.getElementById('calendarEl');
        
        this.calendar = new FullCalendar.Calendar(calendarEl, {
            locale: 'pt-br',
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,listWeek'
            },
            buttonText: {
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                list: 'Lista'
            },
            events: this.obrigacoes.map(obrigacao => ({
                id: obrigacao.id,
                title: obrigacao.nome,
                start: obrigacao.dataVencimento,
                backgroundColor: this.getCorTipo(obrigacao.tipo),
                borderColor: this.getCorTipo(obrigacao.tipo),
                textColor: obrigacao.tipo === 'PARCELAMENTO' ? '#000' : '#fff',
                extendedProps: {
                    tipo: obrigacao.tipo,
                    cliente: obrigacao.cliente?.nome,
                    responsavel: obrigacao.responsavel?.nome,
                    statusUrgencia: obrigacao.statusUrgencia,
                    concluida: obrigacao.concluida
                }
            })),
            eventClick: (info) => {
                this.mostrarDetalhesObrigacao(info.event);
            },
            eventDrop: (info) => {
                this.atualizarDataObrigacao(info.event);
            },
            eventResize: (info) => {
                this.atualizarDataObrigacao(info.event);
            },
            dateClick: (info) => {
                this.criarObrigacaoNaData(info.dateStr);
            },
            eventDidMount: (info) => {
                this.configurarTooltipEvento(info);
            }
        });

        this.calendar.render();
    }

    // Configurar acessibilidade
    configurarAcessibilidade() {
        // Adicionar atributos ARIA
        document.querySelectorAll('.nav-link').forEach((link, index) => {
            link.setAttribute('aria-label', `Navegar para ${link.textContent.trim()}`);
            link.setAttribute('tabindex', '0');
        });

        // Configurar navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Melhorar navegação por tab
                this.melhorarNavegacaoTab(e);
            }
        });

        // Configurar alto contraste
        this.configurarAltoContraste();
    }

    // Navegação entre seções
    navegarPara(funcao) {
        // Ocultar todas as seções
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });

        // Remover classe active de todos os links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Executar função de navegação
        eval(funcao);
    }

    // Mostrar Dashboard
    showDashboard() {
        document.getElementById('dashboard').style.display = 'block';
        document.querySelector('[onclick="showDashboard()"]').classList.add('active');
        this.atualizarDashboard();
    }

    // Mostrar Calendário
    showCalendar() {
        document.getElementById('calendar').style.display = 'block';
        document.querySelector('[onclick="showCalendar()"]').classList.add('active');
        this.atualizarCalendario();
    }

    // Mostrar Obrigações
    showObrigacoes() {
        document.getElementById('obrigacoes').style.display = 'block';
        document.querySelector('[onclick="showObrigacoes()"]').classList.add('active');
    }

    // Mostrar Clientes
    showClientes() {
        document.getElementById('clientes').style.display = 'block';
        document.querySelector('[onclick="showClientes()"]').classList.add('active');
    }

    // Mostrar Responsáveis
    showResponsaveis() {
        document.getElementById('responsaveis').style.display = 'block';
        document.querySelector('[onclick="showResponsaveis()"]').classList.add('active');
    }

    // Mostrar Histórico
    showHistorico() {
        document.getElementById('historico').style.display = 'block';
        document.querySelector('[onclick="showHistorico()"]').classList.add('active');
    }

    // Atualizar Dashboard
    atualizarDashboard() {
        this.atualizarEstatisticas();
        this.atualizarProximasVencimentos();
        this.atualizarResumoTipos();
    }

    // Atualizar estatísticas
    atualizarEstatisticas() {
        const vencidas = this.obrigacoes.filter(o => o.statusUrgencia === 'VENCIDA').length;
        const criticas = this.obrigacoes.filter(o => o.statusUrgencia === 'CRÍTICA').length;
        const urgentes = this.obrigacoes.filter(o => o.statusUrgencia === 'URGENTE').length;
        const normais = this.obrigacoes.filter(o => o.statusUrgencia === 'NORMAL').length;

        document.getElementById('totalVencidas').textContent = vencidas;
        document.getElementById('totalCriticas').textContent = criticas;
        document.getElementById('totalUrgentes').textContent = urgentes;
        document.getElementById('totalNormais').textContent = normais;
    }

    // Atualizar próximas vencimentos
    atualizarProximasVencimentos() {
        const container = document.getElementById('proximasVencimentos');
        const proximas = this.obrigacoes
            .filter(o => !o.concluida && o.diasParaVencimento <= 7)
            .sort((a, b) => a.diasParaVencimento - b.diasParaVencimento)
            .slice(0, 10);

        if (proximas.length === 0) {
            container.innerHTML = '<div class="text-center text-muted"><i class="fas fa-check-circle fa-2x mb-3"></i><p>Nenhuma obrigação próxima do vencimento</p></div>';
            return;
        }

        container.innerHTML = proximas.map(obrigacao => `
            <div class="d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                <div>
                    <h6 class="mb-1">${obrigacao.nome}</h6>
                    <small class="text-muted">${obrigacao.cliente?.nome || 'Sem cliente'} - ${obrigacao.responsavel?.nome || 'Sem responsável'}</small>
                </div>
                <div class="text-end">
                    <span class="status-badge status-${obrigacao.statusUrgencia.toLowerCase()}">${obrigacao.statusUrgencia}</span>
                    <div class="small text-muted">${obrigacao.diasParaVencimento} dias</div>
                </div>
            </div>
        `).join('');
    }

    // Atualizar resumo por tipos
    atualizarResumoTipos() {
        const container = document.getElementById('resumoTipos');
        const tipos = {};

        this.obrigacoes.forEach(obrigacao => {
            if (!tipos[obrigacao.tipo]) {
                tipos[obrigacao.tipo] = 0;
            }
            tipos[obrigacao.tipo]++;
        });

        container.innerHTML = Object.entries(tipos).map(([tipo, count]) => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="tipo-badge tipo-${tipo.toLowerCase()}">${this.getNomeTipo(tipo)}</span>
                <span class="fw-bold">${count}</span>
            </div>
        `).join('');
    }

    // Atualizar calendário
    atualizarCalendario() {
        if (this.calendar) {
            this.calendar.removeAllEvents();
            this.calendar.addEventSource(this.obrigacoes.map(obrigacao => ({
                id: obrigacao.id,
                title: obrigacao.nome,
                start: obrigacao.dataVencimento,
                backgroundColor: this.getCorTipo(obrigacao.tipo),
                borderColor: this.getCorTipo(obrigacao.tipo),
                textColor: obrigacao.tipo === 'PARCELAMENTO' ? '#000' : '#fff',
                extendedProps: {
                    tipo: obrigacao.tipo,
                    cliente: obrigacao.cliente?.nome,
                    responsavel: obrigacao.responsavel?.nome,
                    statusUrgencia: obrigacao.statusUrgencia,
                    concluida: obrigacao.concluida
                }
            })));
        }
    }

    // Mostrar nova obrigação
    showNovaObrigacao() {
        const modal = new bootstrap.Modal(document.getElementById('modalNovaObrigacao'));
        modal.show();
    }

    // Salvar obrigação
    async salvarObrigacao() {
        const formData = {
            nome: document.getElementById('nomeObrigacao').value,
            tipo: document.getElementById('tipoObrigacao').value,
            descricao: document.getElementById('descricaoObrigacao').value,
            clienteId: document.getElementById('clienteObrigacao').value || null,
            responsavelId: document.getElementById('responsavelObrigacao').value || null,
            dataVencimento: document.getElementById('dataVencimento').value,
            tipoRecorrencia: document.getElementById('tipoRecorrencia').value,
            diaMesRecorrencia: document.getElementById('diaMesRecorrencia').value || null,
            diasRecorrencia: document.getElementById('diasRecorrencia').value || null,
            ajustarFinaisSemana: document.getElementById('ajustarFinaisSemana').checked,
            ajustarFeriados: document.getElementById('ajustarFeriados').checked,
            usuarioEditor: 'Usuário Atual'
        };

        try {
            const response = await fetch('/api/obrigacoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.mostrarNotificacao('Obrigação criada com sucesso!', 'success');
                bootstrap.Modal.getInstance(document.getElementById('modalNovaObrigacao')).hide();
                document.getElementById('formNovaObrigacao').reset();
                await this.carregarObrigacoes();
                this.atualizarDashboard();
                this.atualizarCalendario();
            } else {
                throw new Error('Erro ao criar obrigação');
            }
        } catch (error) {
            console.error('Erro ao salvar obrigação:', error);
            this.mostrarNotificacao('Erro ao criar obrigação', 'danger');
        }
    }

    // Mostrar notificação
    mostrarNotificacao(mensagem, tipo = 'info') {
        const container = document.getElementById('notifications');
        const id = Date.now();
        
        const notification = document.createElement('div');
        notification.className = `alert alert-${tipo} alert-dismissible fade show`;
        notification.innerHTML = `
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        container.appendChild(notification);
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Processar notificação WebSocket
    processarNotificacao(notificacao) {
        this.mostrarNotificacao(notificacao.mensagem, 'info');
        
        // Atualizar dados se necessário
        if (notificacao.tipo === 'OBRIGACAO_CRIADA' || 
            notificacao.tipo === 'OBRIGACAO_ATUALIZADA' || 
            notificacao.tipo === 'OBRIGACAO_CONCLUIDA') {
            this.carregarObrigacoes().then(() => {
                this.atualizarDashboard();
                this.atualizarCalendario();
            });
        }
    }

    // Utilitários
    getCorTipo(tipo) {
        const cores = {
            'IMPOSTO': '#28a745',
            'PARCELAMENTO': '#ffc107',
            'DECLARACAO': '#17a2b8',
            'DOCUMENTO': '#6f42c1',
            'OUTROS': '#6c757d'
        };
        return cores[tipo] || '#6c757d';
    }

    getNomeTipo(tipo) {
        const nomes = {
            'IMPOSTO': 'Imposto',
            'PARCELAMENTO': 'Parcelamento',
            'DECLARACAO': 'Declaração',
            'DOCUMENTO': 'Documento',
            'OUTROS': 'Outros'
        };
        return nomes[tipo] || tipo;
    }

    atualizarSelectClientes() {
        const select = document.getElementById('clienteObrigacao');
        const filtroSelect = document.getElementById('filtroCliente');
        
        const options = this.clientes.map(cliente => 
            `<option value="${cliente.id}">${cliente.nome}</option>`
        ).join('');
        
        select.innerHTML = '<option value="">Selecione um cliente</option>' + options;
        filtroSelect.innerHTML = '<option value="">Todos os clientes</option>' + options;
    }

    atualizarSelectResponsaveis() {
        const select = document.getElementById('responsavelObrigacao');
        const filtroSelect = document.getElementById('filtroResponsavel');
        
        const options = this.responsaveis.map(responsavel => 
            `<option value="${responsavel.id}">${responsavel.nome}</option>`
        ).join('');
        
        select.innerHTML = '<option value="">Selecione um responsável</option>' + options;
        filtroSelect.innerHTML = '<option value="">Todos os responsáveis</option>' + options;
    }

    // Filtros
    toggleFiltros() {
        const panel = document.getElementById('filtrosPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    aplicarFiltros() {
        this.filtrosAtivos = {
            clienteId: document.getElementById('filtroCliente').value,
            responsavelId: document.getElementById('filtroResponsavel').value,
            tipo: document.getElementById('filtroTipo').value,
            concluida: document.getElementById('filtroStatus').value
        };
        
        this.atualizarCalendario();
    }

    limparFiltros() {
        document.getElementById('filtroCliente').value = '';
        document.getElementById('filtroResponsavel').value = '';
        document.getElementById('filtroTipo').value = '';
        document.getElementById('filtroStatus').value = '';
        
        this.filtrosAtivos = {};
        this.atualizarCalendario();
    }

    // Acessibilidade
    toggleHighContrast() {
        document.body.classList.toggle('high-contrast');
        localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
    }

    configurarAltoContraste() {
        if (localStorage.getItem('highContrast') === 'true') {
            document.body.classList.add('high-contrast');
        }
    }

    melhorarNavegacaoTab(e) {
        // Implementar navegação melhorada por tab
    }

    toggleNotifications() {
        // Implementar toggle de notificações
    }
}

// Inicializar sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.sistemaFiscal = new SistemaFiscal();
});

// Funções globais para compatibilidade com HTML
function showDashboard() { window.sistemaFiscal.showDashboard(); }
function showCalendar() { window.sistemaFiscal.showCalendar(); }
function showObrigacoes() { window.sistemaFiscal.showObrigacoes(); }
function showClientes() { window.sistemaFiscal.showClientes(); }
function showResponsaveis() { window.sistemaFiscal.showResponsaveis(); }
function showHistorico() { window.sistemaFiscal.showHistorico(); }
function showNovaObrigacao() { window.sistemaFiscal.showNovaObrigacao(); }
function salvarObrigacao() { window.sistemaFiscal.salvarObrigacao(); }
function toggleFiltros() { window.sistemaFiscal.toggleFiltros(); }
function aplicarFiltros() { window.sistemaFiscal.aplicarFiltros(); }
function limparFiltros() { window.sistemaFiscal.limparFiltros(); }
function toggleHighContrast() { window.sistemaFiscal.toggleHighContrast(); }
function toggleNotifications() { window.sistemaFiscal.toggleNotifications(); }
